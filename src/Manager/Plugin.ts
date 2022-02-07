import { Utils } from "../Core/index.js";

//-----------------------------------------------------------------------------
/**
 * PluginManager
 * 
 * The static class that manages the plugins.
*/
export class PluginManager {
    constructor() {
        throw new Error("This is a static class");
    }

    static _scripts = [];
    static _errorUrls = [];
    static _parameters = {};
    static _commands = {};

    static setup(plugins) {
        for (const plugin of plugins) {
            if (plugin.status && !this._scripts.includes(plugin.name)) {
                this.setParameters(plugin.name, plugin.parameters);
                this.loadScript(plugin.name);
                this._scripts.push(plugin.name);
            }
        }
    };

    static parameters(name) {
        return this._parameters[name.toLowerCase()] || {};
    };

    static setParameters(name, parameters) {
        this._parameters[name.toLowerCase()] = parameters;
    };

    static loadScript(filename) {
        const url = this.makeUrl(filename);
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        script.async = false;
        script.defer = true;
        script.onerror = this.onError.bind(this);
        script._url = url;
        document.body.appendChild(script);
    };

    static onError(e) {
        this._errorUrls.push(e.target._url);
    };

    static makeUrl(filename) {
        return "js/plugins/" + Utils.encodeURI(filename) + ".js";
    };

    static checkErrors() {
        const url = this._errorUrls.shift();
        if (url) {
            this.throwLoadError(url);
        }
    };

    static throwLoadError(url) {
        throw new Error("Failed to load: " + url);
    };

    static registerCommand(pluginName, commandName, func) {
        const key = pluginName + ":" + commandName;
        this._commands[key] = func;
    };

    static callCommand(self, pluginName, commandName, args) {
        const key = pluginName + ":" + commandName;
        const func = this._commands[key];
        if (typeof func === "function") {
            func.bind(self)(args);
        }
    };
}