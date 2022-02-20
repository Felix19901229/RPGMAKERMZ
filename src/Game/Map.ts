import { Graphics } from  "../Core/index.js";
import { Game_CommonEvent, Game_Event, Game_Interpreter, Game_Vehicle } from "./index.js";
declare const ImageManager: any;
declare const AudioManager: any;
//-----------------------------------------------------------------------------
/**
 * Game_Map
 * 
 * The game object class for a map. It contains scrolling and passage
 * determination functions.
*/
export class Game_Map {
    _interpreter: Game_Interpreter;
    _mapId: number;
    _tilesetId: number;
    _events: any[];
    _commonEvents: any[];
    _vehicles: any[];
    _displayX: number;
    _displayY: number;
    _nameDisplay: boolean;
    _scrollDirection: number;
    _scrollRest: number;
    _scrollSpeed: number;
    _parallaxName: string;
    _parallaxZero: boolean;
    _parallaxLoopX: boolean;
    _parallaxLoopY: boolean;
    _parallaxSx: number;
    _parallaxSy: number;
    _parallaxX: number;
    _parallaxY: number;
    _battleback1Name: any;
    _battleback2Name: any;
    _needsRefresh: boolean;
    _tileEvents: any;
    constructor(...args: any[]) {
        this.initialize(...args);

    }

    public initialize(...args) {
        this._interpreter = new Game_Interpreter();
        this._mapId = 0;
        this._tilesetId = 0;
        this._events = [];
        this._commonEvents = [];
        this._vehicles = [];
        this._displayX = 0;
        this._displayY = 0;
        this._nameDisplay = true;
        this._scrollDirection = 2;
        this._scrollRest = 0;
        this._scrollSpeed = 4;
        this._parallaxName = "";
        this._parallaxZero = false;
        this._parallaxLoopX = false;
        this._parallaxLoopY = false;
        this._parallaxSx = 0;
        this._parallaxSy = 0;
        this._parallaxX = 0;
        this._parallaxY = 0;
        this._battleback1Name = null;
        this._battleback2Name = null;
        this.createVehicles();
    }

    public setup(mapId) {
        if (!$dataMap) {
            throw new Error("The map data is not available");
        }
        this._mapId = mapId;
        this._tilesetId = $dataMap.tilesetId;
        this._displayX = 0;
        this._displayY = 0;
        this.refereshVehicles();
        this.setupEvents();
        this.setupScroll();
        this.setupParallax();
        this.setupBattleback();
        this._needsRefresh = false;
    }

    public isEventRunning() {
        return this._interpreter.isRunning() || this.isAnyEventStarting();
    }

    public tileWidth() {
        return 48;
    }

    public tileHeight() {
        return 48;
    }

    public mapId() {
        return this._mapId;
    }

    public tilesetId() {
        return this._tilesetId;
    }

    public displayX() {
        return this._displayX;
    }

    public displayY() {
        return this._displayY;
    }

    public parallaxName() {
        return this._parallaxName;
    }

    public battleback1Name() {
        return this._battleback1Name;
    }

    public battleback2Name() {
        return this._battleback2Name;
    }

    public requestRefresh() {
        this._needsRefresh = true;
    }

    public isNameDisplayEnabled() {
        return this._nameDisplay;
    }

    public disableNameDisplay() {
        this._nameDisplay = false;
    }

    public enableNameDisplay() {
        this._nameDisplay = true;
    }

    public createVehicles() {
        this._vehicles = [];
        this._vehicles[0] = new Game_Vehicle("boat");
        this._vehicles[1] = new Game_Vehicle("ship");
        this._vehicles[2] = new Game_Vehicle("airship");
    }

    public refereshVehicles() {
        for (const vehicle of this._vehicles) {
            vehicle.refresh();
        }
    }

    public vehicles() {
        return this._vehicles;
    }

    public vehicle(type) {
        if (type === 0 || type === "boat") {
            return this.boat();
        } else if (type === 1 || type === "ship") {
            return this.ship();
        } else if (type === 2 || type === "airship") {
            return this.airship();
        } else {
            return null;
        }
    }

    public boat() {
        return this._vehicles[0];
    }

    public ship() {
        return this._vehicles[1];
    }

    public airship() {
        return this._vehicles[2];
    }

