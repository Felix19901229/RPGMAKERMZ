//=============================================================================
// main.js v1.0.0
//=============================================================================
declare const $plugins: any;
declare const effekseer: any;
declare const SceneManager: any;
declare const Scene_Boot: any;
import './Core/JsExtensions.js';
import * as Core from "./Core/index.js";
import * as Manager from './Manager/index.js';
import * as Game from "./Game/index.js";

// import * as Windows from "./Windows/index.js";
// import * as Sprite from "./Sprite/index.js";
// import * as Scenes from "./Scenes/index.js";
window.$dataActors = null;
window.$dataClasses = null;
window.$dataSkills = null;
window.$dataItems = null;
window.$dataWeapons = null;
window.$dataArmors = null;
window.$dataEnemies = null;
window.$dataTroops = null;
window.$dataStates = null;
window.$dataAnimations = null;
window.$dataTilesets = null;
window.$dataCommonEvents = null;
window.$dataSystem = null;
window.$dataMapInfos = null;
window.$dataMap = null;
window.$gameTemp = null;
window.$gameSystem = null;
window.$gameScreen = null;
window.$gameTimer = null;
window.$gameMessage = null;
window.$gameSwitches = null;
window.$gameVariables = null;
window.$gameSelfSwitches = null;
window.$gameActors = null;
window.$gameParty = null;
window.$gameTroop = null;
window.$gameMap = null;
window.$gamePlayer = null;
window.$testEvent = null;


// declare const process:NodeJS.Process
const scriptUrls = [
    "js/libs/pako.min.js",
    "js/libs/localforage.min.js",
    "js/libs/effekseer.min.js",
    "js/libs/vorbisdecoder.js",
    "js/rmmz_objects.js",
    "js/rmmz_scenes.js",
    "js/rmmz_sprites.js",
    "js/rmmz_windows.js",
    "js/plugins.js"
];
const effekseerWasmUrl = "js/libs/effekseer.wasm";

class Main {
    public xhrSucceeded = false;
    public loadCount = 0;
    public error: any = null;
    public numScripts: number = 0;
    constructor() {
        this.xhrSucceeded = false;
        this.loadCount = 0;
        this.error = null;
    }

    run() {
        Object.assign(window, Core);
        Object.assign(window, Manager);
        Object.assign(window, Game);
        // Object.assign(window, Windows);
        // Object.assign(window, Sprite);
        // Object.assign(window, Scenes);
        // window.PluginManager = PluginManager;
        // window.DataManager = DataManager;

        this.showLoadingSpinner();
        this.testXhr();
        this.loadMainScripts();
    }

    showLoadingSpinner() {
        const loadingSpinner = document.createElement("div");
        const loadingSpinnerImage = document.createElement("div");
        loadingSpinner.id = "loadingSpinner";
        loadingSpinnerImage.id = "loadingSpinnerImage";
        loadingSpinner.appendChild(loadingSpinnerImage);
        document.body.appendChild(loadingSpinner);
    }

    eraseLoadingSpinner() {
        const loadingSpinner = document.getElementById("loadingSpinner");
        if (loadingSpinner) {
            document.body.removeChild(loadingSpinner);
        }
    }

    testXhr() {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", document.currentScript ? (document.currentScript as HTMLScriptElement).src : import.meta.url);
        xhr.onload = () => (this.xhrSucceeded = true);
        xhr.send();
    }

    loadMainScripts() {
        for (const url of scriptUrls) {
            const script = document.createElement("script");
            script.type = "text/javascript";
            script.src = url;
            script.async = false;
            script.defer = true;
            script.onload = this.onScriptLoad.bind(this);
            script.onerror = this.onScriptError.bind(this);
            script._url = url;
            document.body.appendChild(script);
        }
        this.numScripts = scriptUrls.length;
        window.addEventListener("load", this.onWindowLoad.bind(this));
        window.addEventListener("error", this.onWindowError.bind(this));
    }

    onScriptLoad() {
        if (++this.loadCount === this.numScripts) {
            Manager.PluginManager.setup($plugins);
        }
    }

    onScriptError(e: any) {
        this.printError("Failed to load", (e.target as HTMLScriptElement)._url);
    }

    printError(name: string, message: string) {
        this.eraseLoadingSpinner();
        if (!document.getElementById("errorPrinter")) {
            const errorPrinter = document.createElement("div");
            errorPrinter.id = "errorPrinter";
            errorPrinter.innerHTML = this.makeErrorHtml(name, message);
            document.body.appendChild(errorPrinter);
        }
    }

    makeErrorHtml(name: string, message: string) {
        const nameDiv = document.createElement("div");
        const messageDiv = document.createElement("div");
        nameDiv.id = "errorName";
        messageDiv.id = "errorMessage";
        nameDiv.innerHTML = name;
        messageDiv.innerHTML = message;
        return nameDiv.outerHTML + messageDiv.outerHTML;
    }

    onWindowLoad() {
        if (!this.xhrSucceeded) {
            const message = "Your browser does not allow to read local files.";
            this.printError("Error", message);
        } else if (this.isPathRandomized()) {
            const message = "Please move the Game.app to a different folder.";
            this.printError("Error", message);
        } else if (this.error) {
            this.printError(this.error.name, this.error.message);
        } else {
            this.initEffekseerRuntime();
        }
    }

    onWindowError(event: any) {
        if (!this.error) {
            this.error = event.error;
        }
    }

    isPathRandomized() {
        // [Note] We cannot save the game properly when Gatekeeper Path
        //   Randomization is in effect.
        return (
            Core.Utils.isNwjs() &&
            process.mainModule?.filename.startsWith("/private/var")
        );
    }

    initEffekseerRuntime() {
        const onLoad = this.onEffekseerLoad.bind(this);
        const onError = this.onEffekseerError.bind(this);
        effekseer.initRuntime(effekseerWasmUrl, onLoad, onError);
    }

    onEffekseerLoad() {
        this.eraseLoadingSpinner();
        SceneManager.run(Scene_Boot);
    }

    onEffekseerError() {
        this.printError("Failed to load", effekseerWasmUrl);
    }
}

const main = new Main();
main.run();

//-----------------------------------------------------------------------------
