import { BattleManager, ConfigManager } from "../Manager/index.js";
import {  Input, TouchInput } from "../Core/index.js";
import { Game_Character ,Game_Followers} from "./index.js";

//-----------------------------------------------------------------------------
/**
 * Game_Player
 * 
 * The game object class for the player. It contains event starting
 * determinants and map scrolling functions.
*/
export class Game_Player extends Game_Character {
    _vehicleType: "walk"|"boat"| "ship"|"airship";
    _vehicleGettingOn: boolean;
    _vehicleGettingOff: boolean;
    _dashing: boolean;
    _needsMapReload: boolean;
    _transferring: boolean;
    _newMapId: number;
    _newX: number;
    _newY: number;
    _newDirection: number;
    _fadeType: number;
    _followers: any;
    _encounterCount: number;
    constructor(...args: any[]) {
        super(...args);
        this.initialize(...args);
    }
    public initialize(...args) {
        Game_Character.prototype.initialize.call(this);
        this.setTransparent(window.$dataSystem.optTransparent);
    }

    public initMembers() {
        Game_Character.prototype.initMembers.call(this);
        this._vehicleType = "walk";
        this._vehicleGettingOn = false;
        this._vehicleGettingOff = false;
        this._dashing = false;
        this._needsMapReload = false;
        this._transferring = false;
        this._newMapId = 0;
        this._newX = 0;
        this._newY = 0;
        this._newDirection = 0;
        this._fadeType = 0;
        this._followers = new Game_Followers();
        this._encounterCount = 0;
    }

    public clearTransferInfo() {
        this._transferring = false;
        this._newMapId = 0;
        this._newX = 0;
        this._newY = 0;
        this._newDirection = 0;
    }

    public followers() {
        return this._followers;
    }

    public refresh() {
        const actor = window.$gameParty.leader();
        const characterName = actor ? actor.characterName() : "";
        const characterIndex = actor ? actor.characterIndex() : 0;
        this.setImage(characterName, characterIndex);
        this._followers.refresh();
    }

    public isStopping() {
        if (this._vehicleGettingOn || this._vehicleGettingOff) {
            return false;
        }
        return Game_Character.prototype.isStopping.call(this);
    }

    public reserveTransfer(mapId, x, y, d?, fadeType?) {
        this._transferring = true;
        this._newMapId = mapId;
        this._newX = x;
        this._newY = y;
        this._newDirection = d;
        this._fadeType = fadeType;
    }

    public setupForNewGame() {
        const mapId = window.$dataSystem.startMapId;
        const x = window.$dataSystem.startX;
        const y = window.$dataSystem.startY;
        this.reserveTransfer(mapId, x, y, 2, 0);
    }

    public requestMapReload() {
        this._needsMapReload = true;
    }

    public isTransferring() {
        return this._transferring;
    }

    public newMapId() {
        return this._newMapId;
    }

    public fadeType() {
        return this._fadeType;
    }

    public performTransfer() {
        if (this.isTransferring()) {
            this.setDirection(this._newDirection);
            if (this._newMapId !== window.$gameMap.mapId() || this._needsMapReload) {
                window.$gameMap.setup(this._newMapId);
                this._needsMapReload = false;
            }
            this.locate(this._newX, this._newY);
            this.refresh();
            this.clearTransferInfo();
        }
    }

    public isMapPassable(x, y, d) {
        const vehicle = this.vehicle();
        if (vehicle) {
            return vehicle.isMapPassable(x, y, d);
        } else {
            return Game_Character.prototype.isMapPassable.call(this, x, y, d);
        }
    }

    public vehicle() {
        return window.$gameMap.vehicle(this._vehicleType);
    }

    public isInBoat() {
        return this._vehicleType === "boat";
    }

    public isInShip() {
        return this._vehicleType === "ship";
    }

    public isInAirship() {
        return this._vehicleType === "airship";
    }

    public isInVehicle() {
        return this.isInBoat() || this.isInShip() || this.isInAirship();
    }

    public isNormal() {
        return this._vehicleType === "walk" && !this.isMoveRouteForcing();
    }

    public isDashing() {
        return this._dashing;
    }

    public isDebugThrough() {
        return Input.isPressed("control") && window.$gameTemp.isPlaytest();
    }

    public isCollided(x, y) {
        if (this.isThrough()) {
            return false;
        } else {
            return this.pos(x, y) || this._followers.isSomeoneCollided(x, y);
        }
    }

    public centerX() {
        return (window.$gameMap.screenTileX() - 1) / 2;
    }

    public centerY() {
        return (window.$gameMap.screenTileY() - 1) / 2;
    }