    public setupEvents() {
        this._events = [];
        this._commonEvents = [];
        for (const event of $dataMap.events.filter(event => !!event)) {
            this._events[event.id] = new Game_Event(this._mapId, event.id);
        }
        for (const commonEvent of this.parallelCommonEvents()) {
            this._commonEvents.push(new Game_CommonEvent(commonEvent.id));
        }
        this.refreshTileEvents();
    }

    public events() {
        return this._events.filter(event => !!event);
    }

    public event(eventId) {
        return this._events[eventId];
    }

    public eraseEvent(eventId) {
        this._events[eventId].erase();
    }

    public autorunCommonEvents() {
        return $dataCommonEvents.filter(
            commonEvent => commonEvent && commonEvent.trigger === 1
        );
    }

    public parallelCommonEvents() {
        return $dataCommonEvents.filter(
            commonEvent => commonEvent && commonEvent.trigger === 2
        );
    }

    public setupScroll() {
        this._scrollDirection = 2;
        this._scrollRest = 0;
        this._scrollSpeed = 4;
    }

    public setupParallax() {
        this._parallaxName = $dataMap.parallaxName || "";
        this._parallaxZero = ImageManager.isZeroParallax(this._parallaxName);
        this._parallaxLoopX = $dataMap.parallaxLoopX;
        this._parallaxLoopY = $dataMap.parallaxLoopY;
        this._parallaxSx = $dataMap.parallaxSx;
        this._parallaxSy = $dataMap.parallaxSy;
        this._parallaxX = 0;
        this._parallaxY = 0;
    }

    public setupBattleback() {
        if ($dataMap.specifyBattleback) {
            this._battleback1Name = $dataMap.battleback1Name;
            this._battleback2Name = $dataMap.battleback2Name;
        } else {
            this._battleback1Name = null;
            this._battleback2Name = null;
        }
    }

    public setDisplayPos(x, y) {
        if (this.isLoopHorizontal()) {
            this._displayX = x.mod(this.width());
            this._parallaxX = x;
        } else {
            const endX = this.width() - this.screenTileX();
            this._displayX = endX < 0 ? endX / 2 : x.clamp(0, endX);
            this._parallaxX = this._displayX;
        }
        if (this.isLoopVertical()) {
            this._displayY = y.mod(this.height());
            this._parallaxY = y;
        } else {
            const endY = this.height() - this.screenTileY();
            this._displayY = endY < 0 ? endY / 2 : y.clamp(0, endY);
            this._parallaxY = this._displayY;
        }
    }

    public parallaxOx() {
        if (this._parallaxZero) {
            return this._parallaxX * this.tileWidth();
        } else if (this._parallaxLoopX) {
            return (this._parallaxX * this.tileWidth()) / 2;
        } else {
            return 0;
        }
    }

    public parallaxOy() {
        if (this._parallaxZero) {
            return this._parallaxY * this.tileHeight();
        } else if (this._parallaxLoopY) {
            return (this._parallaxY * this.tileHeight()) / 2;
        } else {
            return 0;
        }
    }

    public tileset() {
        return $dataTilesets[this._tilesetId];
    }

    public tilesetFlags() {
        const tileset = this.tileset();
        if (tileset) {
            return tileset.flags;
        } else {
            return [];
        }
    }

    public displayName() {
        return $dataMap.displayName;
    }

    public width() {
        return $dataMap.width;
    }

    public height() {
        return $dataMap.height;
    }

    public data() {
        return $dataMap.data;
    }

    public isLoopHorizontal() {
        return $dataMap.scrollType === 2 || $dataMap.scrollType === 3;
    }

    public isLoopVertical() {
        return $dataMap.scrollType === 1 || $dataMap.scrollType === 3;
    }

    public isDashDisabled() {
        return $dataMap.disableDashing;
    }

    public encounterList() {
        return $dataMap.encounterList;
    }

    public encounterStep() {
        return $dataMap.encounterStep;
    }

    public isOverworld() {
        return this.tileset() && this.tileset().mode === 0;
    }

    public screenTileX() {
        return Graphics.width / this.tileWidth();
    }

    public screenTileY() {
        return Graphics.height / this.tileHeight();
    }

