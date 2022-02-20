/// <reference types="./JsExtensions" />
/// <reference types="./Global/index" />
/// <reference types="./PIXI" />
/// <reference types="./VorbisDecoder" />
/// <reference types="./nw" />

// import Pako from "pako";


declare type Nullable<T = any> = T | null;
declare type AnyObject<T = any> = { [key: string]: T };
/**
 * 0-255
*/
declare type FF = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48 | 49 | 50 | 51 | 52 | 53 | 54 | 55 | 56 | 57 | 58 | 59 | 60 | 61 | 62 | 63 | 64 | 65 | 66 | 67 | 68 | 69 | 70 | 71 | 72 | 73 | 74 | 75 | 76 | 77 | 78 | 79 | 80 | 81 | 82 | 83 | 84 | 85 | 86 | 87 | 88 | 89 | 90 | 91 | 92 | 93 | 94 | 95 | 96 | 97 | 98 | 99 | 100 | 101 | 102 | 103 | 104 | 105 | 106 | 107 | 108 | 109 | 110 | 111 | 112 | 113 | 114 | 115 | 116 | 117 | 118 | 119 | 120 | 121 | 122 | 123 | 124 | 125 | 126 | 127 | 128 | 129 | 130 | 131 | 132 | 133 | 134 | 135 | 136 | 137 | 138 | 139 | 140 | 141 | 142 | 143 | 144 | 145 | 146 | 147 | 148 | 149 | 150 | 151 | 152 | 153 | 154 | 155 | 156 | 157 | 158 | 159 | 160 | 161 | 162 | 163 | 164 | 165 | 166 | 167 | 168 | 169 | 170 | 171 | 172 | 173 | 174 | 175 | 176 | 177 | 178 | 179 | 180 | 181 | 182 | 183 | 184 | 185 | 186 | 187 | 188 | 189 | 190 | 191 | 192 | 193 | 194 | 195 | 196 | 197 | 198 | 199 | 200 | 201 | 202 | 203 | 204 | 205 | 206 | 207 | 208 | 209 | 210 | 211 | 212 | 213 | 214 | 215 | 216 | 217 | 218 | 219 | 220 | 221 | 222 | 223 | 224 | 225 | 226 | 227 | 228 | 229 | 230 | 231 | 232 | 233 | 234 | 235 | 236 | 237 | 238 | 239 | 240 | 241 | 242 | 243 | 244 | 245 | 246 | 247 | 248 | 249 | 250 | 251 | 252 | 253 | 254 | 255;
/**
 * 颜色
*/
declare type RGB = {
    /**
     * 红值
    */
    R: FF;
    /**
     * 绿值
    */
    G: FF;
    /**
     * 蓝值
    */
    B: FF;
    /**
     * 灰度
    */
    GRAY: FF;
}
declare const effekseer: any;
declare const pako = await import("pako");
declare const localforage = await import('localforage');
declare type NullablePick<T, K extends keyof T> = {
    [P in K]?: T[P];
};

declare var $dataActors: Nullable<Actor[]>;
declare var $dataClasses: Nullable<Class[]>;
declare var $dataSkills: Nullable<Skill[]>;
declare var $dataItems: Nullable<Item[]>;
declare var $dataWeapons: Nullable<Weapon[]>;
declare var $dataArmors: Nullable<Armor[]>;
declare var $dataEnemies: Nullable<Enemie[]>;
declare var $dataTroops: Nullable<Troop[]>;
declare var $dataStates: Nullable<State[]>;
declare var $dataAnimations: Nullable<Animate[]>;
declare var $dataTilesets: Nullable<Tileset[]>;
declare var $dataCommonEvents: Nullable<CommonEvent[]>;
declare var $dataSystem: Nullable<System>;
declare var $dataMapInfos: Nullable<MapInfo[]>;
declare var $dataMap: Nullable<MAP>;
declare var $gameTemp:Nullable<import("../src/Game/index").Game_Temp>;
declare var $gameSystem: Nullable<import("../src/Game/index").Game_System>;
declare var $gameScreen: Nullable<import("../src/Game/index").Game_Screen>;
declare var $gameTimer: Nullable<import("../src/Game/index").Game_Timer>;
declare var $gameMessage: Nullable<import("../src/Game/index").Game_Message>;
declare var $gameSwitches: Nullable<import("../src/Game/index").Game_Switches>;
declare var $gameVariables: Nullable<import("../src/Game/index").Game_Variables>;
declare var $gameSelfSwitches: Nullable<import("../src/Game/index").Game_SelfSwitches>;
declare var $gameActors: Nullable<import("../src/Game/index").Game_Actors>;
declare var $gameParty: Nullable<import("../src/Game/index").Game_Party>;
declare var $gameTroop: Nullable<import("../src/Game/index").Game_Troop>;
declare var $gameMap: Nullable<import("../src/Game/index").Game_Map>;
declare var $gamePlayer: Nullable<import("../src/Game/index").Game_Player>;
declare var $testEvent: Nullable<import("../src/Game/index").Game_Event>;