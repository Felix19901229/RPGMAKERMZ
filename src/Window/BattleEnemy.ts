import { Rectangle } from "../Core/index.js";
import { Window_Selectable } from "./index.js";

//-----------------------------------------------------------------------------
/**
 * Window_BattleEnemy
 * 
 * The window for selecting a target enemy on the battle screen.
*/
export class Window_BattleEnemy extends Window_Selectable {
    _enemies: any[];
    constructor(...args: [Rectangle]) {
        super(...args);
        this.initialize(...args);
    }

    public initialize(rect:Rectangle) {
        this._enemies = [];
        Window_Selectable.prototype.initialize.call(this, rect);
        this.refresh();
        this.hide();
    };

    public maxCols() {
        return 2;
    };

    public maxItems() {
        return this._enemies.length;
    };

    public enemy() {
        return this._enemies[this.index()];
    };

    public enemyIndex() {
        const enemy = this.enemy();
        return enemy ? enemy.index() : -1;
    };

    public drawItem(index) {
        this.resetTextColor();
        const name = this._enemies[index].name();
        const rect = this.itemLineRect(index);
        this.drawText(name, rect.x, rect.y, rect.width);
    };

    public show() {
        this.refresh();
        this.forceSelect(0);
        window.$gameTemp.clearTouchState();
        Window_Selectable.prototype.show.call(this);
    };

    public hide() {
        Window_Selectable.prototype.hide.call(this);
        window.$gameTroop.select(null);
    };

    public refresh() {
        this._enemies = window.$gameTroop.aliveMembers();
        Window_Selectable.prototype.refresh.call(this);
    };

    public select(index) {
        Window_Selectable.prototype.select.call(this, index);
        window.$gameTroop.select(this.enemy());
    };

    public processTouch() {
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
    };


}
