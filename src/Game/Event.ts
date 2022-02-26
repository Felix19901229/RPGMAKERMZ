import { Game_Character, Game_Interpreter } from "./index.js";

//-----------------------------------------------------------------------------
/**
 * Game_Event
 * 
 * The game object class for an event. It contains functionality for event page
 * switching and running parallel process events.
*/
export class Game_Event extends Game_Character {
    _mapId: number;
    _eventId: number;
    _moveType: number;
    _trigger: number;
    _starting: boolean;
    _erased: boolean;
    _pageIndex: number;
    _originalPattern: number;
    _originalDirection: number;
    _prelockDirection: number;
    _locked: boolean;
    _interpreter: Nullable<Game_Interpreter>;
    constructor(...args: [number,number]) {
        super(...args);
        this.initialize(...args);
    }


    public initialize(mapId, eventId) {
        Game_Character.prototype.initialize.call(this);
        this._mapId = mapId;
        this._eventId = eventId;
        this.locate(this.event().x, this.event().y);
        this.refresh();
    }

    public initMembers() {
        Game_Character.prototype.initMembers.call(this);
        this._moveType = 0;
        this._trigger = 0;
        this._starting = false;
        this._erased = false;
        this._pageIndex = -2;
        this._originalPattern = 1;
        this._originalDirection = 2;
        this._prelockDirection = 0;
        this._locked = false;
    }

    public eventId() {
        return this._eventId;
    }

    public event() {
        return window.$dataMap.events[this._eventId];
    }

    public page() {
        return this.event().pages[this._pageIndex];
    }

    public list() {
        return this.page().list;
    }

    public isCollidedWithCharacters(x, y) {
        return (
            Game_Character.prototype.isCollidedWithCharacters.call(this, x, y) ||
            this.isCollidedWithPlayerCharacters(x, y)
        );
    }

    public isCollidedWithEvents(x, y) {
        const events = window.$gameMap.eventsXyNt(x, y);
        return events.length > 0;
    }

    public isCollidedWithPlayerCharacters(x, y) {
        return this.isNormalPriority() && window.$gamePlayer.isCollided(x, y);
    }

    public lock() {
        if (!this._locked) {
            this._prelockDirection = this.direction();
            this.turnTowardPlayer();
            this._locked = true;
        }
    }

    public unlock() {
        if (this._locked) {
            this._locked = false;
            this.setDirection(this._prelockDirection);
        }
    }

    public updateStop() {
        if (this._locked) {
            this.resetStopCount();
        }
        Game_Character.prototype.updateStop.call(this);
        if (!this.isMoveRouteForcing()) {
            this.updateSelfMovement();
        }
    }

    public updateSelfMovement() {
        if (
            !this._locked &&
            this.isNearTheScreen() &&
            this.checkStop(this.stopCountThreshold())
        ) {
            switch (this._moveType) {
                case 1:
                    this.moveTypeRandom();
                    break;
                case 2:
                    this.moveTypeTowardPlayer();
                    break;
                case 3:
                    this.moveTypeCustom();
                    break;
            }
        }
    }

    public stopCountThreshold() {
        return 30 * (5 - this.moveFrequency());
    }

    public moveTypeRandom() {
        switch (Math.randomInt(6)) {
            case 0:
            case 1:
                this.moveRandom();
                break;
            case 2:
            case 3:
            case 4:
                this.moveForward();
                break;
            case 5:
                this.resetStopCount();
                break;
        }
    }

    public moveTypeTowardPlayer() {
        if (this.isNearThePlayer()) {
            switch (Math.randomInt(6)) {
                case 0:
                case 1:
                case 2:
                case 3:
                    this.moveTowardPlayer();
                    break;
                case 4:
                    this.moveRandom();
                    break;
                case 5:
                    this.moveForward();
                    break;
            }
        } else {
            this.moveRandom();
        }
    }

    public isNearThePlayer() {
        const sx = Math.abs(this.deltaXFrom(window.$gamePlayer.x));
        const sy = Math.abs(this.deltaYFrom(window.$gamePlayer.y));
        return sx + sy < 20;
    }

    public moveTypeCustom() {
        this.updateRoutineMove();
    }

    public isStarting() {
        return this._starting;
    }

    public clearStartingFlag() {
        this._starting = false;
    }

    public isTriggerIn(triggers) {
        return triggers.includes(this._trigger);
    }

    public start() {
        const list = this.list();
        if (list && list.length > 1) {
            this._starting = true;
            if (this.isTriggerIn([0, 1, 2])) {
                this.lock();
            }
        }
    }