    public center(x, y) {
        return window.$gameMap.setDisplayPos(x - this.centerX(), y - this.centerY());
    }

    public locate(x, y) {
        Game_Character.prototype.locate.call(this, x, y);
        this.center(x, y);
        this.makeEncounterCount();
        if (this.isInVehicle()) {
            this.vehicle().refresh();
        }
        this._followers.synchronize(x, y, this.direction());
    }

    public increaseSteps() {
        Game_Character.prototype.increaseSteps.call(this);
        if (this.isNormal()) {
            window.$gameParty.increaseSteps();
        }
    }

    public makeEncounterCount() {
        const n = window.$gameMap.encounterStep();
        this._encounterCount = Math.randomInt(n) + Math.randomInt(n) + 1;
    }

    public makeEncounterTroopId() {
        const encounterList = [];
        let weightSum = 0;
        for (const encounter of window.$gameMap.encounterList()) {
            if (this.meetsEncounterConditions(encounter)) {
                encounterList.push(encounter);
                weightSum += encounter.weight;
            }
        }
        if (weightSum > 0) {
            let value = Math.randomInt(weightSum);
            for (const encounter of encounterList) {
                value -= encounter.weight;
                if (value < 0) {
                    return encounter.troopId;
                }
            }
        }
        return 0;
    }

    public meetsEncounterConditions(encounter) {
        return (
            encounter.regionSet.length === 0 ||
            encounter.regionSet.includes(this.regionId())
        );
    }

