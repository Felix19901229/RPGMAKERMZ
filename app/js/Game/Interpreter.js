import { Graphics, Input, Point, Utils, Video } from "../Core/index.js";
export class Game_Interpreter {
    _depth;
    _branch;
    _indent;
    _frameCount;
    _freezeChecker;
    _mapId;
    _eventId;
    _list;
    _index;
    _waitCount;
    _waitMode;
    _comments;
    _characterId;
    _childInterpreter;
    constructor(...args) {
        this.initialize(...args);
    }
    initialize(depth = 0) {
        this._depth = depth;
        this.checkOverflow();
        this.clear();
        this._branch = {};
        this._indent = 0;
        this._frameCount = 0;
        this._freezeChecker = 0;
    }
    checkOverflow() {
        if (this._depth >= 100) {
            throw new Error("Common event calls exceeded the limit");
        }
    }
    clear() {
        this._mapId = 0;
        this._eventId = 0;
        this._list = null;
        this._index = 0;
        this._waitCount = 0;
        this._waitMode = "";
        this._comments = [];
        this._characterId = 0;
        this._childInterpreter = null;
    }
    setup(list, eventId = 0) {
        this.clear();
        this._mapId = $gameMap.mapId();
        this._eventId = eventId;
        this._list = list;
        this.loadImages();
    }
    loadImages() {
        const list = this._list.slice(0, 200);
        for (const command of list) {
            switch (command.code) {
                case 101:
                    ImageManager.loadFace(command.parameters[0]);
                    break;
                case 231:
                    ImageManager.loadPicture(command.parameters[1]);
                    break;
            }
        }
    }
    eventId() {
        return this._eventId;
    }
    isOnCurrentMap() {
        return this._mapId === $gameMap.mapId();
    }
    setupReservedCommonEvent() {
        if ($gameTemp.isCommonEventReserved()) {
            const commonEvent = $gameTemp.retrieveCommonEvent();
            if (commonEvent) {
                this.setup(commonEvent.list);
                return true;
            }
        }
        return false;
    }
    isRunning() {
        return !!this._list;
    }
    update() {
        while (this.isRunning()) {
            if (this.updateChild() || this.updateWait()) {
                break;
            }
            if (SceneManager.isSceneChanging()) {
                break;
            }
            if (!this.executeCommand()) {
                break;
            }
            if (this.checkFreeze()) {
                break;
            }
        }
    }
    updateChild() {
        if (this._childInterpreter) {
            this._childInterpreter.update();
            if (this._childInterpreter.isRunning()) {
                return true;
            }
            else {
                this._childInterpreter = null;
            }
        }
        return false;
    }
    updateWait() {
        return this.updateWaitCount() || this.updateWaitMode();
    }
    updateWaitCount() {
        if (this._waitCount > 0) {
            this._waitCount--;
            return true;
        }
        return false;
    }
    updateWaitMode() {
        let character = null;
        let waiting = false;
        switch (this._waitMode) {
            case "message":
                waiting = $gameMessage.isBusy();
                break;
            case "transfer":
                waiting = $gamePlayer.isTransferring();
                break;
            case "scroll":
                waiting = $gameMap.isScrolling();
                break;
            case "route":
                character = this.character(this._characterId);
                waiting = character && character.isMoveRouteForcing();
                break;
            case "animation":
                character = this.character(this._characterId);
                waiting = character && character.isAnimationPlaying();
                break;
            case "balloon":
                character = this.character(this._characterId);
                waiting = character && character.isBalloonPlaying();
                break;
            case "gather":
                waiting = $gamePlayer.areFollowersGathering();
                break;
            case "action":
                waiting = BattleManager.isActionForced();
                break;
            case "video":
                waiting = Video.isPlaying();
                break;
            case "image":
                waiting = !ImageManager.isReady();
                break;
        }
        if (!waiting) {
            this._waitMode = "";
        }
        return waiting;
    }
    setWaitMode(waitMode) {
        this._waitMode = waitMode;
    }
    wait(duration) {
        this._waitCount = duration;
    }
    fadeSpeed() {
        return 24;
    }
    executeCommand() {
        const command = this.currentCommand();
        if (command) {
            this._indent = command.indent;
            const methodName = "command" + command.code;
            if (typeof this[methodName] === "function") {
                if (!this[methodName](command.parameters)) {
                    return false;
                }
            }
            this._index++;
        }
        else {
            this.terminate();
        }
        return true;
    }
    checkFreeze() {
        if (this._frameCount !== Graphics.frameCount) {
            this._frameCount = Graphics.frameCount;
            this._freezeChecker = 0;
        }
        if (this._freezeChecker++ >= 100000) {
            return true;
        }
        else {
            return false;
        }
    }
    terminate() {
        this._list = null;
        this._comments = "";
    }
    skipBranch() {
        while (this._list[this._index + 1].indent > this._indent) {
            this._index++;
        }
    }
    currentCommand() {
        return this._list[this._index];
    }
    nextEventCode() {
        const command = this._list[this._index + 1];
        if (command) {
            return command.code;
        }
        else {
            return 0;
        }
    }
    iterateActorId(param, callback) {
        if (param === 0) {
            $gameParty.members().forEach(callback);
        }
        else {
            const actor = $gameActors.actor(param);
            if (actor) {
                callback(actor);
            }
        }
    }
    iterateActorEx(param1, param2, callback) {
        if (param1 === 0) {
            this.iterateActorId(param2, callback);
        }
        else {
            this.iterateActorId($gameVariables.value(param2), callback);
        }
    }
    iterateActorIndex(param, callback) {
        if (param < 0) {
            $gameParty.members().forEach(callback);
        }
        else {
            const actor = $gameParty.members()[param];
            if (actor) {
                callback(actor);
            }
        }
    }
    iterateEnemyIndex(param, callback) {
        if (param < 0) {
            $gameTroop.members().forEach(callback);
        }
        else {
            const enemy = $gameTroop.members()[param];
            if (enemy) {
                callback(enemy);
            }
        }
    }
    iterateBattler(param1, param2, callback) {
        if ($gameParty.inBattle()) {
            if (param1 === 0) {
                this.iterateEnemyIndex(param2, callback);
            }
            else {
                this.iterateActorId(param2, callback);
            }
        }
    }
    character(param) {
        if ($gameParty.inBattle()) {
            return null;
        }
        else if (param < 0) {
            return $gamePlayer;
        }
        else if (this.isOnCurrentMap()) {
            return $gameMap.event(param > 0 ? param : this._eventId);
        }
        else {
            return null;
        }
    }
    operateValue(operation, operandType, operand) {
        const value = operandType === 0 ? operand : $gameVariables.value(operand);
        return operation === 0 ? value : -value;
    }
    changeHp(target, value, allowDeath) {
        if (target.isAlive()) {
            if (!allowDeath && target.hp <= -value) {
                value = 1 - target.hp;
            }
            target.gainHp(value);
            if (target.isDead()) {
                target.performCollapse();
            }
        }
    }
    command101(params) {
        if ($gameMessage.isBusy()) {
            return false;
        }
        $gameMessage.setFaceImage(params[0], params[1]);
        $gameMessage.setBackground(params[2]);
        $gameMessage.setPositionType(params[3]);
        $gameMessage.setSpeakerName(params[4]);
        while (this.nextEventCode() === 401) {
            this._index++;
            $gameMessage.add(this.currentCommand().parameters[0]);
        }
        switch (this.nextEventCode()) {
            case 102:
                this._index++;
                this.setupChoices(this.currentCommand().parameters);
                break;
            case 103:
                this._index++;
                this.setupNumInput(this.currentCommand().parameters);
                break;
            case 104:
                this._index++;
                this.setupItemChoice(this.currentCommand().parameters);
                break;
        }
        this.setWaitMode("message");
        return true;
    }
    command102(params) {
        if ($gameMessage.isBusy()) {
            return false;
        }
        this.setupChoices(params);
        this.setWaitMode("message");
        return true;
    }
    setupChoices(params) {
        const choices = params[0].clone();
        const cancelType = params[1] < choices.length ? params[1] : -2;
        const defaultType = params.length > 2 ? params[2] : 0;
        const positionType = params.length > 3 ? params[3] : 2;
        const background = params.length > 4 ? params[4] : 0;
        $gameMessage.setChoices(choices, defaultType, cancelType);
        $gameMessage.setChoiceBackground(background);
        $gameMessage.setChoicePositionType(positionType);
        $gameMessage.setChoiceCallback(n => {
            this._branch[this._indent] = n;
        });
    }
    command402(params) {
        if (this._branch[this._indent] !== params[0]) {
            this.skipBranch();
        }
        return true;
    }
    command403() {
        if (this._branch[this._indent] >= 0) {
            this.skipBranch();
        }
        return true;
    }
    command103(params) {
        if ($gameMessage.isBusy()) {
            return false;
        }
        this.setupNumInput(params);
        this.setWaitMode("message");
        return true;
    }
    setupNumInput(params) {
        $gameMessage.setNumberInput(params[0], params[1]);
    }
    command104(params) {
        if ($gameMessage.isBusy()) {
            return false;
        }
        this.setupItemChoice(params);
        this.setWaitMode("message");
        return true;
    }
    setupItemChoice(params) {
        $gameMessage.setItemChoice(params[0], params[1] || 2);
    }
    command105(params) {
        if ($gameMessage.isBusy()) {
            return false;
        }
        $gameMessage.setScroll(params[0], params[1]);
        while (this.nextEventCode() === 405) {
            this._index++;
            $gameMessage.add(this.currentCommand().parameters[0]);
        }
        this.setWaitMode("message");
        return true;
    }
    command108(params) {
        this._comments = [params[0]];
        while (this.nextEventCode() === 408) {
            this._index++;
            this._comments.push(this.currentCommand().parameters[0]);
        }
        return true;
    }
    command111(params) {
        let result = false;
        let value1, value2;
        let actor, enemy, character;
        switch (params[0]) {
            case 0:
                result = $gameSwitches.value(params[1]) === (params[2] === 0);
                break;
            case 1:
                value1 = $gameVariables.value(params[1]);
                if (params[2] === 0) {
                    value2 = params[3];
                }
                else {
                    value2 = $gameVariables.value(params[3]);
                }
                switch (params[4]) {
                    case 0:
                        result = value1 === value2;
                        break;
                    case 1:
                        result = value1 >= value2;
                        break;
                    case 2:
                        result = value1 <= value2;
                        break;
                    case 3:
                        result = value1 > value2;
                        break;
                    case 4:
                        result = value1 < value2;
                        break;
                    case 5:
                        result = value1 !== value2;
                        break;
                }
                break;
            case 2:
                if (this._eventId > 0) {
                    const key = [this._mapId, this._eventId, params[1]];
                    result = $gameSelfSwitches.value(key) === (params[2] === 0);
                }
                break;
            case 3:
                if ($gameTimer.isWorking()) {
                    if (params[2] === 0) {
                        result = $gameTimer.seconds() >= params[1];
                    }
                    else {
                        result = $gameTimer.seconds() <= params[1];
                    }
                }
                break;
            case 4:
                actor = $gameActors.actor(params[1]);
                if (actor) {
                    const n = params[3];
                    switch (params[2]) {
                        case 0:
                            result = $gameParty.members().includes(actor);
                            break;
                        case 1:
                            result = actor.name() === n;
                            break;
                        case 2:
                            result = actor.isClass($dataClasses[n]);
                            break;
                        case 3:
                            result = actor.hasSkill(n);
                            break;
                        case 4:
                            result = actor.hasWeapon($dataWeapons[n]);
                            break;
                        case 5:
                            result = actor.hasArmor($dataArmors[n]);
                            break;
                        case 6:
                            result = actor.isStateAffected(n);
                            break;
                    }
                }
                break;
            case 5:
                enemy = $gameTroop.members()[params[1]];
                if (enemy) {
                    switch (params[2]) {
                        case 0:
                            result = enemy.isAlive();
                            break;
                        case 1:
                            result = enemy.isStateAffected(params[3]);
                            break;
                    }
                }
                break;
            case 6:
                character = this.character(params[1]);
                if (character) {
                    result = character.direction() === params[2];
                }
                break;
            case 7:
                switch (params[2]) {
                    case 0:
                        result = $gameParty.gold() >= params[1];
                        break;
                    case 1:
                        result = $gameParty.gold() <= params[1];
                        break;
                    case 2:
                        result = $gameParty.gold() < params[1];
                        break;
                }
                break;
            case 8:
                result = $gameParty.hasItem($dataItems[params[1]]);
                break;
            case 9:
                result = $gameParty.hasItem($dataWeapons[params[1]], params[2]);
                break;
            case 10:
                result = $gameParty.hasItem($dataArmors[params[1]], params[2]);
                break;
            case 11:
                switch (params[2] || 0) {
                    case 0:
                        result = Input.isPressed(params[1]);
                        break;
                    case 1:
                        result = Input.isTriggered(params[1]);
                        break;
                    case 2:
                        result = Input.isRepeated(params[1]);
                        break;
                }
                break;
            case 12:
                result = !!eval(params[1]);
                break;
            case 13:
                result = $gamePlayer.vehicle() === $gameMap.vehicle(params[1]);
                break;
        }
        this._branch[this._indent] = result;
        if (this._branch[this._indent] === false) {
            this.skipBranch();
        }
        return true;
    }
    command411() {
        if (this._branch[this._indent] !== false) {
            this.skipBranch();
        }
        return true;
    }
    command112() {
        return true;
    }
    command413() {
        do {
            this._index--;
        } while (this.currentCommand().indent !== this._indent);
        return true;
    }
    command113() {
        let depth = 0;
        while (this._index < this._list.length - 1) {
            this._index++;
            const command = this.currentCommand();
            if (command.code === 112) {
                depth++;
            }
            if (command.code === 413) {
                if (depth > 0) {
                    depth--;
                }
                else {
                    break;
                }
            }
        }
        return true;
    }
    command115() {
        this._index = this._list.length;
        return true;
    }
    command117(params) {
        const commonEvent = $dataCommonEvents[params[0]];
        if (commonEvent) {
            const eventId = this.isOnCurrentMap() ? this._eventId : 0;
            this.setupChild(commonEvent.list, eventId);
        }
        return true;
    }
    setupChild(list, eventId) {
        this._childInterpreter = new Game_Interpreter(this._depth + 1);
        this._childInterpreter.setup(list, eventId);
    }
    command118() {
        return true;
    }
    command119(params) {
        const labelName = params[0];
        for (let i = 0; i < this._list.length; i++) {
            const command = this._list[i];
            if (command.code === 118 && command.parameters[0] === labelName) {
                this.jumpTo(i);
                return;
            }
        }
        return true;
    }
    jumpTo(index) {
        const lastIndex = this._index;
        const startIndex = Math.min(index, lastIndex);
        const endIndex = Math.max(index, lastIndex);
        let indent = this._indent;
        for (let i = startIndex; i <= endIndex; i++) {
            const newIndent = this._list[i].indent;
            if (newIndent !== indent) {
                this._branch[indent] = null;
                indent = newIndent;
            }
        }
        this._index = index;
    }
    command121(params) {
        for (let i = params[0]; i <= params[1]; i++) {
            $gameSwitches.setValue(i, params[2] === 0);
        }
        return true;
    }
    command122(params) {
        const startId = params[0];
        const endId = params[1];
        const operationType = params[2];
        const operand = params[3];
        let value = 0;
        let randomMax = 1;
        switch (operand) {
            case 0:
                value = params[4];
                break;
            case 1:
                value = $gameVariables.value(params[4]);
                break;
            case 2:
                value = params[4];
                randomMax = params[5] - params[4] + 1;
                randomMax = Math.max(randomMax, 1);
                break;
            case 3:
                value = this.gameDataOperand(params[4], params[5], params[6]);
                break;
            case 4:
                value = eval(params[4]);
                break;
        }
        for (let i = startId; i <= endId; i++) {
            if (typeof value === "number") {
                const realValue = value + Math.randomInt(randomMax);
                this.operateVariable(i, operationType, realValue);
            }
            else {
                this.operateVariable(i, operationType, value);
            }
        }
        return true;
    }
    gameDataOperand(type, param1, param2) {
        let actor, enemy, character;
        switch (type) {
            case 0:
                return $gameParty.numItems($dataItems[param1]);
            case 1:
                return $gameParty.numItems($dataWeapons[param1]);
            case 2:
                return $gameParty.numItems($dataArmors[param1]);
            case 3:
                actor = $gameActors.actor(param1);
                if (actor) {
                    switch (param2) {
                        case 0:
                            return actor.level;
                        case 1:
                            return actor.currentExp();
                        case 2:
                            return actor.hp;
                        case 3:
                            return actor.mp;
                        case 12:
                            return actor.tp;
                        default:
                            if (param2 >= 4 && param2 <= 11) {
                                return actor.param(param2 - 4);
                            }
                    }
                }
                break;
            case 4:
                enemy = $gameTroop.members()[param1];
                if (enemy) {
                    switch (param2) {
                        case 0:
                            return enemy.hp;
                        case 1:
                            return enemy.mp;
                        case 10:
                            return enemy.tp;
                        default:
                            if (param2 >= 2 && param2 <= 9) {
                                return enemy.param(param2 - 2);
                            }
                    }
                }
                break;
            case 5:
                character = this.character(param1);
                if (character) {
                    switch (param2) {
                        case 0:
                            return character.x;
                        case 1:
                            return character.y;
                        case 2:
                            return character.direction();
                        case 3:
                            return character.screenX();
                        case 4:
                            return character.screenY();
                    }
                }
                break;
            case 6:
                actor = $gameParty.members()[param1];
                return actor ? actor.actorId() : 0;
            case 8:
                return $gameTemp.lastActionData(param1);
            case 7:
                switch (param1) {
                    case 0:
                        return $gameMap.mapId();
                    case 1:
                        return $gameParty.size();
                    case 2:
                        return $gameParty.gold();
                    case 3:
                        return $gameParty.steps();
                    case 4:
                        return $gameSystem.playtime();
                    case 5:
                        return $gameTimer.seconds();
                    case 6:
                        return $gameSystem.saveCount();
                    case 7:
                        return $gameSystem.battleCount();
                    case 8:
                        return $gameSystem.winCount();
                    case 9:
                        return $gameSystem.escapeCount();
                }
                break;
        }
        return 0;
    }
    operateVariable(variableId, operationType, value) {
        try {
            const oldValue = $gameVariables.value(variableId);
            switch (operationType) {
                case 0:
                    $gameVariables.setValue(variableId, value);
                    break;
                case 1:
                    $gameVariables.setValue(variableId, oldValue + value);
                    break;
                case 2:
                    $gameVariables.setValue(variableId, oldValue - value);
                    break;
                case 3:
                    $gameVariables.setValue(variableId, oldValue * value);
                    break;
                case 4:
                    $gameVariables.setValue(variableId, oldValue / value);
                    break;
                case 5:
                    $gameVariables.setValue(variableId, oldValue % value);
                    break;
            }
        }
        catch (e) {
            $gameVariables.setValue(variableId, 0);
        }
    }
    command123(params) {
        if (this._eventId > 0) {
            const key = [this._mapId, this._eventId, params[0]];
            $gameSelfSwitches.setValue(key, params[1] === 0);
        }
        return true;
    }
    command124(params) {
        if (params[0] === 0) {
            $gameTimer.start(params[1] * 60);
        }
        else {
            $gameTimer.stop();
        }
        return true;
    }
    command125(params) {
        const value = this.operateValue(params[0], params[1], params[2]);
        $gameParty.gainGold(value);
        return true;
    }
    command126(params) {
        const value = this.operateValue(params[1], params[2], params[3]);
        $gameParty.gainItem($dataItems[params[0]], value);
        return true;
    }
    command127(params) {
        const value = this.operateValue(params[1], params[2], params[3]);
        $gameParty.gainItem($dataWeapons[params[0]], value, params[4]);
        return true;
    }
    command128(params) {
        const value = this.operateValue(params[1], params[2], params[3]);
        $gameParty.gainItem($dataArmors[params[0]], value, params[4]);
        return true;
    }
    command129(params) {
        const actor = $gameActors.actor(params[0]);
        if (actor) {
            if (params[1] === 0) {
                if (params[2]) {
                    $gameActors.actor(params[0]).setup(params[0]);
                }
                $gameParty.addActor(params[0]);
            }
            else {
                $gameParty.removeActor(params[0]);
            }
        }
        return true;
    }
    command132(params) {
        $gameSystem.setBattleBgm(params[0]);
        return true;
    }
    command133(params) {
        $gameSystem.setVictoryMe(params[0]);
        return true;
    }
    command134(params) {
        if (params[0] === 0) {
            $gameSystem.disableSave();
        }
        else {
            $gameSystem.enableSave();
        }
        return true;
    }
    command135(params) {
        if (params[0] === 0) {
            $gameSystem.disableMenu();
        }
        else {
            $gameSystem.enableMenu();
        }
        return true;
    }
    command136(params) {
        if (params[0] === 0) {
            $gameSystem.disableEncounter();
        }
        else {
            $gameSystem.enableEncounter();
        }
        $gamePlayer.makeEncounterCount();
        return true;
    }
    command137(params) {
        if (params[0] === 0) {
            $gameSystem.disableFormation();
        }
        else {
            $gameSystem.enableFormation();
        }
        return true;
    }
    command138(params) {
        $gameSystem.setWindowTone(params[0]);
        return true;
    }
    command139(params) {
        $gameSystem.setDefeatMe(params[0]);
        return true;
    }
    command140(params) {
        const vehicle = $gameMap.vehicle(params[0]);
        if (vehicle) {
            vehicle.setBgm(params[1]);
        }
        return true;
    }
    command201(params) {
        if ($gameParty.inBattle() || $gameMessage.isBusy()) {
            return false;
        }
        let mapId, x, y;
        if (params[0] === 0) {
            mapId = params[1];
            x = params[2];
            y = params[3];
        }
        else {
            mapId = $gameVariables.value(params[1]);
            x = $gameVariables.value(params[2]);
            y = $gameVariables.value(params[3]);
        }
        $gamePlayer.reserveTransfer(mapId, x, y, params[4], params[5]);
        this.setWaitMode("transfer");
        return true;
    }
    command202(params) {
        let mapId, x, y;
        if (params[1] === 0) {
            mapId = params[2];
            x = params[3];
            y = params[4];
        }
        else {
            mapId = $gameVariables.value(params[2]);
            x = $gameVariables.value(params[3]);
            y = $gameVariables.value(params[4]);
        }
        const vehicle = $gameMap.vehicle(params[0]);
        if (vehicle) {
            vehicle.setLocation(mapId, x, y);
        }
        return true;
    }
    command203(params) {
        const character = this.character(params[0]);
        if (character) {
            if (params[1] === 0) {
                character.locate(params[2], params[3]);
            }
            else if (params[1] === 1) {
                const x = $gameVariables.value(params[2]);
                const y = $gameVariables.value(params[3]);
                character.locate(x, y);
            }
            else {
                const character2 = this.character(params[2]);
                if (character2) {
                    character.swap(character2);
                }
            }
            if (params[4] > 0) {
                character.setDirection(params[4]);
            }
        }
        return true;
    }
    command204(params) {
        if (!$gameParty.inBattle()) {
            if ($gameMap.isScrolling()) {
                this.setWaitMode("scroll");
                return false;
            }
            $gameMap.startScroll(params[0], params[1], params[2]);
            if (params[3]) {
                this.setWaitMode("scroll");
            }
        }
        return true;
    }
    command205(params) {
        $gameMap.refreshIfNeeded();
        this._characterId = params[0];
        const character = this.character(this._characterId);
        if (character) {
            character.forceMoveRoute(params[1]);
            if (params[1].wait) {
                this.setWaitMode("route");
            }
        }
        return true;
    }
    command206() {
        $gamePlayer.getOnOffVehicle();
        return true;
    }
    command211(params) {
        $gamePlayer.setTransparent(params[0] === 0);
        return true;
    }
    command212(params) {
        this._characterId = params[0];
        const character = this.character(this._characterId);
        if (character) {
            $gameTemp.requestAnimation([character], params[1]);
            if (params[2]) {
                this.setWaitMode("animation");
            }
        }
        return true;
    }
    command213(params) {
        this._characterId = params[0];
        const character = this.character(this._characterId);
        if (character) {
            $gameTemp.requestBalloon(character, params[1]);
            if (params[2]) {
                this.setWaitMode("balloon");
            }
        }
        return true;
    }
    command214() {
        if (this.isOnCurrentMap() && this._eventId > 0) {
            $gameMap.eraseEvent(this._eventId);
        }
        return true;
    }
    command216(params) {
        if (params[0] === 0) {
            $gamePlayer.showFollowers();
        }
        else {
            $gamePlayer.hideFollowers();
        }
        $gamePlayer.refresh();
        return true;
    }
    command217() {
        if (!$gameParty.inBattle()) {
            $gamePlayer.gatherFollowers();
            this.setWaitMode("gather");
        }
        return true;
    }
    command221() {
        if ($gameMessage.isBusy()) {
            return false;
        }
        $gameScreen.startFadeOut(this.fadeSpeed());
        this.wait(this.fadeSpeed());
        return true;
    }
    command222() {
        if ($gameMessage.isBusy()) {
            return false;
        }
        $gameScreen.startFadeIn(this.fadeSpeed());
        this.wait(this.fadeSpeed());
        return true;
    }
    command223(params) {
        $gameScreen.startTint(params[0], params[1]);
        if (params[2]) {
            this.wait(params[1]);
        }
        return true;
    }
    command224(params) {
        $gameScreen.startFlash(params[0], params[1]);
        if (params[2]) {
            this.wait(params[1]);
        }
        return true;
    }
    command225(params) {
        $gameScreen.startShake(params[0], params[1], params[2]);
        if (params[3]) {
            this.wait(params[2]);
        }
        return true;
    }
    command230(params) {
        this.wait(params[0]);
        return true;
    }
    command231(params) {
        const point = this.picturePoint(params);
        $gameScreen.showPicture(params[0], params[1], params[2], point.x, point.y, params[6], params[7], params[8], params[9]);
        return true;
    }
    command232(params) {
        const point = this.picturePoint(params);
        $gameScreen.movePicture(params[0], params[2], point.x, point.y, params[6], params[7], params[8], params[9], params[10], params[12] || 0);
        if (params[11]) {
            this.wait(params[10]);
        }
        return true;
    }
    picturePoint(params) {
        const point = new Point();
        if (params[3] === 0) {
            point.x = params[4];
            point.y = params[5];
        }
        else {
            point.x = $gameVariables.value(params[4]);
            point.y = $gameVariables.value(params[5]);
        }
        return point;
    }
    command233(params) {
        $gameScreen.rotatePicture(params[0], params[1]);
        return true;
    }
    command234(params) {
        $gameScreen.tintPicture(params[0], params[1], params[2]);
        if (params[3]) {
            this.wait(params[2]);
        }
        return true;
    }
    command235(params) {
        $gameScreen.erasePicture(params[0]);
        return true;
    }
    command236(params) {
        if (!$gameParty.inBattle()) {
            $gameScreen.changeWeather(params[0], params[1], params[2]);
            if (params[3]) {
                this.wait(params[2]);
            }
        }
        return true;
    }
    command241(params) {
        AudioManager.playBgm(params[0]);
        return true;
    }
    command242(params) {
        AudioManager.fadeOutBgm(params[0]);
        return true;
    }
    command243() {
        $gameSystem.saveBgm();
        return true;
    }
    command244() {
        $gameSystem.replayBgm();
        return true;
    }
    command245(params) {
        AudioManager.playBgs(params[0]);
        return true;
    }
    command246(params) {
        AudioManager.fadeOutBgs(params[0]);
        return true;
    }
    command249(params) {
        AudioManager.playMe(params[0]);
        return true;
    }
    command250(params) {
        AudioManager.playSe(params[0]);
        return true;
    }
    command251() {
        AudioManager.stopSe();
        return true;
    }
    command261(params) {
        if ($gameMessage.isBusy()) {
            return false;
        }
        const name = params[0];
        if (name.length > 0) {
            const ext = this.videoFileExt();
            Video.play("movies/" + name + ext);
            this.setWaitMode("video");
        }
        return true;
    }
    videoFileExt() {
        if (Utils.canPlayWebm()) {
            return ".webm";
        }
        else {
            return ".mp4";
        }
    }
    command281(params) {
        if (params[0] === 0) {
            $gameMap.enableNameDisplay();
        }
        else {
            $gameMap.disableNameDisplay();
        }
        return true;
    }
    command282(params) {
        const tileset = $dataTilesets[params[0]];
        const allReady = tileset.tilesetNames
            .map(tilesetName => ImageManager.loadTileset(tilesetName))
            .every(bitmap => bitmap.isReady());
        if (allReady) {
            $gameMap.changeTileset(params[0]);
            return true;
        }
        else {
            return false;
        }
    }
    command283(params) {
        $gameMap.changeBattleback(params[0], params[1]);
        return true;
    }
    command284(params) {
        $gameMap.changeParallax(params[0], params[1], params[2], params[3], params[4]);
        return true;
    }
    command285(params) {
        let x, y, value;
        if (params[2] === 0) {
            x = params[3];
            y = params[4];
        }
        else if (params[2] === 1) {
            x = $gameVariables.value(params[3]);
            y = $gameVariables.value(params[4]);
        }
        else {
            const character = this.character(params[3]);
            x = character.x;
            y = character.y;
        }
        switch (params[1]) {
            case 0:
                value = $gameMap.terrainTag(x, y);
                break;
            case 1:
                value = $gameMap.eventIdXy(x, y);
                break;
            case 2:
            case 3:
            case 4:
            case 5:
                value = $gameMap.tileId(x, y, params[1] - 2);
                break;
            default:
                value = $gameMap.regionId(x, y);
                break;
        }
        $gameVariables.setValue(params[0], value);
        return true;
    }
    command301(params) {
        if (!$gameParty.inBattle()) {
            let troopId;
            if (params[0] === 0) {
                troopId = params[1];
            }
            else if (params[0] === 1) {
                troopId = $gameVariables.value(params[1]);
            }
            else {
                troopId = $gamePlayer.makeEncounterTroopId();
            }
            if ($dataTroops[troopId]) {
                BattleManager.setup(troopId, params[2], params[3]);
                BattleManager.setEventCallback(n => {
                    this._branch[this._indent] = n;
                });
                $gamePlayer.makeEncounterCount();
                SceneManager.push(Scene_Battle);
            }
        }
        return true;
    }
    command601() {
        if (this._branch[this._indent] !== 0) {
            this.skipBranch();
        }
        return true;
    }
    command602() {
        if (this._branch[this._indent] !== 1) {
            this.skipBranch();
        }
        return true;
    }
    command603() {
        if (this._branch[this._indent] !== 2) {
            this.skipBranch();
        }
        return true;
    }
    command302(params) {
        if (!$gameParty.inBattle()) {
            const goods = [params];
            while (this.nextEventCode() === 605) {
                this._index++;
                goods.push(this.currentCommand().parameters);
            }
            SceneManager.push(Scene_Shop);
            SceneManager.prepareNextScene(goods, params[4]);
        }
        return true;
    }
    command303(params) {
        if (!$gameParty.inBattle()) {
            if ($dataActors[params[0]]) {
                SceneManager.push(Scene_Name);
                SceneManager.prepareNextScene(params[0], params[1]);
            }
        }
        return true;
    }
    command311(params) {
        const value = this.operateValue(params[2], params[3], params[4]);
        this.iterateActorEx(params[0], params[1], actor => {
            this.changeHp(actor, value, params[5]);
        });
        return true;
    }
    command312(params) {
        const value = this.operateValue(params[2], params[3], params[4]);
        this.iterateActorEx(params[0], params[1], actor => {
            actor.gainMp(value);
        });
        return true;
    }
    command326(params) {
        const value = this.operateValue(params[2], params[3], params[4]);
        this.iterateActorEx(params[0], params[1], actor => {
            actor.gainTp(value);
        });
        return true;
    }
    command313(params) {
        this.iterateActorEx(params[0], params[1], actor => {
            const alreadyDead = actor.isDead();
            if (params[2] === 0) {
                actor.addState(params[3]);
            }
            else {
                actor.removeState(params[3]);
            }
            if (actor.isDead() && !alreadyDead) {
                actor.performCollapse();
            }
            actor.clearResult();
        });
        return true;
    }
    command314(params) {
        this.iterateActorEx(params[0], params[1], actor => {
            actor.recoverAll();
        });
        return true;
    }
    command315(params) {
        const value = this.operateValue(params[2], params[3], params[4]);
        this.iterateActorEx(params[0], params[1], actor => {
            actor.changeExp(actor.currentExp() + value, params[5]);
        });
        return true;
    }
    command316(params) {
        const value = this.operateValue(params[2], params[3], params[4]);
        this.iterateActorEx(params[0], params[1], actor => {
            actor.changeLevel(actor.level + value, params[5]);
        });
        return true;
    }
    command317(params) {
        const value = this.operateValue(params[3], params[4], params[5]);
        this.iterateActorEx(params[0], params[1], actor => {
            actor.addParam(params[2], value);
        });
        return true;
    }
    command318(params) {
        this.iterateActorEx(params[0], params[1], actor => {
            if (params[2] === 0) {
                actor.learnSkill(params[3]);
            }
            else {
                actor.forgetSkill(params[3]);
            }
        });
        return true;
    }
    command319(params) {
        const actor = $gameActors.actor(params[0]);
        if (actor) {
            actor.changeEquipById(params[1], params[2]);
        }
        return true;
    }
    command320(params) {
        const actor = $gameActors.actor(params[0]);
        if (actor) {
            actor.setName(params[1]);
        }
        return true;
    }
    command321(params) {
        const actor = $gameActors.actor(params[0]);
        if (actor && $dataClasses[params[1]]) {
            actor.changeClass(params[1], params[2]);
        }
        return true;
    }
    command322(params) {
        const actor = $gameActors.actor(params[0]);
        if (actor) {
            actor.setCharacterImage(params[1], params[2]);
            actor.setFaceImage(params[3], params[4]);
            actor.setBattlerImage(params[5]);
        }
        $gamePlayer.refresh();
        return true;
    }
    command323(params) {
        const vehicle = $gameMap.vehicle(params[0]);
        if (vehicle) {
            vehicle.setImage(params[1], params[2]);
        }
        return true;
    }
    command324(params) {
        const actor = $gameActors.actor(params[0]);
        if (actor) {
            actor.setNickname(params[1]);
        }
        return true;
    }
    command325(params) {
        const actor = $gameActors.actor(params[0]);
        if (actor) {
            actor.setProfile(params[1]);
        }
        return true;
    }
    command331(params) {
        const value = this.operateValue(params[1], params[2], params[3]);
        this.iterateEnemyIndex(params[0], enemy => {
            this.changeHp(enemy, value, params[4]);
        });
        return true;
    }
    command332(params) {
        const value = this.operateValue(params[1], params[2], params[3]);
        this.iterateEnemyIndex(params[0], enemy => {
            enemy.gainMp(value);
        });
        return true;
    }
    command342(params) {
        const value = this.operateValue(params[1], params[2], params[3]);
        this.iterateEnemyIndex(params[0], enemy => {
            enemy.gainTp(value);
        });
        return true;
    }
    command333(params) {
        this.iterateEnemyIndex(params[0], enemy => {
            const alreadyDead = enemy.isDead();
            if (params[1] === 0) {
                enemy.addState(params[2]);
            }
            else {
                enemy.removeState(params[2]);
            }
            if (enemy.isDead() && !alreadyDead) {
                enemy.performCollapse();
            }
            enemy.clearResult();
        });
        return true;
    }
    command334(params) {
        this.iterateEnemyIndex(params[0], enemy => {
            enemy.recoverAll();
        });
        return true;
    }
    command335(params) {
        this.iterateEnemyIndex(params[0], enemy => {
            enemy.appear();
            $gameTroop.makeUniqueNames();
        });
        return true;
    }
    command336(params) {
        this.iterateEnemyIndex(params[0], enemy => {
            enemy.transform(params[1]);
            $gameTroop.makeUniqueNames();
        });
        return true;
    }
    command337(params) {
        let param = params[0];
        if (params[2]) {
            param = -1;
        }
        const targets = [];
        this.iterateEnemyIndex(param, enemy => {
            if (enemy.isAlive()) {
                targets.push(enemy);
            }
        });
        $gameTemp.requestAnimation(targets, params[1]);
        return true;
    }
    command339(params) {
        this.iterateBattler(params[0], params[1], battler => {
            if (!battler.isDeathStateAffected()) {
                battler.forceAction(params[2], params[3]);
                BattleManager.forceAction(battler);
                this.setWaitMode("action");
            }
        });
        return true;
    }
    command340() {
        BattleManager.abort();
        return true;
    }
    command351() {
        if (!$gameParty.inBattle()) {
            SceneManager.push(Scene_Menu);
            Window_MenuCommand.initCommandPosition();
        }
        return true;
    }
    command352() {
        if (!$gameParty.inBattle()) {
            SceneManager.push(Scene_Save);
        }
        return true;
    }
    command353() {
        SceneManager.goto(Scene_Gameover);
        return true;
    }
    command354() {
        SceneManager.goto(Scene_Title);
        return true;
    }
    command355() {
        let script = this.currentCommand().parameters[0] + "\n";
        while (this.nextEventCode() === 655) {
            this._index++;
            script += this.currentCommand().parameters[0] + "\n";
        }
        eval(script);
        return true;
    }
    command356(params) {
        const args = params[0].split(" ");
        const command = args.shift();
        this.pluginCommand(command, args);
        return true;
    }
    pluginCommand(...args) {
    }
    command357(params) {
        PluginManager.callCommand(this, params[0], params[1], params[3]);
        return true;
    }
}
