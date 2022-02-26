import { Input, Point, Rectangle, TouchInput } from "../Core/index.js";
import { SoundManager, ColorManager } from "../Manager/index.js";
import { Window_Scrollable } from "./index.js";
//-----------------------------------------------------------------------------
/**
 * Window_Selectable
 * 
 * The window class with cursor movement functions.
*/
export class Window_Selectable extends Window_Scrollable {
    _index: number;
    _cursorFixed: boolean;
    _cursorAll: boolean;
    _helpWindow: any;
    _handlers: {};
    _doubleTouch: boolean;
    _canRepeat: boolean;
    constructor(...args: [Rectangle]) {
        super(...args);
        this.initialize(...args);
    }

    public initialize(rect) {
        Window_Scrollable.prototype.initialize.call(this, rect);
        this._index = -1;
        this._cursorFixed = false;
        this._cursorAll = false;
        this._helpWindow = null;
        this._handlers = {};
        this._doubleTouch = false;
        this._canRepeat = true;
        this.deactivate();
    };

    public index() {
        return this._index;
    };

    public cursorFixed() {
        return this._cursorFixed;
    };

    public setCursorFixed(cursorFixed) {
        this._cursorFixed = cursorFixed;
    };

    public cursorAll() {
        return this._cursorAll;
    };

    public setCursorAll(cursorAll) {
        this._cursorAll = cursorAll;
    };

    public maxCols() {
        return 1;
    };

    public maxItems() {
        return 0;
    };

    public colSpacing() {
        return 8;
    };

    public rowSpacing() {
        return 4;
    };

    public itemWidth() {
        return Math.floor(this.innerWidth / this.maxCols());
    };

    public itemHeight() {
        return Window_Scrollable.prototype.itemHeight.call(this) + 8;
    };

    public contentsHeight() {
        return this.innerHeight + this.itemHeight();
    };

    public maxRows() {
        return Math.max(Math.ceil(this.maxItems() / this.maxCols()), 1);
    };

    public overallHeight() {
        return this.maxRows() * this.itemHeight();
    };

    public activate() {
        Window_Scrollable.prototype.activate.call(this);
        this.reselect();
    };

    public deactivate() {
        Window_Scrollable.prototype.deactivate.call(this);
        this.reselect();
    };

    public select(index) {
        this._index = index;
        this.refreshCursor();
        this.callUpdateHelp();
    };

    public forceSelect(index) {
        this.select(index);
        this.ensureCursorVisible(false);
    };

    public smoothSelect(index) {
        this.select(index);
        this.ensureCursorVisible(true);
    };

    public deselect() {
        this.select(-1);
    };

    public reselect() {
        this.select(this._index);
        this.ensureCursorVisible(true);
        this.cursorVisible = true;
    };

    public row() {
        return Math.floor(this.index() / this.maxCols());
    };

    public topRow() {
        return Math.floor(this.scrollY() / this.itemHeight());
    };

    public maxTopRow() {
        return Math.max(0, this.maxRows() - this.maxPageRows());
    };

    public setTopRow(row) {
        this.scrollTo(this.scrollX(), row * this.itemHeight());
    };

    public maxPageRows() {
        return Math.floor(this.innerHeight / this.itemHeight());
    };

    public maxPageItems() {
        return this.maxPageRows() * this.maxCols();
    };

    public maxVisibleItems() {
        const visibleRows = Math.ceil(this.contentsHeight() / this.itemHeight());
        return visibleRows * this.maxCols();
    };

    public isHorizontal() {
        return this.maxPageRows() === 1;
    };

    public topIndex() {
        return this.topRow() * this.maxCols();
    };

    public itemRect(index) {
        const maxCols = this.maxCols();
        const itemWidth = this.itemWidth();
        const itemHeight = this.itemHeight();
        const colSpacing = this.colSpacing();
        const rowSpacing = this.rowSpacing();
        const col = index % maxCols;
        const row = Math.floor(index / maxCols);
        const x = col * itemWidth + colSpacing / 2 - this.scrollBaseX();
        const y = row * itemHeight + rowSpacing / 2 - this.scrollBaseY();
        const width = itemWidth - colSpacing;
        const height = itemHeight - rowSpacing;
        return new Rectangle(x, y, width, height);
    };