    public erase() {
        this._erased = true;
        this.refresh();
    }

    public refresh() {
        const newPageIndex = this._erased ? -1 : this.findProperPageIndex();
        if (this._pageIndex !== newPageIndex) {
            this._pageIndex = newPageIndex;
            this.setupPage();
        }
    }

    public findProperPageIndex() {
        const pages = this.event().pages;
        for (let i = pages.length - 1; i >= 0; i--) {
            const page = pages[i];
            if (this.meetsConditions(page)) {
                return i;
            }
        }
        return -1;
    }

    public meetsConditions(page) {
        const c = page.conditions;
        if (c.switch1Valid) {
            if (!window.$gameSwitches.value(c.switch1Id)) {
                return false;
            }
        }
        if (c.switch2Valid) {
            if (!window.$gameSwitches.value(c.switch2Id)) {
                return false;
            }
        }
        if (c.variableValid) {
            if (window.$gameVariables.value(c.variableId) < c.variableValue) {
                return false;
            }
        }
        if (c.selfSwitchValid) {
            const key = [this._mapId, this._eventId, c.selfSwitchCh];
            if (window.$gameSelfSwitches.value(key) !== true) {
                return false;
            }
        }
        if (c.itemValid) {
            const item = window.$dataItems[c.itemId];
            if (!window.$gameParty.hasItem(item)) {
                return false;
            }
        }
        if (c.actorValid) {
            const actor = window.$gameActors.actor(c.actorId);
            if (!window.$gameParty.members().includes(actor)) {
                return false;
            }
        }
        return true;
    }

    public setupPage() {
        if (this._pageIndex >= 0) {
            this.setupPageSettings();
        } else {
            this.clearPageSettings();
        }
        this.refreshBushDepth();
        this.clearStartingFlag();
        this.checkEventTriggerAuto();
    }

    public clearPageSettings() {
        this.setImage("", 0);
        this._moveType = 0;
        this._trigger = null;
        this._interpreter = null;
        this.setThrough(true);
    }

    public setupPageSettings() {
        const page = this.page();
        const image = page.image;
        if (image.tileId > 0) {
            this.setTileImage(image.tileId);
        } else {
            this.setImage(image.characterName, image.characterIndex);
        }
        if (this._originalDirection !== image.direction) {
            this._originalDirection = image.direction;
            this._prelockDirection = 0;
            this.setDirectionFix(false);
            this.setDirection(image.direction);
        }
        if (this._originalPattern !== image.pattern) {
            this._originalPattern = image.pattern;
            this.setPattern(image.pattern);
        }
        this.setMoveSpeed(page.moveSpeed);
        this.setMoveFrequency(page.moveFrequency);
        this.setPriorityType(page.priorityType);
        this.setWalkAnime(page.walkAnime);
        this.setStepAnime(page.stepAnime);
        this.setDirectionFix(page.directionFix);
        this.setThrough(page.through);
        this.setMoveRoute(page.moveRoute);
        this._moveType = page.moveType;
        this._trigger = page.trigger;
        if (this._trigger === 4) {
            this._interpreter = new Game_Interpreter();
        } else {
            this._interpreter = null;
        }
    }

    public isOriginalPattern() {
        return this.pattern() === this._originalPattern;
    }

    public resetPattern() {
        this.setPattern(this._originalPattern);
    }

    public checkEventTriggerTouch(x:number, y:number) {
        if (!window.$gameMap.isEventRunning()) {
            if (this._trigger === 2 && window.$gamePlayer.pos(x, y)) {
                if (!this.isJumping() && this.isNormalPriority()) {
                    this.start();
                }
            }
        }
    }

    public checkEventTriggerAuto() {
        if (this._trigger === 3) {
            this.start();
        }
    }

    public update() {
        Game_Character.prototype.update.call(this);
        this.checkEventTriggerAuto();
        this.updateParallel();
    }

    public updateParallel() {
        if (this._interpreter) {
            if (!this._interpreter.isRunning()) {
                this._interpreter.setup(this.list(), this._eventId);
            }
            this._interpreter.update();
        }
    }

    public locate(x, y) {
        Game_Character.prototype.locate.call(this, x, y);
        this._prelockDirection = 0;
    }

    public forceMoveRoute(moveRoute) {
        Game_Character.prototype.forceMoveRoute.call(this, moveRoute);
        this._prelockDirection = 0;
    }
}
