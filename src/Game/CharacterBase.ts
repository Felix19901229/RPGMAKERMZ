import { ImageManager } from "../Manager/index.js";
import { Graphics } from "../Core/index.js";

//-----------------------------------------------------------------------------
/**
 * Game_CharacterBase
 * 
 * The superclass of Game_Character. It handles basic information, such as
 * coordinates and images, shared by all characters.
*/
export class Game_CharacterBase {
    _x: number;
    _y: number;
    _realX: number;
    _realY: number;
    _moveSpeed: number;
    _moveFrequency: number;
    _opacity: number;
    _blendMode: number;
    _direction: number;
    _pattern: number;
    _priorityType: number;
    _tileId: number;
    _characterName: string;
    _characterIndex: number;
    _isObjectCharacter: boolean;
    _walkAnime: boolean;
    _stepAnime: boolean;
    _directionFix: boolean;
    _through: boolean;
    _transparent: boolean;
    _bushDepth: number;
    _animationId: number;
    _balloonId: number;
    _animationPlaying: boolean;
    _balloonPlaying: boolean;
    _animationCount: number;
    _stopCount: number;
    _jumpCount: number;
    _jumpPeak: number;
    _movementSuccess: boolean;

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }
    constructor(...args: any[]) {
        this.initialize(...args);
    }


    public initialize(...args) {
        this.initMembers();
    }

    public initMembers() {
        this._x = 0;
        this._y = 0;
        this._realX = 0;
        this._realY = 0;
        this._moveSpeed = 4;
        this._moveFrequency = 6;
        this._opacity = 255;
        this._blendMode = 0;
        this._direction = 2;
        this._pattern = 1;
        this._priorityType = 1;
        this._tileId = 0;
        this._characterName = "";
        this._characterIndex = 0;
        this._isObjectCharacter = false;
        this._walkAnime = true;
        this._stepAnime = false;
        this._directionFix = false;
        this._through = false;
        this._transparent = false;
        this._bushDepth = 0;
        this._animationId = 0;
        this._balloonId = 0;
        this._animationPlaying = false;
        this._balloonPlaying = false;
        this._animationCount = 0;
        this._stopCount = 0;
        this._jumpCount = 0;
        this._jumpPeak = 0;
        this._movementSuccess = true;
    }

    public pos(x, y) {
        return this._x === x && this._y === y;
    }

    public posNt(x, y) {
        // No through
        return this.pos(x, y) && !this.isThrough();
    }

    public moveSpeed() {
        return this._moveSpeed;
    }

    public setMoveSpeed(moveSpeed) {
        this._moveSpeed = moveSpeed;
    }

    public moveFrequency() {
        return this._moveFrequency;
    }

    public setMoveFrequency(moveFrequency) {
        this._moveFrequency = moveFrequency;
    }

    public opacity() {
        return this._opacity;
    }

    public setOpacity(opacity) {
        this._opacity = opacity;
    }

    public blendMode() {
        return this._blendMode;
    }

    public setBlendMode(blendMode) {
        this._blendMode = blendMode;
    }

    public isNormalPriority() {
        return this._priorityType === 1;
    }

    public setPriorityType(priorityType) {
        this._priorityType = priorityType;
    }

    public isMoving() {
        return this._realX !== this._x || this._realY !== this._y;
    }

    public isJumping() {
        return this._jumpCount > 0;
    }

    public jumpHeight() {
        return (
            (this._jumpPeak * this._jumpPeak -
                Math.pow(Math.abs(this._jumpCount - this._jumpPeak), 2)) /
            2
        );
    }

    public isStopping() {
        return !this.isMoving() && !this.isJumping();
    }

    public checkStop(threshold) {
        return this._stopCount > threshold;
    }

    public resetStopCount() {
        this._stopCount = 0;
    }

    public realMoveSpeed() {
        return this._moveSpeed + (this.isDashing() ? 1 : 0);
    }

    public distancePerFrame() {
        return Math.pow(2, this.realMoveSpeed()) / 256;
    }

    public isDashing() {
        return false;
    }

    public isDebugThrough() {
        return false;
    }

    public straighten() {
        if (this.hasWalkAnime() || this.hasStepAnime()) {
            this._pattern = 1;
        }
        this._animationCount = 0;
    }

    public reverseDir(d) {
        return 10 - d;
    }

    public canPass(x, y, d) {
        const x2 = window.$gameMap.roundXWithDirection(x, d);
        const y2 = window.$gameMap.roundYWithDirection(y, d);
        if (!window.$gameMap.isValid(x2, y2)) {
            return false;
        }
        if (this.isThrough() || this.isDebugThrough()) {
            return true;
        }
        if (!this.isMapPassable(x, y, d)) {
            return false;
        }
        if (this.isCollidedWithCharacters(x2, y2)) {
            return false;
        }
        return true;
    }

    public canPassDiagonally(x, y, horz, vert) {
        const x2 = window.$gameMap.roundXWithDirection(x, horz);
        const y2 = window.$gameMap.roundYWithDirection(y, vert);
        if (this.canPass(x, y, vert) && this.canPass(x, y2, horz)) {
            return true;
        }
        if (this.canPass(x, y, horz) && this.canPass(x2, y, vert)) {
            return true;
        }
        return false;
    }

    public isMapPassable(x, y, d) {
        const x2 = window.$gameMap.roundXWithDirection(x, d);
        const y2 = window.$gameMap.roundYWithDirection(y, d);
        const d2 = this.reverseDir(d);
        return window.$gameMap.isPassable(x, y, d) && window.$gameMap.isPassable(x2, y2, d2);
    }

    public isCollidedWithCharacters(x, y) {
        return this.isCollidedWithEvents(x, y) || this.isCollidedWithVehicles(x, y);
    }

    public isCollidedWithEvents(x, y) {
        const events = window.$gameMap.eventsXyNt(x, y);
        return events.some(event => event.isNormalPriority());
    }

    public isCollidedWithVehicles(x, y) {
        return window.$gameMap.boat().posNt(x, y) || window.$gameMap.ship().posNt(x, y);
    }

    public setPosition(x, y) {
        this._x = Math.round(x);
        this._y = Math.round(y);
        this._realX = x;
        this._realY = y;
    }

    public copyPosition(character) {
        this._x = character._x;
        this._y = character._y;
        this._realX = character._realX;
        this._realY = character._realY;
        this._direction = character._direction;
    }

    public locate(x, y) {
        this.setPosition(x, y);
        this.straighten();
        this.refreshBushDepth();
    }

    public direction() {
        return this._direction;
    }

    public setDirection(d) {
        if (!this.isDirectionFixed() && d) {
            this._direction = d;
        }
        this.resetStopCount();
    }

    public isTile() {
        return this._tileId > 0 && this._priorityType === 0;
    }

    public isObjectCharacter() {
        return this._isObjectCharacter;
    }

    public shiftY() {
        return this.isObjectCharacter() ? 0 : 6;
    }

    public scrolledX() {
        return window.$gameMap.adjustX(this._realX);
    }

    public scrolledY() {
        return window.$gameMap.adjustY(this._realY);
    }

    public screenX() {
        const tw = window.$gameMap.tileWidth();
        return Math.floor(this.scrolledX() * tw + tw / 2);
    }

    public screenY() {
        const th = window.$gameMap.tileHeight();
        return Math.floor(
            this.scrolledY() * th + th - this.shiftY() - this.jumpHeight()
        );
    }

    public screenZ() {
        return this._priorityType * 2 + 1;
    }

    public isNearTheScreen() {
        const gw = Graphics.width;
        const gh = Graphics.height;
        const tw = window.$gameMap.tileWidth();
        const th = window.$gameMap.tileHeight();
        const px = this.scrolledX() * tw + tw / 2 - gw / 2;
        const py = this.scrolledY() * th + th / 2 - gh / 2;
        return px >= -gw && px <= gw && py >= -gh && py <= gh;
    }

    public update(...args:any[]) {
        if (this.isStopping()) {
            this.updateStop();
        }
        if (this.isJumping()) {
            this.updateJump();
        } else if (this.isMoving()) {
            this.updateMove();
        }
        this.updateAnimation();
    }

    public updateStop() {
        this._stopCount++;
    }

    public updateJump() {
        this._jumpCount--;
        this._realX =
            (this._realX * this._jumpCount + this._x) / (this._jumpCount + 1.0);
        this._realY =
            (this._realY * this._jumpCount + this._y) / (this._jumpCount + 1.0);
        this.refreshBushDepth();
        if (this._jumpCount === 0) {
            this._realX = this._x = window.$gameMap.roundX(this._x);
            this._realY = this._y = window.$gameMap.roundY(this._y);
        }
    }

    public updateMove() {
        if (this._x < this._realX) {
            this._realX = Math.max(this._realX - this.distancePerFrame(), this._x);
        }
        if (this._x > this._realX) {
            this._realX = Math.min(this._realX + this.distancePerFrame(), this._x);
        }
        if (this._y < this._realY) {
            this._realY = Math.max(this._realY - this.distancePerFrame(), this._y);
        }
        if (this._y > this._realY) {
            this._realY = Math.min(this._realY + this.distancePerFrame(), this._y);
        }
        if (!this.isMoving()) {
            this.refreshBushDepth();
        }
    }

    public updateAnimation() {
        this.updateAnimationCount();
        if (this._animationCount >= this.animationWait()) {
            this.updatePattern();
            this._animationCount = 0;
        }
    }

    public animationWait() {
        return (9 - this.realMoveSpeed()) * 3;
    }

    public updateAnimationCount() {
        if (this.isMoving() && this.hasWalkAnime()) {
            this._animationCount += 1.5;
        } else if (this.hasStepAnime() || !this.isOriginalPattern()) {
            this._animationCount++;
        }
    }

    public updatePattern() {
        if (!this.hasStepAnime() && this._stopCount > 0) {
            this.resetPattern();
        } else {
            this._pattern = (this._pattern + 1) % this.maxPattern();
        }
    }

    public maxPattern() {
        return 4;
    }

    public pattern() {
        return this._pattern < 3 ? this._pattern : 1;
    }

    public setPattern(pattern) {
        this._pattern = pattern;
    }

    public isOriginalPattern() {
        return this.pattern() === 1;
    }

    public resetPattern() {
        this.setPattern(1);
    }

    public refreshBushDepth() {
        if (
            this.isNormalPriority() &&
            !this.isObjectCharacter() &&
            this.isOnBush() &&
            !this.isJumping()
        ) {
            if (!this.isMoving()) {
                this._bushDepth = 12;
            }
        } else {
            this._bushDepth = 0;
        }
    }

    public isOnLadder() {
        return window.$gameMap.isLadder(this._x, this._y);
    }

    public isOnBush() {
        return window.$gameMap.isBush(this._x, this._y);
    }

    public terrainTag() {
        return window.$gameMap.terrainTag(this._x, this._y);
    }

    public regionId() {
        return window.$gameMap.regionId(this._x, this._y);
    }

    public increaseSteps() {
        if (this.isOnLadder()) {
            this.setDirection(8);
        }
        this.resetStopCount();
        this.refreshBushDepth();
    }

    public tileId() {
        return this._tileId;
    }

    public characterName() {
        return this._characterName;
    }

    public characterIndex() {
        return this._characterIndex;
    }

    public setImage(
        characterName,
        characterIndex
    ) {
        this._tileId = 0;
        this._characterName = characterName;
        this._characterIndex = characterIndex;
        this._isObjectCharacter = ImageManager.isObjectCharacter(characterName);
    }

    public setTileImage(tileId) {
        this._tileId = tileId;
        this._characterName = "";
        this._characterIndex = 0;
        this._isObjectCharacter = true;
    }

    public checkEventTriggerTouchFront(d) {
        const x2 = window.$gameMap.roundXWithDirection(this._x, d);
        const y2 = window.$gameMap.roundYWithDirection(this._y, d);
        this.checkEventTriggerTouch(x2, y2);
    }

    public checkEventTriggerTouch(x: number, y: number):any {
        return false;
    }

    public isMovementSucceeded(/*x, y*/) {
        return this._movementSuccess;
    }

    public setMovementSuccess(success) {
        this._movementSuccess = success;
    }

    public moveStraight(d) {
        this.setMovementSuccess(this.canPass(this._x, this._y, d));
        if (this.isMovementSucceeded()) {
            this.setDirection(d);
            this._x = window.$gameMap.roundXWithDirection(this._x, d);
            this._y = window.$gameMap.roundYWithDirection(this._y, d);
            this._realX = window.$gameMap.xWithDirection(this._x, this.reverseDir(d));
            this._realY = window.$gameMap.yWithDirection(this._y, this.reverseDir(d));
            this.increaseSteps();
        } else {
            this.setDirection(d);
            this.checkEventTriggerTouchFront(d);
        }
    }

    public moveDiagonally(horz, vert) {
        this.setMovementSuccess(
            this.canPassDiagonally(this._x, this._y, horz, vert)
        );
        if (this.isMovementSucceeded()) {
            this._x = window.$gameMap.roundXWithDirection(this._x, horz);
            this._y = window.$gameMap.roundYWithDirection(this._y, vert);
            this._realX = window.$gameMap.xWithDirection(this._x, this.reverseDir(horz));
            this._realY = window.$gameMap.yWithDirection(this._y, this.reverseDir(vert));
            this.increaseSteps();
        }
        if (this._direction === this.reverseDir(horz)) {
            this.setDirection(horz);
        }
        if (this._direction === this.reverseDir(vert)) {
            this.setDirection(vert);
        }
    }

    public jump(xPlus, yPlus) {
        if (Math.abs(xPlus) > Math.abs(yPlus)) {
            if (xPlus !== 0) {
                this.setDirection(xPlus < 0 ? 4 : 6);
            }
        } else {
            if (yPlus !== 0) {
                this.setDirection(yPlus < 0 ? 8 : 2);
            }
        }
        this._x += xPlus;
        this._y += yPlus;
        const distance = Math.round(Math.sqrt(xPlus * xPlus + yPlus * yPlus));
        this._jumpPeak = 10 + distance - this._moveSpeed;
        this._jumpCount = this._jumpPeak * 2;
        this.resetStopCount();
        this.straighten();
    }

    public hasWalkAnime() {
        return this._walkAnime;
    }

    public setWalkAnime(walkAnime) {
        this._walkAnime = walkAnime;
    }

    public hasStepAnime() {
        return this._stepAnime;
    }

    public setStepAnime(stepAnime) {
        this._stepAnime = stepAnime;
    }

    public isDirectionFixed() {
        return this._directionFix;
    }

    public setDirectionFix(directionFix) {
        this._directionFix = directionFix;
    }

    public isThrough() {
        return this._through;
    }

    public setThrough(through) {
        this._through = through;
    }

    public isTransparent() {
        return this._transparent;
    }

    public bushDepth() {
        return this._bushDepth;
    }

    public setTransparent(transparent) {
        this._transparent = transparent;
    }

    public startAnimation() {
        this._animationPlaying = true;
    }

    public startBalloon() {
        this._balloonPlaying = true;
    }

    public isAnimationPlaying() {
        return this._animationPlaying;
    }

    public isBalloonPlaying() {
        return this._balloonPlaying;
    }

    public endAnimation() {
        this._animationPlaying = false;
    }

    public endBalloon() {
        this._balloonPlaying = false;
    }
}