    public itemRectWithPadding(index) {
        const rect = this.itemRect(index);
        const padding = this.itemPadding();
        rect.x += padding;
        rect.width -= padding * 2;
        return rect;
    };

    public itemLineRect(index) {
        const rect = this.itemRectWithPadding(index);
        const padding = (rect.height - this.lineHeight()) / 2;
        rect.y += padding;
        rect.height -= padding * 2;
        return rect;
    };

    public setHelpWindow(helpWindow) {
        this._helpWindow = helpWindow;
        this.callUpdateHelp();
    };

    public showHelpWindow() {
        if (this._helpWindow) {
            this._helpWindow.show();
        }
    };

    public hideHelpWindow() {
        if (this._helpWindow) {
            this._helpWindow.hide();
        }
    };

    public setHandler(symbol, method) {
        this._handlers[symbol] = method;
    };

    public isHandled(symbol) {
        return !!this._handlers[symbol];
    };

    public callHandler(symbol) {
        if (this.isHandled(symbol)) {
            this._handlers[symbol]();
        }
    };

    public isOpenAndActive() {
        return this.isOpen() && this.visible && this.active;
    };

    public isCursorMovable() {
        return (
            this.isOpenAndActive() &&
            !this._cursorFixed &&
            !this._cursorAll &&
            this.maxItems() > 0
        );
    };

    public cursorDown(wrap) {
        const index = this.index();
        const maxItems = this.maxItems();
        const maxCols = this.maxCols();
        if (index < maxItems - maxCols || (wrap && maxCols === 1)) {
            this.smoothSelect((index + maxCols) % maxItems);
        }
    };

    public cursorUp(wrap) {
        const index = Math.max(0, this.index());
        const maxItems = this.maxItems();
        const maxCols = this.maxCols();
        if (index >= maxCols || (wrap && maxCols === 1)) {
            this.smoothSelect((index - maxCols + maxItems) % maxItems);
        }
    };

    public cursorRight(wrap) {
        const index = this.index();
        const maxItems = this.maxItems();
        const maxCols = this.maxCols();
        const horizontal = this.isHorizontal();
        if (maxCols >= 2 && (index < maxItems - 1 || (wrap && horizontal))) {
            this.smoothSelect((index + 1) % maxItems);
        }
    };

    public cursorLeft(wrap) {
        const index = Math.max(0, this.index());
        const maxItems = this.maxItems();
        const maxCols = this.maxCols();
        const horizontal = this.isHorizontal();
        if (maxCols >= 2 && (index > 0 || (wrap && horizontal))) {
            this.smoothSelect((index - 1 + maxItems) % maxItems);
        }
    };

    public cursorPagedown() {
        const index = this.index();
        const maxItems = this.maxItems();
        if (this.topRow() + this.maxPageRows() < this.maxRows()) {
            this.smoothScrollDown(this.maxPageRows());
            this.select(Math.min(index + this.maxPageItems(), maxItems - 1));
        }
    };

    public cursorPageup() {
        const index = this.index();
        if (this.topRow() > 0) {
            this.smoothScrollUp(this.maxPageRows());
            this.select(Math.max(index - this.maxPageItems(), 0));
        }
    };

    public isScrollEnabled() {
        return this.active || this.index() < 0;
    };

    public update() {
        this.processCursorMove();
        this.processHandling();
        this.processTouch();
        Window_Scrollable.prototype.update.call(this);
    };

