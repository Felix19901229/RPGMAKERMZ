import { Rectangle } from "../Core/index.js";
import { TextManager, DataManager } from "../Manager/index.js";
import { Window_Command } from "./index.js";
//-----------------------------------------------------------------------------
/**
 * 标题选项的命令窗口
 * 
 * 这是一个标题选项的命令窗口
*/
export class Window_TitleCommand extends Window_Command {
    static _lastCommandSymbol = null;

    constructor(...args: [Rectangle]) {
        super(...args);
        this.initialize(...args);
    }

    public initialize(rect) {
        Window_Command.prototype.initialize.call(this, rect);
        this.openness = 0;
        this.selectLast();
    };


    static initCommandPosition() {
        this._lastCommandSymbol = null;
    };

    /**
     * 创建标题命令
    */
    public makeCommandList() {
        const continueEnabled = this.isContinueEnabled();
        //添加新游戏指令
        this.addCommand(TextManager.newGame, "newGame");
        //添加继续游戏指令
        this.addCommand(TextManager.continue_, "continue", continueEnabled);
        //添加选项指令
        this.addCommand(TextManager.options, "options");
    };

    /**
     * 是否可以继续游戏
    */
    public isContinueEnabled() {
        return DataManager.isAnySavefileExists();
    };

    /**
     * 选中处理
    */
    public processOk() {
        Window_TitleCommand._lastCommandSymbol = this.currentSymbol();
        //调用父级processOk行数
        super.processOk();
        // Window_Command.prototype.processOk.call(this);
    };

    public selectLast() {
        if (Window_TitleCommand._lastCommandSymbol) {
            this.selectSymbol(Window_TitleCommand._lastCommandSymbol);
        } else if (this.isContinueEnabled()) {
            this.selectSymbol("continue");
        }
    };

}