    public adjustX(x) {
        if (
            this.isLoopHorizontal() &&
            x < this._displayX - (this.width() - this.screenTileX()) / 2
        ) {
            return x - this._displayX + $dataMap.width;
        } else {
            return x - this._displayX;
        }
    }

    public adjustY(y) {
        if (
            this.isLoopVertical() &&
            y < this._displayY - (this.height() - this.screenTileY()) / 2
        ) {
            return y - this._displayY + $dataMap.height;
        } else {
            return y - this._displayY;
        }
    }

    public roundX(x) {
        return this.isLoopHorizontal() ? x.mod(this.width()) : x;
    }

    public roundY(y) {
        return this.isLoopVertical() ? y.mod(this.height()) : y;
    }

    public xWithDirection(x, d) {
        return x + (d === 6 ? 1 : d === 4 ? -1 : 0);
    }

    public yWithDirection(y, d) {
        return y + (d === 2 ? 1 : d === 8 ? -1 : 0);
    }

    public roundXWithDirection(x, d) {
        return this.roundX(x + (d === 6 ? 1 : d === 4 ? -1 : 0));
    }

    public roundYWithDirection(y, d) {
        return this.roundY(y + (d === 2 ? 1 : d === 8 ? -1 : 0));
    }

    public deltaX(x1, x2) {
        let result = x1 - x2;
        if (this.isLoopHorizontal() && Math.abs(result) > this.width() / 2) {
            if (result < 0) {
                result += this.width();
            } else {
                result -= this.width();
            }
        }
        return result;
    }

    public deltaY(y1, y2) {
        let result = y1 - y2;
        if (this.isLoopVertical() && Math.abs(result) > this.height() / 2) {
            if (result < 0) {
                result += this.height();
            } else {
                result -= this.height();
            }
        }
        return result;
    }

    public distance(x1, y1, x2, y2) {
        return Math.abs(this.deltaX(x1, x2)) + Math.abs(this.deltaY(y1, y2));
    }

    public canvasToMapX(x) {
        const tileWidth = this.tileWidth();
        const originX = this._displayX * tileWidth;
        const mapX = Math.floor((originX + x) / tileWidth);
        return this.roundX(mapX);
    }

    public canvasToMapY(y) {
        const tileHeight = this.tileHeight();
        const originY = this._displayY * tileHeight;
        const mapY = Math.floor((originY + y) / tileHeight);
        return this.roundY(mapY);
    }

    public autoplay() {
        if ($dataMap.autoplayBgm) {
            if ($gamePlayer.isInVehicle()) {
                $gameSystem.saveWalkingBgm2();
            } else {
                AudioManager.playBgm($dataMap.bgm);
            }
        }
        if ($dataMap.autoplayBgs) {
            AudioManager.playBgs($dataMap.bgs);
        }
    }

    public refreshIfNeeded() {
        if (this._needsRefresh) {
            this.refresh();
        }
    }

    public refresh() {
        for (const event of this.events()) {
            event.refresh();
        }
        for (const commonEvent of this._commonEvents) {
            commonEvent.refresh();
        }
        this.refreshTileEvents();
        this._needsRefresh = false;
    }

    public refreshTileEvents() {
        this._tileEvents = this.events().filter(event => event.isTile());
    }

    public eventsXy(x, y) {
        return this.events().filter(event => event.pos(x, y));
    }

    public eventsXyNt(x, y) {
        return this.events().filter(event => event.posNt(x, y));
    }

    public tileEventsXy(x, y) {
        return this._tileEvents.filter(event => event.posNt(x, y));
    }

    public eventIdXy(x, y) {
        const list = this.eventsXy(x, y);
        return list.length === 0 ? 0 : list[0].eventId();
    }

    public scrollDown(distance) {
        if (this.isLoopVertical()) {
            this._displayY += distance;
            this._displayY %= $dataMap.height;
            if (this._parallaxLoopY) {
                this._parallaxY += distance;
            }
        } else if (this.height() >= this.screenTileY()) {
            const lastY = this._displayY;
            this._displayY = Math.min(
                this._displayY + distance,
                this.height() - this.screenTileY()
            );
            this._parallaxY += this._displayY - lastY;
        }
    }