    public processCursorMove() {
        if (this.isCursorMovable()) {
            const lastIndex = this.index();
            if (Input.isRepeated("down")) {
                this.cursorDown(Input.isTriggered("down"));
            }
            if (Input.isRepeated("up")) {
                this.cursorUp(Input.isTriggered("up"));
            }
            if (Input.isRepeated("right")) {
                this.cursorRight(Input.isTriggered("right"));
            }
            if (Input.isRepeated("left")) {
                this.cursorLeft(Input.isTriggered("left"));
            }
            if (!this.isHandled("pagedown") && Input.isTriggered("pagedown")) {
                this.cursorPagedown();
            }
            if (!this.isHandled("pageup") && Input.isTriggered("pageup")) {
                this.cursorPageup();
            }
            if (this.index() !== lastIndex) {
                this.playCursorSound();
            }
        }
    };

    public processHandling() {
        if (this.isOpenAndActive()) {
            if (this.isOkEnabled() && this.isOkTriggered()) {
                return this.processOk();
            }
            if (this.isCancelEnabled() && this.isCancelTriggered()) {
                return this.processCancel();
            }
            if (this.isHandled("pagedown") && Input.isTriggered("pagedown")) {
                return this.processPagedown();
            }
            if (this.isHandled("pageup") && Input.isTriggered("pageup")) {
                return this.processPageup();
            }
        }
    };

    public processTouch() {
        if (this.isOpenAndActive()) {
            if (this.isHoverEnabled() && TouchInput.isHovered()) {
                this.onTouchSelect(false);
            } else if (TouchInput.isTriggered()) {
                this.onTouchSelect(true);
            }
            if (TouchInput.isClicked()) {
                this.onTouchOk();
            } else if (TouchInput.isCancelled()) {
                this.onTouchCancel();
            }
        }
    };

    public isHoverEnabled() {
        return true;
    };

    public onTouchSelect(trigger) {
        this._doubleTouch = false;
        if (this.isCursorMovable()) {
            const lastIndex = this.index();
            const hitIndex = this.hitIndex();
            if (hitIndex >= 0) {
                if (hitIndex === this.index()) {
                    this._doubleTouch = true;
                }
                this.select(hitIndex);
            }
            if (trigger && this.index() !== lastIndex) {
                this.playCursorSound();
            }
        }
    };

    public onTouchOk() {
        if (this.isTouchOkEnabled()) {
            const hitIndex = this.hitIndex();
            if (this._cursorFixed) {
                if (hitIndex === this.index()) {
                    this.processOk();
                }
            } else if (hitIndex >= 0) {
                this.processOk();
            }
        }
    };

    public onTouchCancel() {
        if (this.isCancelEnabled()) {
            this.processCancel();
        }
    };

    public hitIndex() {
        const touchPos = new Point(TouchInput.x, TouchInput.y);
        const localPos = this.worldTransform.applyInverse(touchPos);
        return this.hitTest(localPos.x, localPos.y);
    };

    public hitTest(x, y) {
        if (this.innerRect.contains(x, y)) {
            const cx = this.origin.x + x - this.padding;
            const cy = this.origin.y + y - this.padding;
            const topIndex = this.topIndex();
            for (let i = 0; i < this.maxVisibleItems(); i++) {
                const index = topIndex + i;
                if (index < this.maxItems()) {
                    const rect = this.itemRect(index);
                    if (rect.contains(cx, cy)) {
                        return index;
                    }
                }
            }
        }
        return -1;
    };

    public isTouchOkEnabled() {
        return (
            this.isOkEnabled() &&
            (this._cursorFixed || this._cursorAll || this._doubleTouch)
        );
    };

    public isOkEnabled() {
        return this.isHandled("ok");
    };

    public isCancelEnabled() {
        return this.isHandled("cancel");
    };

    public isOkTriggered() {
        return this._canRepeat ? Input.isRepeated("ok") : Input.isTriggered("ok");
    };

    public isCancelTriggered() {
        return Input.isRepeated("cancel");
    };

    public processOk() {
        if (this.isCurrentItemEnabled()) {
            this.playOkSound();
            this.updateInputData();
            this.deactivate();
            this.callOkHandler();
        } else {
            this.playBuzzerSound();
        }
    };

