interface Window {
    webkitAudioContext:new ()=>AudioContext;
    mozIndexedDB: IDBFactory;
    webkitIndexedDB: IDBFactory;
    $dataActors:Nullable<Actor[]>;
    $dataClasses:Nullable<Class[]>;
    $dataSkills:Nullable<Skill[]>;
    $dataItems:Nullable<Item[]>;
    $dataWeapons:Nullable<Weapon[]>;
    $dataArmors:Nullable<Armor[]>;
    $dataEnemies:Nullable<Enemie[]>;
    $dataTroops:Nullable<Troop[]>;
    $dataStates:Nullable<State[]>;
    $dataAnimations:Nullable<Animate[]>;
    $dataTilesets:Nullable<Tileset[]>;
    $dataCommonEvents:Nullable<CommonEvent[]>;
    $dataSystem:Nullable<System>;
    $dataMapInfos:Nullable<MapInfo[]>;
    $dataMap:Nullable<MAP>;
    $gameTemp:any;
    $gameSystem:any;
    $gameScreen:any;
    $gameTimer:any;
    $gameMessage:any;
    $gameSwitches:any;
    $gameVariables:any;
    $gameSelfSwitches:any;
    $gameActors:any;
    $gameParty:any;
    $gameTroop:any;
    $gameMap:any;
    $gamePlayer:any;
    $testEvent:any;
    [key: string]: any;
}
interface Navigator{
    standalone:boolean;
}