    public scrollLeft(distance) {
        if (this.isLoopHorizontal()) {
            this._displayX += $dataMap.width - distance;
            this._displayX %= $dataMap.width;
            if (this._parallaxLoopX) {
                this._parallaxX -= distance;
            }
        } else if (this.width() >= this.screenTileX()) {
            const lastX = this._displayX;
            this._displayX = Math.max(this._displayX - distance, 0);
            this._parallaxX += this._displayX - lastX;
        }
    }

    public scrollRight(distance) {
        if (this.isLoopHorizontal()) {
            this._displayX += distance;
            this._displayX %= $dataMap.width;
            if (this._parallaxLoopX) {
                this._parallaxX += distance;
            }
        } else if (this.width() >= this.screenTileX()) {
            const lastX = this._displayX;
            this._displayX = Math.min(
                this._displayX + distance,
                this.width() - this.screenTileX()
            );
            this._parallaxX += this._displayX - lastX;
        }
    }

    public scrollUp(distance) {
        if (this.isLoopVertical()) {
            this._displayY += $dataMap.height - distance;
            this._displayY %= $dataMap.height;
            if (this._parallaxLoopY) {
                this._parallaxY -= distance;
            }
        } else if (this.height() >= this.screenTileY()) {
            const lastY = this._displayY;
            this._displayY = Math.max(this._displayY - distance, 0);
            this._parallaxY += this._displayY - lastY;
        }
    }

    public isValid(x, y) {
        return x >= 0 && x < this.width() && y >= 0 && y < this.height();
    }

    public checkPassage(x, y, bit) {
        const flags = this.tilesetFlags();
        const tiles = this.allTiles(x, y);
        for (const tile of tiles) {
            const flag = flags[tile];
            if ((flag & 0x10) !== 0) {
                // [*] No effect on passage
                continue;
            }
            if ((flag & bit) === 0) {
                // [o] Passable
                return true;
            }
            if ((flag & bit) === bit) {
                // [x] Impassable
                return false;
            }
        }
        return false;
    }

    public tileId(x, y, z) {
        const width = $dataMap.width;
        const height = $dataMap.height;
        return $dataMap.data[(z * height + y) * width + x] || 0;
    }

    public layeredTiles(x, y) {
        const tiles = [];
        for (let i = 0; i < 4; i++) {
            tiles.push(this.tileId(x, y, 3 - i));
        }
        return tiles;
    }

    public allTiles(x, y) {
        const tiles = this.tileEventsXy(x, y).map(event => event.tileId());
        return tiles.concat(this.layeredTiles(x, y));
    }

    public autotileType(x, y, z) {
        const tileId = this.tileId(x, y, z);
        return tileId >= 2048 ? Math.floor((tileId - 2048) / 48) : -1;
    }

    public isPassable(x, y, d) {
        return this.checkPassage(x, y, (1 << (d / 2 - 1)) & 0x0f);
    }

    public isBoatPassable(x, y) {
        return this.checkPassage(x, y, 0x0200);
    }

    public isShipPassable(x, y) {
        return this.checkPassage(x, y, 0x0400);
    }

    public isAirshipLandOk(x, y) {
        return this.checkPassage(x, y, 0x0800) && this.checkPassage(x, y, 0x0f);
    }

    public checkLayeredTilesFlags(x, y, bit) {
        const flags = this.tilesetFlags();
        return this.layeredTiles(x, y).some(tileId => (flags[tileId] & bit) !== 0);
    }

    public isLadder(x, y) {
        return this.isValid(x, y) && this.checkLayeredTilesFlags(x, y, 0x20);
    }

    public isBush(x, y) {
        return this.isValid(x, y) && this.checkLayeredTilesFlags(x, y, 0x40);
    }

    public isCounter(x, y) {
        return this.isValid(x, y) && this.checkLayeredTilesFlags(x, y, 0x80);
    }

    public isDamageFloor(x, y) {
        return this.isValid(x, y) && this.checkLayeredTilesFlags(x, y, 0x100);
    }

    public terrainTag(x, y) {
        if (this.isValid(x, y)) {
            const flags = this.tilesetFlags();
            const tiles = this.layeredTiles(x, y);
            for (const tile of tiles) {
                const tag = flags[tile] >> 12;
                if (tag > 0) {
                    return tag;
                }
            }
        }
        return 0;
    }

    public regionId(x, y) {
        return this.isValid(x, y) ? this.tileId(x, y, 5) : 0;
    }