    public callOkHandler() {
        this.callHandler("ok");
    };

    public processCancel() {
        SoundManager.playCancel();
        this.updateInputData();
        this.deactivate();
        this.callCancelHandler();
    };

    public callCancelHandler() {
        this.callHandler("cancel");
    };

    public processPageup() {
        this.updateInputData();
        this.deactivate();
        this.callHandler("pageup");
    };

    public processPagedown() {
        this.updateInputData();
        this.deactivate();
        this.callHandler("pagedown");
    };

    public updateInputData() {
        Input.update();
        TouchInput.update();
        this.clearScrollStatus();
    };

    public ensureCursorVisible(smooth) {
        if (this._cursorAll) {
            this.scrollTo(0, 0);
        } else if (this.innerHeight > 0 && this.row() >= 0) {
            const scrollY = this.scrollY();
            const itemTop = this.row() * this.itemHeight();
            const itemBottom = itemTop + this.itemHeight();
            const scrollMin = itemBottom - this.innerHeight;
            if (scrollY > itemTop) {
                if (smooth) {
                    this.smoothScrollTo(0, itemTop);
                } else {
                    this.scrollTo(0, itemTop);
                }
            } else if (scrollY < scrollMin) {
                if (smooth) {
                    this.smoothScrollTo(0, scrollMin);
                } else {
                    this.scrollTo(0, scrollMin);
                }
            }
        }
    };

    public callUpdateHelp() {
        if (this.active && this._helpWindow) {
            this.updateHelp();
        }
    };

    public updateHelp() {
        this._helpWindow.clear();
    };

    public setHelpWindowItem(item) {
        if (this._helpWindow) {
            this._helpWindow.setItem(item);
        }
    };

    public isCurrentItemEnabled() {
        return true;
    };

    public drawAllItems() {
        const topIndex = this.topIndex();
        for (let i = 0; i < this.maxVisibleItems(); i++) {
            const index = topIndex + i;
            if (index < this.maxItems()) {
                this.drawItemBackground(index);
                this.drawItem(index);
            }
        }
    };

    public drawItem(...args:any[] /*index*/) {
        //
    };

    public clearItem(index) {
        const rect = this.itemRect(index);
        this.contents.clearRect(rect.x, rect.y, rect.width, rect.height);
        this.contentsBack.clearRect(rect.x, rect.y, rect.width, rect.height);
    };

    public drawItemBackground(index) {
        const rect = this.itemRect(index);
        this.drawBackgroundRect(rect);
    };

    public drawBackgroundRect(rect) {
        const c1 = ColorManager.itemBackColor1();
        const c2 = ColorManager.itemBackColor2();
        const x = rect.x;
        const y = rect.y;
        const w = rect.width;
        const h = rect.height;
        this.contentsBack.gradientFillRect(x, y, w, h, c1, c2, true);
        this.contentsBack.strokeRect(x, y, w, h, c1);
    };

    public redrawItem(index) {
        if (index >= 0) {
            this.clearItem(index);
            this.drawItemBackground(index);
            this.drawItem(index);
        }
    };

    public redrawCurrentItem() {
        this.redrawItem(this.index());
    };

    public refresh() {
        this.paint();
    };

    public paint() {
        if (this.contents) {
            this.contents.clear();
            this.contentsBack.clear();
            this.drawAllItems();
        }
    };

    public refreshCursor() {
        if (this._cursorAll) {
            this.refreshCursorForAll();
        } else if (this.index() >= 0) {
            const rect = this.itemRect(this.index());
            this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
        } else {
            this.setCursorRect(0, 0, 0, 0);
        }
    };

    public refreshCursorForAll() {
        const maxItems = this.maxItems();
        if (maxItems > 0) {
            const rect = this.itemRect(0);
            rect.enlarge(this.itemRect(maxItems - 1));
            this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
        } else {
            this.setCursorRect(0, 0, 0, 0);
        }
    };
}