    public executeEncounter() {
        if (!window.$gameMap.isEventRunning() && this._encounterCount <= 0) {
            this.makeEncounterCount();
            const troopId = this.makeEncounterTroopId();
            if (window.$dataTroops[troopId]) {
                BattleManager.setup(troopId, true, false);
                BattleManager.onEncounter();
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    public startMapEvent(x, y, triggers, normal) {
        if (!window.$gameMap.isEventRunning()) {
            for (const event of window.$gameMap.eventsXy(x, y)) {
                if (
                    event.isTriggerIn(triggers) &&
                    event.isNormalPriority() === normal
                ) {
                    event.start();
                }
            }
        }
    }

    public moveByInput() {
        if (!this.isMoving() && this.canMove()) {
            let direction = this.getInputDirection();
            if (direction > 0) {
                window.$gameTemp.clearDestination();
            } else if (window.$gameTemp.isDestinationValid()) {
                const x = window.$gameTemp.destinationX();
                const y = window.$gameTemp.destinationY();
                direction = this.findDirectionTo(x, y);
            }
            if (direction > 0) {
                this.executeMove(direction);
            }
        }
    }

    public canMove() {
        if (window.$gameMap.isEventRunning() || window.$gameMessage.isBusy()) {
            return false;
        }
        if (this.isMoveRouteForcing() || this.areFollowersGathering()) {
            return false;
        }
        if (this._vehicleGettingOn || this._vehicleGettingOff) {
            return false;
        }
        if (this.isInVehicle() && !this.vehicle().canMove()) {
            return false;
        }
        return true;
    }

    public getInputDirection() {
        return Input.dir4;
    }

    public executeMove(direction) {
        this.moveStraight(direction);
    }

    public update(sceneActive) {
        const lastScrolledX = this.scrolledX();
        const lastScrolledY = this.scrolledY();
        const wasMoving = this.isMoving();
        this.updateDashing();
        if (sceneActive) {
            this.moveByInput();
        }
        Game_Character.prototype.update.call(this);
        this.updateScroll(lastScrolledX, lastScrolledY);
        this.updateVehicle();
        if (!this.isMoving()) {
            this.updateNonmoving(wasMoving, sceneActive);
        }
        this._followers.update();
    }

    public updateDashing() {
        if (this.isMoving()) {
            return;
        }
        if (this.canMove() && !this.isInVehicle() && !window.$gameMap.isDashDisabled()) {
            this._dashing =
                this.isDashButtonPressed() || window.$gameTemp.isDestinationValid();
        } else {
            this._dashing = false;
        }
    }

    public isDashButtonPressed() {
        const shift = Input.isPressed("shift");
        if (ConfigManager.alwaysDash) {
            return !shift;
        } else {
            return shift;
        }
    }

    public updateScroll(lastScrolledX, lastScrolledY) {
        const x1 = lastScrolledX;
        const y1 = lastScrolledY;
        const x2 = this.scrolledX();
        const y2 = this.scrolledY();
        if (y2 > y1 && y2 > this.centerY()) {
            window.$gameMap.scrollDown(y2 - y1);
        }
        if (x2 < x1 && x2 < this.centerX()) {
            window.$gameMap.scrollLeft(x1 - x2);
        }
        if (x2 > x1 && x2 > this.centerX()) {
            window.$gameMap.scrollRight(x2 - x1);
        }
        if (y2 < y1 && y2 < this.centerY()) {
            window.$gameMap.scrollUp(y1 - y2);
        }
    }

    public updateVehicle() {
        if (this.isInVehicle() && !this.areFollowersGathering()) {
            if (this._vehicleGettingOn) {
                this.updateVehicleGetOn();
            } else if (this._vehicleGettingOff) {
                this.updateVehicleGetOff();
            } else {
                this.vehicle().syncWithPlayer();
            }
        }
    }

    public updateVehicleGetOn() {
        if (!this.areFollowersGathering() && !this.isMoving()) {
            this.setDirection(this.vehicle().direction());
            this.setMoveSpeed(this.vehicle().moveSpeed());
            this._vehicleGettingOn = false;
            this.setTransparent(true);
            if (this.isInAirship()) {
                this.setThrough(true);
            }
            this.vehicle().getOn();
        }
    }

    public updateVehicleGetOff() {
        if (!this.areFollowersGathering() && this.vehicle().isLowest()) {
            this._vehicleGettingOff = false;
            this._vehicleType = "walk";
            this.setTransparent(false);
        }
    }

    public updateNonmoving(wasMoving, sceneActive) {
        if (!window.$gameMap.isEventRunning()) {
            if (wasMoving) {
                window.$gameParty.onPlayerWalk();
                this.checkEventTriggerHere([1, 2]);
                if (window.$gameMap.setupStartingEvent()) {
                    return;
                }
            }
            if (sceneActive && this.triggerAction()) {
                return;
            }
            if (wasMoving) {
                this.updateEncounterCount();
            } else {
                window.$gameTemp.clearDestination();
            }
        }
    }

    public triggerAction() {
        if (this.canMove()) {
            if (this.triggerButtonAction()) {
                return true;
            }
            if (this.triggerTouchAction()) {
                return true;
            }
        }
        return false;
    }

    public triggerButtonAction() {
        if (Input.isTriggered("ok")) {
            if (this.getOnOffVehicle()) {
                return true;
            }
            this.checkEventTriggerHere([0]);
            if (window.$gameMap.setupStartingEvent()) {
                return true;
            }
            this.checkEventTriggerThere([0, 1, 2]);
            if (window.$gameMap.setupStartingEvent()) {
                return true;
            }
        }
        return false;
    }

    public triggerTouchAction() {
        if (window.$gameTemp.isDestinationValid()) {
            const direction = this.direction();
            const x1 = this.x;
            const y1 = this.y;
            const x2 = window.$gameMap.roundXWithDirection(x1, direction);
            const y2 = window.$gameMap.roundYWithDirection(y1, direction);
            const x3 = window.$gameMap.roundXWithDirection(x2, direction);
            const y3 = window.$gameMap.roundYWithDirection(y2, direction);
            const destX = window.$gameTemp.destinationX();
            const destY = window.$gameTemp.destinationY();
            if (destX === x1 && destY === y1) {
                return this.triggerTouchActionD1(x1, y1);
            } else if (destX === x2 && destY === y2) {
                return this.triggerTouchActionD2(x2, y2);
            } else if (destX === x3 && destY === y3) {
                return this.triggerTouchActionD3(x2, y2);
            }
        }
        return false;
    }

    public triggerTouchActionD1(x1, y1) {
        if (window.$gameMap.airship().pos(x1, y1)) {
            if (TouchInput.isTriggered() && this.getOnOffVehicle()) {
                return true;
            }
        }
        this.checkEventTriggerHere([0]);
        return window.$gameMap.setupStartingEvent();
    }

    public triggerTouchActionD2(x2, y2) {
        if (window.$gameMap.boat().pos(x2, y2) || window.$gameMap.ship().pos(x2, y2)) {
            if (TouchInput.isTriggered() && this.getOnVehicle()) {
                return true;
            }
        }
        if (this.isInBoat() || this.isInShip()) {
            if (TouchInput.isTriggered() && this.getOffVehicle()) {
                return true;
            }
        }
        this.checkEventTriggerThere([0, 1, 2]);
        return window.$gameMap.setupStartingEvent();
    }

    public triggerTouchActionD3(x2, y2) {
        if (window.$gameMap.isCounter(x2, y2)) {
            this.checkEventTriggerThere([0, 1, 2]);
        }
        return window.$gameMap.setupStartingEvent();
    }

    public updateEncounterCount() {
        if (this.canEncounter()) {
            this._encounterCount -= this.encounterProgressValue();
        }
    }

    public canEncounter() {
        return (
            !window.$gameParty.hasEncounterNone() &&
            window.$gameSystem.isEncounterEnabled() &&
            !this.isInAirship() &&
            !this.isMoveRouteForcing() &&
            !this.isDebugThrough()
        );
    }

    public encounterProgressValue() {
        let value = window.$gameMap.isBush(this.x, this.y) ? 2 : 1;
        if (window.$gameParty.hasEncounterHalf()) {
            value *= 0.5;
        }
        if (this.isInShip()) {
            value *= 0.5;
        }
        return value;
    }

    public checkEventTriggerHere(triggers) {
        if (this.canStartLocalEvents()) {
            this.startMapEvent(this.x, this.y, triggers, false);
        }
    }

    public checkEventTriggerThere(triggers) {
        if (this.canStartLocalEvents()) {
            const direction = this.direction();
            const x1 = this.x;
            const y1 = this.y;
            const x2 = window.$gameMap.roundXWithDirection(x1, direction);
            const y2 = window.$gameMap.roundYWithDirection(y1, direction);
            this.startMapEvent(x2, y2, triggers, true);
            if (!window.$gameMap.isAnyEventStarting() && window.$gameMap.isCounter(x2, y2)) {
                const x3 = window.$gameMap.roundXWithDirection(x2, direction);
                const y3 = window.$gameMap.roundYWithDirection(y2, direction);
                this.startMapEvent(x3, y3, triggers, true);
            }
        }
    }

    public checkEventTriggerTouch(x, y) {
        if (this.canStartLocalEvents()) {
            this.startMapEvent(x, y, [1, 2], true);
        }
    }

    public canStartLocalEvents() {
        return !this.isInAirship();
    }

    public getOnOffVehicle() {
        if (this.isInVehicle()) {
            return this.getOffVehicle();
        } else {
            return this.getOnVehicle();
        }
    }

    public getOnVehicle() {
        const direction = this.direction();
        const x1 = this.x;
        const y1 = this.y;
        const x2 = window.$gameMap.roundXWithDirection(x1, direction);
        const y2 = window.$gameMap.roundYWithDirection(y1, direction);
        if (window.$gameMap.airship().pos(x1, y1)) {
            this._vehicleType = "airship";
        } else if (window.$gameMap.ship().pos(x2, y2)) {
            this._vehicleType = "ship";
        } else if (window.$gameMap.boat().pos(x2, y2)) {
            this._vehicleType = "boat";
        }
        if (this.isInVehicle()) {
            this._vehicleGettingOn = true;
            if (!this.isInAirship()) {
                this.forceMoveForward();
            }
            this.gatherFollowers();
        }
        return this._vehicleGettingOn;
    }

    public getOffVehicle() {
        if (this.vehicle().isLandOk(this.x, this.y, this.direction())) {
            if (this.isInAirship()) {
                this.setDirection(2);
            }
            this._followers.synchronize(this.x, this.y, this.direction());
            this.vehicle().getOff();
            if (!this.isInAirship()) {
                this.forceMoveForward();
                this.setTransparent(false);
            }
            this._vehicleGettingOff = true;
            this.setMoveSpeed(4);
            this.setThrough(false);
            this.makeEncounterCount();
            this.gatherFollowers();
        }
        return this._vehicleGettingOff;
    }

    public forceMoveForward() {
        this.setThrough(true);
        this.moveForward();
        this.setThrough(false);
    }

    public isOnDamageFloor() {
        return window.$gameMap.isDamageFloor(this.x, this.y) && !this.isInAirship();
    }

    public moveStraight(d) {
        if (this.canPass(this.x, this.y, d)) {
            this._followers.updateMove();
        }
        Game_Character.prototype.moveStraight.call(this, d);
    }

    public moveDiagonally(horz, vert) {
        if (this.canPassDiagonally(this.x, this.y, horz, vert)) {
            this._followers.updateMove();
        }
        Game_Character.prototype.moveDiagonally.call(this, horz, vert);
    }

    public jump(xPlus, yPlus) {
        Game_Character.prototype.jump.call(this, xPlus, yPlus);
        this._followers.jumpAll();
    }

    public showFollowers() {
        this._followers.show();
    }

    public hideFollowers() {
        this._followers.hide();
    }

    public gatherFollowers() {
        this._followers.gather();
    }

    public areFollowersGathering() {
        return this._followers.areGathering();
    }

    public areFollowersGathered() {
        return this._followers.areGathered();
    }
}
