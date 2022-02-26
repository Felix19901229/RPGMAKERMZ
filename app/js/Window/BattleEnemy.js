import { Window_Selectable } from "./index.js";
export class Window_BattleEnemy extends Window_Selectable {
    _enemies;
    constructor(...args) {
        super(...args);
        this.initialize(...args);
    }
    initialize(rect) {
        this._enemies = [];
        Window_Selectable.prototype.initialize.call(this, rect);
        this.refresh();
        this.hide();
    }
    ;
    maxCols() {
        return 2;
    }
    ;
    maxItems() {
        return this._enemies.length;
    }
    ;
    enemy() {
        return this._enemies[this.index()];
    }
    ;
    enemyIndex() {
        const enemy = this.enemy();
        return enemy ? enemy.index() : -1;
    }
    ;
    drawItem(index) {
        this.resetTextColor();
        const name = this._enemies[index].name();
        const rect = this.itemLineRect(index);
        this.drawText(name, rect.x, rect.y, rect.width);
    }
    ;
    show() {
        this.refresh();
        this.forceSelect(0);
        window.$gameTemp.clearTouchState();
        Window_Selectable.prototype.show.call(this);
    }
    ;
    hide() {
        Window_Selectable.prototype.hide.call(this);
        window.$gameTroop.select(null);
    }
    ;
    refresh() {
        this._enemies = window.$gameTroop.aliveMembers();
        Window_Selectable.prototype.refresh.call(this);
    }
    ;
    select(index) {
        Window_Selectable.prototype.select.call(this, index);
        window.$gameTroop.select(this.enemy());
    }
    ;
    processTouch() {
        Window_Selectable.prototype.processTouch.call(this);
        if (this.isOpenAndActive()) {
            const target = window.$gameTemp.touchTarget();
            if (target) {
                if (this._enemies.includes(target)) {
                    this.select(this._enemies.indexOf(target));
                    if (window.$gameTemp.touchState() === "click") {
                        this.processOk();
                    }
                }
                window.$gameTemp.clearTouchState();
            }
        }
    }
    ;
}