    public startScroll(direction, distance, speed) {
        this._scrollDirection = direction;
        this._scrollRest = distance;
        this._scrollSpeed = speed;
    }

    public isScrolling() {
        return this._scrollRest > 0;
    }

    public update(sceneActive) {
        this.refreshIfNeeded();
        if (sceneActive) {
            this.updateInterpreter();
        }
        this.updateScroll();
        this.updateEvents();
        this.updateVehicles();
        this.updateParallax();
    }

    public updateScroll() {
        if (this.isScrolling()) {
            const lastX = this._displayX;
            const lastY = this._displayY;
            this.doScroll(this._scrollDirection, this.scrollDistance());
            if (this._displayX === lastX && this._displayY === lastY) {
                this._scrollRest = 0;
            } else {
                this._scrollRest -= this.scrollDistance();
            }
        }
    }

    public scrollDistance() {
        return Math.pow(2, this._scrollSpeed) / 256;
    }

    public doScroll(direction, distance) {
        switch (direction) {
            case 2:
                this.scrollDown(distance);
                break;
            case 4:
                this.scrollLeft(distance);
                break;
            case 6:
                this.scrollRight(distance);
                break;
            case 8:
                this.scrollUp(distance);
                break;
        }
    }

    public updateEvents() {
        for (const event of this.events()) {
            event.update();
        }
        for (const commonEvent of this._commonEvents) {
            commonEvent.update();
        }
    }

    public updateVehicles() {
        for (const vehicle of this._vehicles) {
            vehicle.update();
        }
    }

    public updateParallax() {
        if (this._parallaxLoopX) {
            this._parallaxX += this._parallaxSx / this.tileWidth() / 2;
        }
        if (this._parallaxLoopY) {
            this._parallaxY += this._parallaxSy / this.tileHeight() / 2;
        }
    }

    public changeTileset(tilesetId) {
        this._tilesetId = tilesetId;
        this.refresh();
    }

    public changeBattleback(
        battleback1Name,
        battleback2Name
    ) {
        this._battleback1Name = battleback1Name;
        this._battleback2Name = battleback2Name;
    }

    public changeParallax(name, loopX, loopY, sx, sy) {
        this._parallaxName = name;
        this._parallaxZero = ImageManager.isZeroParallax(this._parallaxName);
        if (this._parallaxLoopX && !loopX) {
            this._parallaxX = 0;
        }
        if (this._parallaxLoopY && !loopY) {
            this._parallaxY = 0;
        }
        this._parallaxLoopX = loopX;
        this._parallaxLoopY = loopY;
        this._parallaxSx = sx;
        this._parallaxSy = sy;
    }

    public updateInterpreter() {
        for (; ;) {
            this._interpreter.update();
            if (this._interpreter.isRunning()) {
                return;
            }
            if (this._interpreter.eventId() > 0) {
                this.unlockEvent(this._interpreter.eventId());
                this._interpreter.clear();
            }
            if (!this.setupStartingEvent()) {
                return;
            }
        }
    }

    public unlockEvent(eventId) {
        if (this._events[eventId]) {
            this._events[eventId].unlock();
        }
    }

    public setupStartingEvent() {
        this.refreshIfNeeded();
        if (this._interpreter.setupReservedCommonEvent()) {
            return true;
        }
        if (this.setupTestEvent()) {
            return true;
        }
        if (this.setupStartingMapEvent()) {
            return true;
        }
        if (this.setupAutorunCommonEvent()) {
            return true;
        }
        return false;
    }

    public setupTestEvent() {
        if (window.$testEvent) {
            this._interpreter.setup($testEvent, 0);
            $testEvent = null;
            return true;
        }
        return false;
    }

    public setupStartingMapEvent() {
        for (const event of this.events()) {
            if (event.isStarting()) {
                event.clearStartingFlag();
                this._interpreter.setup(event.list(), event.eventId());
                return true;
            }
        }
        return false;
    }

    public setupAutorunCommonEvent() {
        for (const commonEvent of this.autorunCommonEvents()) {
            if ($gameSwitches.value(commonEvent.switchId)) {
                this._interpreter.setup(commonEvent.list);
                return true;
            }
        }
        return false;
    }

    public isAnyEventStarting() {
        return this.events().some(event => event.isStarting());
    }
}