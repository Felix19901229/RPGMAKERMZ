/**
 * 能力值
*/
declare type UserStatus = {
    /**
     * 当前生命值
    */
    hp: string;
    /**
     * 当前魔法值
    */
    mp: number;
    /**
     * TP点
    */
    tp: number;
    /**
     * 最大生命值
    */
    mhp: number;
    /**
     * 最大魔法值
    */
    mmp: number;
    /**
     * 攻击力
    */
    atk: number;
    /**
     * 防御力
    */
    def: number;
    /**
     * 魔法攻击力
    */
    mat: number;
    /**
     * 魔法防御力
    */
    mdf: number;
    /**
     * 敏捷
    */
    agi: number;
    /**
     * 幸运值
    */
    luk: number;
    /**
     * 连击
    */
    hit: number;
    /**
     * 回避率
    */
    eva: number;
    /**
     * 暴击率
    */
    cri: number;
    /**
     * 暴击回避率率
    */
    cev: number;
    /**
     * 魔法回避率
    */
    mev: number;
    /**
     * 魔法反射率
    */
    mrf: number;
    /**
     * 反击率
    */
    cnt: number;
    /**
     * 生命再生速度
    */
    hrg: number;
    /**
     * 魔法再生速度
    */
    mrg: number;
    /**
     * tp再生速度
    */
    trg: number;
    /**
     * 嘲讽度
    */
    tgr: number;
    /**
     * 守护发动率
    */
    grd: number;
    /**
     * 恢复力
    */
    rec: number;
    /**
     * 药剂成功率
    */
    pha: number;
    /**
     * 魔法消耗率
    */
    mcr: number;
    /**
     * TP充能率
    */
    tcr: number;
    /**
     * 物理伤害率
    */
    pdr: number;
    /**
     * 魔法伤害率
    */
    mdr: number;
    /**
     * 地图陷阱伤害率
    */
    fdr: number;
    /**
     * 经验获取率
    */
    exr: number;
}
/**
 * 特性
*/
declare type Trait = {
    /**
     * 特性类型id
    */
    code: number;
    /**
     * 特性id
    */
    dataId: number;
    /**
     * 特性增加数值
    */
    value: number;
}
/**
 * 目标闪烁
*/
declare type FlashTiming = {
    /**
     * 帧数排序
    */
    frame: number;
    /**
     * 持续时间 帧数
    */
    duration: number;
    /**
     * 闪烁颜色
    */
    color: [RGB['R'], RGB['G'], RGB['B'], RGB['GRAY']]
}
/**
 * 动画音效
*/
declare type SoundTiming = {
    /**
     * 帧数排序
    */
    frame: number;
    /**
     * 音效
    */
    se: {
        /**
         * 音效名称
        */
        name: string;
        /**
         * 声像
        */
        pan?: number;
        /**
         * 音调
        */
        pitch: number;
        /**
         * 音量
        */
        volume: number;
        /**
         * 播放位置
        */
        pos?: number;
    }

}
/**
 * 等级学习技能
*/
declare type Learning = {
    /**
     * 等级
    */
    level: number;
    /**
     * 备注
    */
    note: string;
    /**
     * 技能id
    */
    skillId: number;
};
/**
 * 事件内容
*/
declare type _Event = {
    /**
     * 执行内容
    */
    code: number;
    /**
     * 事件进度
    */
    indent: number;
    /**
     * 执行参数
    */
    parameters: Nullable<string | number>[];
}
/**
 * 地图事件具体内容
*/
declare type MapEventPage = {
    /**
     * 出现条件
    */
    conditions: {
        /**
         * 角色ID
        */
        actorId: number;
        /**
         * 角色条件是否启用
        */
        actorValid: boolean;
        /**
         * 道具id
        */
        itemId: number;
        /**
         * 道具条件是否启用
        */
        itemValid: boolean;
        /**
         * 独立开关名称
        */
        selfSwitchCh: string;
        /**
         * 独立开关是否启用
        */
        selfSwitchValid: boolean;
        /**
         * 开关1绑定开关ID
        */
        switch1Id: number;
        /**
         * 开关1是否启用
        */
        switch1Valid: boolean;
        /**
         * 开关2绑定开关ID
        */
        switch2Id: 1;
        /**
         * 开关2是否启用
        */
        switch2Valid: boolean;
        /**
         * 绑定变量ID
        */
        variableId: number;
        /**
         * 是否启用变量
        */
        variableValid: boolean;
        /**
         * 变量值
        */
        variableValue: number
    },
    /**
     * 图片
    */
    image: {
        /**
         * 图像组名称
        */
        characterName: string;
        /**
         * 标题ID
        */
        tileId: number;
        /**
         * 朝向
         * 2 向下 4 向左 8 向上 6 向右
        */
        direction: 2 | 4 | 6 | 8;
        /**
         * 行走图第几排
        */
        pattern: number;
        /**
         * 头像编号
        */
        characterIndex: number;
    },
    /**
     * 执行内容
    */
    list: _Event[];
    /**
     * 移动路线
    */
    moveRoute: {
        /**
         * 条件列表
        */
        list: _Event[];
        /**
         * 循环执行
        */
        repeat: boolean;
        /**
         * 无法执行的时候跳过指令
        */
        skippable: boolean;
        /**
         * 等待完成
        */
        wait: boolean;
    },
    /**
     * 移动类型
     * 0 固定 1 随机 2 接近 3 自定义
    */
    moveType: 0 | 1 | 2 | 3;
    /**
     * 移动频率
     * 1 最低 2 低 3 标准 4 高 5 最高
    */
    moveFrequency: 1 | 2 | 3 | 4 | 5;
    /**
     * 移动速度
     * 1 1/8倍速 2 1/4倍速 3 1/2倍速 4 标准速度 5 2倍速 6 4倍速
    */
    moveSpeed: 1 | 2 | 3 | 4 | 5 | 6;
    /**
     * 优先度
     * 0 在人物下方 1 与人物相同 2 在人物上方
    */
    priorityType: 0 | 1 | 2;
    /**
     * 踏步动画
    */
    stepAnime: boolean;
    /**
     * 穿透
    */
    through: true;
    /**
     * 固定方向
     */
    directionFix: boolean;
    /**
     * 触发条件
     * 0 确认键 1 玩家触发 2 事件触发 3 自动执行 4 并行处理
    */
    trigger: 0 | 1 | 2 | 3 | 4;
    /**
     * 步行动画
    */
    walkAnime: boolean;
}
/**
 * 地图事件内容
*/
declare type MapEvent = {
    /**
     * 事件ID
    */
    id: number;
    /**
     * 事件名称
    */
    name: string;
    /**
     * 备注
    */
    note: string;
    /**
     * 地图X坐标
    */
    x: number;
    /**
     * 地图Y坐标
    */
    y: number;
    pages: MapEventPage[];
}
/**
 * 行动条件
*/
declare type Action = {
    /**
     * 使用几率
    */
    rating: number;
    /**
     * 技能ID
    */
    skillId: number;
    /**
     * 使用条件类型
     * 0 总是 1 回合 2 HP 3 MP 4 状态 5 等级 6 开关
    */
    conditionType: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    /**
     * 条件一
    */
    conditionParam1: number;
    /**
     * 条件二
    */
    conditionParam2: number;
}
/**
 * 掉落物品
*/
declare type DropItem = {
    /**
     * 物品id
    */
    dataId: number;
    /**
     * 掉落率
    */
    denominator: number;
    /**
     * 物品种类
    */
    kind: number;
}
/**
 * 伤害
*/
declare type Damage = {
    /**
     * 能否暴击
    */
    critical: boolean;
    /**
     * 属性ID
    */
    elementId: number;
    /**
     * 伤害计算攻击
    */
    formula: string;
    /**
     * 伤害类型
    */
    type: number;
    /**
     * 分散度
    */
    variance: number;
}
/**
 * 影响
*/
declare type Effect = {
    /**
     * 影响类型
    */
    code: number;
    /**
     * 影响类别
    */
    dataId: number;
    /**
     * 参数一
    */
    value1: number;
    /**
     * 参数二
    */
    value2: number;
}
/**
 * 敌群
*/
declare type Encounter = {
    /**
     * 敌群ID
    */
    troopId: string;
    /**
     * 权重
    */
    weight: string;
    /**
     * 区域设置
     * [] 全部 [x,Y,Width]
    */
    regionSet: [] | [number, number, number]
}
/**
 * 战斗者
*/
declare type Battler = {
    /**
     * 角色ID
    */
    actorId: number;
    /**
     * 等级
    */
    level: number;
    /**
     * 装备
    */
    equips: number[];
}
/**
 * 攻击动作
*/
declare type AttackMotion = {
    /**
     * 动作类型
    */
    type: number;
    /**
     * 武器图像ID
    */
    weaponImageId: number;
}
/**
 * 敌群成员
*/
declare type Member = {
    /**
     * 敌人ID
    */
    enemyId: number;
    /**
     * 敌人位置 X坐标
     */
    x: number;
    /**
     * 敌人位置 Y坐标
     */
    y: number;
    /**
     * 是否隐藏
    */
    hidden: boolean;
}
/**
 * 敌群逻辑具体内容
*/
declare type TroopPage = {
    /**
     * 条件
    */
    conditions: {
        /**
         * 触发角色HP百分比
        */
        actorHp: number;
        /**
         * 触发角色id
        */
        actorId: number;
        /**
         * 是否设置触发角色
        */
        actorValid: boolean;
        /**
         * 触发敌人HP百分比
        */
        enemyHp: number;
        /**
         * 触发敌人ID
        */
        enemyIndex: number;
        /**
         * 是否设置触发敌人
        */
        enemyValid: boolean;
        /**
         * 绑定开关ID
        */
        switchId: number;
        /**
         * 是否设置开关
        */
        switchValid: boolean;
        /**
         * 起始回合
        */
        turnA: number;
        /**
         * 间隔回合
        */
        turnB: number;
        /**
         * 是否开启回合结束
        */
        turnEnding: boolean;
        /**
         * 是否启用回合条件
        */
        turnValid: boolean;
    }
    /**
     * 条件列表
    */
    list: _Event[];
    /**
     * 间隔
     * 0 战斗 1 回合 2 即时
    */
    span: 0 | 1 | 2;
}
/**
 * 角色
*/
declare type Actor = {
    /**
     * 角色名称
    */
    id: number;
    /**
     * 侧向战斗行走图名称
    */
    battlerName: string;
    /**
     * 角色行走编号
    */
    characterIndex: number;
    /**
     * 角色行走组图名称
    */
    characterName: string;
    /**
     * 职业ID
    */
    classId: number;
    /**
     * 身上装备id组
    */
    equips: number[];
    /**
     * 角色头像编号
    */
    faceIndex: number;
    /**
     * 角色头像组图名称
    */
    faceName: string;
    /**
     * 特性栏
    */
    traits: Trait[];
    /**
     * 初始等级
    */
    initialLevel: number;
    /**
     * 最大等级
    */
    maxLevel: number;
    /**
     * 角色名称
    */
    name: string;
    /**
     * 角色昵称
    */
    nickname: string;
    /**
     * 角色备注
    */
    note: string;
    /**
     * 角色简介
    */
    profile: string;
};
/**
 * 动画
*/
declare type Animate = {
    /**
     * 动画id
    */
    id: number;
    /**
     * 动画显示类型 0 每一个目标 1 所有目标中心 2 画面中心
    */
    displayType: 0 | 1 | 2;
    /**
     * 动画文件名称
    */
    effectName: string;
    /**
     * 击中目标，目标闪烁动画
    */
    flashTimings: FlashTiming[];
    /**
     * 动画名称
    */
    name: string;
    /**
     * 动画偏移坐标X
    */
    offsetX: number;
    /**
     * 动画偏移坐标Y
    */
    offsetY: number;
    /**
     * 旋转
    */
    rotation: {
        /**
         * x轴
        */
        x: number;
        /**
         * y轴
        */
        y: number;
        /**
         * z轴
        */
        z: number;
    };
    /**
     * 缩放率百分比
    */
    scale: number;
    /**
     * 声效
    */
    soundTimings: SoundTiming[];
    /**
     * 播放速度
    */
    speed: number;
}
/**
 * 防具
*/
declare type Armor = {
    /**
     * 装备ID
    */
    id: number;
    /**
     * 防具类型ID
    */
    atypeId: number;
    /**
     * 防具说明
    */
    description: number;
    /**
     * 装备类型
    */
    etypeId: number;
    /**
     * 特性
    */
    traits: Trait[];
    /**
     * 图标编号
    */
    iconIndex: number;
    /**
     * 防具名称
    */
    name: string;
    /**
     * 防具备注
    */
    note: string;
    /**
     * 能力变化参数
     * [攻击力, 防御力, 魔攻, 魔防, 敏捷, 幸运, 最大HP, 最大MP]
    */
    params: [UserStatus['atk'], UserStatus['def'], UserStatus['mat'], UserStatus['mdf'], UserStatus['agi'], UserStatus['luk'], UserStatus['mhp'], UserStatus['mmp']];
    /**
     * 价格
    */
    price: number;
}
/**
 * 职业
*/
declare type Class = {
    /**
     * 职业id
    */
    id: number;
    /**
     * 经验成长曲线
     * [基础值 ,补正值 ,增长度A ,增长度B]
    */
    expParams: [number, number, number, number];
    /**
     * 特性
    */
    traits: Trait[];
    /**
     * 等级学习技能表
    */
    learnings: Learning[];
    /**
     * 职业名称
    */
    name: string;
    /**
     * 备注
    */
    note: string;
    /**
     * 等级能力补正表
     * [最大HP[] ,最大MP[] ,攻击力[] ,防御力[] ,魔攻[] ,魔防[] ,敏捷[] ,幸运[]]
    */
    params: number[][]
}
/**
 * 通用事件
*/
declare type CommonEvent = {
    /**
     * 时间ID
    */
    id: number;
    /**
     * 时间名称
    */
    name: string;
    /**
     * 选定开关id
    */
    switchId: number;
    /**
     * 触发模式 0 无 1 自动执行 2 并行处理
    */
    trigger: 0 | 1 | 2;
    /**
     * 执行内容
    */
    list: _Event[]
}
/**
 * 敌人
*/
declare type Enemie = {
    /**
     * 敌人编号
     */
    id: number;
    /**
     * 掉落金币
    */
    gold: number;
    /**
     * 敌人名称
    */
    name: string;
    /**
     * 备注
    */
    note: string;
    /**
     * 图像色相
    */
    battlerHue: number;
    /**
     * 图像名称
    */
    battlerName: string;
    /**
     * 获得经验
    */
    exp: number;
    /**
     * 行动列表
    */
    actions: Action[];
    /**
     * 掉落列表
    */
    dropItems: DropItem[];
    /**
     * 特性列表
    */
    traits: Trait[];
    /**
     * 能力值列表
     * [最大HP, 最大MP, 攻击力, 防御力, 魔攻, 魔防, 敏捷 , 幸运]
    */
    params: [number, number, number, number, number, number, number, number]
}
/**
 * 道具
*/
declare type Item = {
    /**
     * 道具ID
    */
    id: number;
    /**
     * 动画ID
    */
    animationId: number;
    /**
     * 是否是消耗品
    */
    consumable: true,
    /**
     * 伤害
    */
    damage: Damage;
    /**
     * 说明
    */
    description: string;
    /**
     * 影响
    */
    effects: Effect[];
    /**
     * 命中类型 
     * 0 必定命中 1 物理命中 2 魔法命中
    */
    hitType: 0 | 1 | 2;
    /**
     * 图标id
    */
    iconIndex: number;
    /**
     * 物品类型
     * 0 普通物品 1 重要物品 2 隐藏物品A 3 隐藏物品B
    */
    itypeId: 0 | 1 | 2 | 3;
    /**
     * 道具名称
    */
    name: string;
    /**
     * 备注
    */
    note: string;
    /**
     * 使用场合
     * 0 随时可用 1 战斗画面 2 菜单画面 3 不能使用
    */
    occasion: 0 | 1 | 2 | 3;
    /**
     * 价格
    */
    price: number;
    /**
     * 连续使用
    */
    repeats: number;
    /**
     * 作用范围
     * 0 无 1 敌方单体 2 敌方全体 3 随机敌方1人 4 随机敌方2人 5 随机敌方3人 6 随机敌方4人 7 我方单体(存活) 8 我方全体(存活) 9 我方单体(死亡) 10 我方全体(死亡) 11 使用者 12 我方单体(无条件) 13 我方全体(无条件) 14 敌我双方全体
    */
    scope: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14;
    /**
     * 速度补正
    */
    speed: number;
    /**
     * 成功率
    */
    successRate: number;
    /**
     * 获取TP值
    */
    tpGain: number;
}
/**
 * 地图
*/
declare type MAP = {
    /**
     * 自动切花BGM
    */
    autoplayBgm: boolean;
    /**
     * 自动切换效果音
    */
    autoplayBgs: boolean;
    /**
     * 战场背景分组
    */
    battleback1Name: string;
    /**
     * 战场背景名称
    */
    battleback2Name: string;
    /**
     * 背景音乐
    */
    bgm: SoundTiming['se'];
    /**
     * 背景音效
    */
    bgs: SoundTiming['se'];
    /**
     * 禁止跑步
    */
    disableDashing: boolean;
    /**
     * 显示名称
    */
    displayName: string;
    /**
     * 敌群列表
    */
    encounterList: Encounter[];
    /**
     * 遇敌步数
    */
    encounterStep: number;
    /**
     * 地图宽度
    */
    width: number;
    /**
     * 地图高度
    */
    height: number;
    /**
     * 备注
    */
    note: string;
    /**
     * 远景图像
    */
    parallaxName: string;
    /**
     * 远景图像是否纵向循环
    */
    parallaxLoopX: boolean;
    /**
     * 远景图像纵向循环速度
    */
    parallaxSx: number;
    /**
     * 远景图像是否横向循环
    */
    parallaxLoopY: boolean;
    /**
     * 远景图像横向循环速度
    */
    parallaxSy: number;
    /**
     * 远景图像在编辑器里面显示
    */
    parallaxShow: boolean;
    /**
     * 地图循环类型
     * 0 无循环 1 纵向循环 2 横向循环 3 横纵向循环
    */
    scrollType: 0 | 1 | 2 | 3;
    /**
     * 指定战斗背景
    */
    specifyBattleback: boolean;
    /**
     * 图块id
    */
    tilesetId: number;
    /**
     * 地图数据块
    */
    data: number[];
    /**
     * 时间列表
    */
    events: Array<null | MapEvent>;
}
/**
 * 地图信息
*/
declare type MapInfo = {
    /**
     * 地图ID
    */
    id: number;
    /**
     * 是不是扩展地图
    */
    expanded: boolean;
    /**
     * 地图名称
    */
    name: string;
    /**
     * 地图排序
    */
    order: number;
    /**
     * 父级地图ID
    */
    parentId: number;
    /**
     * 地图滚动X像素
    */
    scrollX: number;
    /**
     * 地图滚动Y像素
    */
    scrollY: number;
}
/**
 * 技能
*/
declare type Skill = {
    /**
     * 时间ID
    */
    id: number;
    /**
     * 动画ID
    */
    animationId: number;
    /**
     * 伤害
    */
    damage: Damage;
    /**
     * 说明
    */
    description: string;
    /**
     * 影响
    */
    effects: Effect[],
    /**
     * 命中类型 
     * 0 必定命中 1 物理命中 2 魔法命中
    */
    hitType: 0 | 1 | 2;
    /**
     * 图标ID
    */
    iconIndex: number;
    /**
     * 显示消息1
    */
    message1: string;
    /**
     * 显示消息2
    */
    message2: string;
    /**
     * mp消费
    */
    mpCost: number;
    /**
     * 技能名称
    */
    name: string;
    /**
     * 备注
    */
    note: string;
    /**
     * 使用场合
     * 0 随时可用 1 战斗画面 2 菜单画面 3 不能使用
    */
    occasion: 0 | 1 | 2 | 3;
    /**
     * 连击数
     */
    repeats: number;
    /**
     * 必须武器ID 0 不限制
    */
    requiredWtypeId1: number;
    /**
     * 必须武器2ID 0 不限制
    */
    requiredWtypeId2: number;
    /**
     * 作用范围
     * 0 无 1 敌方单体 2 敌方全体 3 随机敌方1人 4 随机敌方2人 5 随机敌方3人 6 随机敌方4人 7 我方单体(存活) 8 我方全体(存活) 9 我方单体(死亡) 10 我方全体(死亡) 11 使用者 12 我方单体(无条件) 13 我方全体(无条件) 14 敌我双方全体
    */
    scope: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14;
    /**
     * 速度补正
    */
    speed: number;
    /**
     * 技能类型
    */
    stypeId: number;
    /**
     * 成功几率
    */
    successRate: number;
    /**
     * TP消费
    */
    tpCost: number;
    /**
     * 获得TP
    */
    tpGain: number;
    /**
     * 消息类型
    */
    messageType: number;
}
/**
 * 状态
*/
declare type State = {
    /**
     * 状态ID
    */
    id: number;
    /**
     * 自动解除时机
     * 0 无 1 行动回合 2 回合结束
    */
    autoRemovalTiming: 0 | 1 | 2;
    /**
     * 收到伤害解除几率
    */
    chanceByDamage: number;
    /**
     * 图标ID
    */
    iconIndex: number;
    /**
     * 最大持续回合
    */
    maxTurns: number;
    /**
     * 状态附加时候消息
    */
    message1: string;
    /**
     * 敌人被附加时候消息
    */
    message2: string;
    /**
     * 状态持续时消息
    */
    message3: string;
    /**
     * 状态解除时消息
    */
    message4: string;
    /**
     * 最小持续回合
    */
    minTurns: number;
    /**
     * 动作
     * 0 正常 1 状态异常 2 睡眠 3 死亡
    */
    motion: 0 | 1 | 2 | 3;
    /**
     * 状态名称
    */
    name: string;
    /**
     * 备注
     */
    note: string;
    /**
     * 遮罩
     * 0 无 1 中毒 2 黑暗 3 沉默  4 激昂 5 混乱 6 魅惑 7 睡眠 8 麻痹 9 诅咒 10 恐惧
    */
    overlay: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
    /**
     * 优先度
    */
    priority: number;
    /**
     * 释放伤害
    */
    releaseByDamage: boolean;
    /**
     * 战斗后解除
    */
    removeAtBattleEnd: boolean;
    /**
     * 受到伤害后解除
    */
    removeByDamage: boolean;
    /**
     * 受到行动限制后解除
    */
    removeByRestriction: boolean;
    /**
     * 移动后解除
    */
    removeByWalking: boolean;
    /**
     * 行动限制
     * 0 无 1 攻击敌人 2 攻击一人 3 攻击队友 4 无法行动
    */
    restriction: 0 | 1 | 2 | 3 | 4;
    /**
     * 移动多少步后解除
    */
    stepsToRemove: number;
    /**
     * 特性
    */
    traits: Trait[];
    /**
     * 消息模式
    */
    messageType: number;
}
/**
 * 系统
*/
declare type System = {
    /**
     * 高级设置
    */
    advanced: {
        /**
         * 进阶设置ID
        */
        gameId: number;
        /**
         * 画面宽度
        */
        screenWidth: number;
        /**
         * 画面高度
        */
        screenHeight: number;
        /**
         * UI区域宽度
        */
        uiAreaWidth: number;
        /**
         * UI区域高度
        */
        uiAreaHeight: number;
        /**
         * 数字字体文件 以font文件为root
        */
        numberFontFilename: string;
        /**
         * 后备字体
        */
        fallbackFonts: string;
        /**
         * 字体大小
        */
        fontSize: number;
        /**
         * 主题文字文件 以font文件为root
        */
        mainFontFilename: string;
    },
    /**
     * 小船
    */
    boat: {
        /**
          * 背景音乐
         */
        bgm: SoundTiming;
        /**
         * 图像编号
        */
        characterIndex: number;
        /**
         * 图像组名称
        */
        characterName: string;
        /**
         * 获取地图编号
        */
        startMapId: number;
        /**
         * 地图X坐标
        */
        startX: number;
        /**
         * 地图坐标
        */
        startY: number;
    },
    /**
     * 大船
    */
    ship: {
        /**
          * 背景音乐
         */
        bgm: SoundTiming;
        /**
         * 图像编号
        */
        characterIndex: number;
        /**
         * 图像组名称
        */
        characterName: string;
        /**
         * 获取地图编号
        */
        startMapId: number;
        /**
         * 地图X坐标
        */
        startX: number;
        /**
         * 地图坐标
        */
        startY: number;
    },
    /**
     * 飞空艇设置
    */
    airship: {
        /**
         * 背景音乐
        */
        bgm: SoundTiming;
        /**
         * 图像编号
        */
        characterIndex: number;
        /**
         * 图像组名称
        */
        characterName: string;
        /**
         * 获取地图编号
        */
        startMapId: number;
        /**
         * 地图X坐标
        */
        startX: number;
        /**
         * 地图坐标
        */
        startY: number;
    },
    /**
     * 装备类型
    */
    armorTypes: string[];
    /**
     * 攻击动作
    */
    attackMotions: AttackMotion[];
    /**
     * 战斗音乐
    */
    battleBgm: SoundTiming;
    /**
     * 战斗背景组名称
    */
    battleback1Name: string;
    /**
     * 战斗背景名称
    */
    battleback2Name: string;
    /**
     * 战斗背景色相
    */
    battlerHue: 0,
    /**
     * 战斗者名称
    */
    battlerName: string;
    /**
     * 战斗系统类型
     * 0 回合制 1 时间制(即时) 2 时间制(等待)
    */
    battleSystem: 0 | 1 | 2;
    /**
     * 货币单位
    */
    currencyUnit: string;
    /**
     * 战败音效
    */
    defeatMe: SoundTiming;
    /**
     * 修改地图id
    */
    editMapId: number;
    /**
     * 属性类型
    */
    elements: string[];
    /**
     * 装备类型
    */
    equipTypes: string[];
    /**
     * 游戏标题
    */
    gameTitle: string;
    /**
     * 游戏结束音效
    */
    gameoverMe: SoundTiming;
    /**
     * 物品分类
     * [物品,武器,防具,重要物品]
    */
    itemCategories: [boolean, boolean, boolean, boolean];
    /**
     * 语言
    */
    locale: string;
    /**
     * 魔法技能类型
    */
    magicSkills: number[];
    /**
     * 菜单指令
     * [物品,技能,装备,状态,整队,保存]
    */
    menuCommands: [boolean, boolean, boolean, boolean, boolean, boolean];
    /**
     * 启用自动保存
    */
    optAutosave: boolean;
    /**
     * 在窗口显示TP
    */
    optDisplayTp: boolean;
    /**
     * 绘制游戏标题
    */
    optDrawTitle: boolean;
    /**
     * 替补队员可获得经验
    */
    optExtraExp: boolean;
    /**
     * 地形伤害可以导致死亡
    */
    optFloorDeath: boolean;
    /**
     * 队列行进
    */
    optFollowers: boolean;
    /**
     * 显示关键物品数量
    */
    optKeyItemsNumber: boolean;
    /**
     * 战斗画面 false 正面 true 侧面
    */
    optSideView: boolean;
    /**
     * 慢性伤害可以导致死亡
    */
    optSlipDeath: boolean;
    /**
     * 透明状态下开始游戏
    */
    optTransparent: boolean;
    /**
     * 初始角色ID
     */
    partyMembers: number[];
    /**
     * 技能类型
    */
    skillTypes: string[];
    /**
     * 音乐列表
    */
    sounds: SoundTiming[];
    /**
     * 起始地图ID
    */
    startMapId: number;
    /**
     * 起始地图X坐标
    */
    startX: number;
    /**
     * 起始地图Y坐标
    */
    startY: number;
    /**
     * 开关列表
    */
    switches: string[];
    /**
     * 游戏用语
    */
    terms: {
        /**
         * 基本用语
         * [等级, 等级缩写, HP, HP缩写, MP, MP缩写, TP, TP缩写, 经验值, 经验值缩写]
        */
        basic: [string, string, string, string, string, string, string, string, string, string];
        /**
         * 指令用语
         * [战斗, 逃跑, 攻击, 防御, 物品, 技能, 装备, 状态, 整队, 保存, 游戏结束, 选项, 武器, 防具, 重要物品, 装备, 最强装备, 清空, 重新开始, 继续游戏, null, 回到标题, 取消, null, 购买, 出售]
        */
        commands: [string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string];
        /**
         * 能力值用语
         * [最大 HP ,最大 MP ,攻击力 ,防御力 ,魔法攻击 ,魔法防御 ,敏捷 ,幸运 ,命中率 ,回避]
        */
        params: [string, string, string, string, string, string, string, string, string, string];
        /**
         * 消息用语
        */
        messages: {
            /**
             * 默认值:始终跑步
            */
            alwaysDash: string;
            /**
             * 默认值:记住指令
            */
            commandRemember: string;
            /**
             * 默认值:触屏UI
            */
            touchUI: string;
            /**
             * 默认值:BGM 音量
            */
            bgmVolume: string;
            /**
             * 默认值:BGS 音量
            */
            bgsVolume: string;
            /**
             * 默认值:ME 音量
            */
            meVolume: string;
            /**
             * 默认值:SE 音量
            */
            seVolume: string;
            /**
             * 默认值:持有数
            */
            possession: string;
            /**
             * 默认值:现在的%1
            */
            expTotal: string;
            /**
             * 默认值:距离下一%1
            */
            expNext: string;
            /**
             * 默认值:保存到哪个文件？
            */
            saveMessage: string;
            /**
             * 默认值:读取哪个文件？
            */
            loadMessage: string;
            /**
             * 默认值:文件
            */
            file: string;
            /**
             * 默认值:自动保存
            */
            autosave: string;
            /**
             * 默认值:%1的队伍
            */
            partyName: string;
            /**
             * 默认值:%1出现了！
            */
            emerge: string;
            /**
             * 默认值:%1先发制人！
            */
            preemptive: string;
            /**
             * 默认值:%1被偷袭了！
            */
            surprise: string;
            /**
             * 默认值:%1开始逃跑了！
            */
            escapeStart: string;
            /**
             * 默认值:但是没有逃跑成功！
            */
            escapeFailure: string;
            /**
             * 默认值:%1胜利了！
            */
            victory: string;
            /**
             * 默认值:%1被击败了。
            */
            defeat: string;
            /**
             * 默认值:获得了 %1 点%2！
            */
            obtainExp: string;
            /**
             * 默认值:获得了 %1\\G！
            */
            obtainGold: string;
            /**
             * 默认值:获得了%1！
            */
            obtainItem: string;
            /**
             * 默认值:%1升到了 %2 %3！
            */
            levelUp: string;
            /**
             * 默认值:学会了%1！
            */
            obtainSkill: string;
            /**
             * 默认值:%1使用了%2！
            */
            useItem: string;
            /**
             * 默认值:会心一击！
            */
            criticalToEnemy: string;
            /**
             * 默认值:沉痛一击！
            */
            criticalToActor: string;
            /**
             * 默认值:%1受到了 %2 点伤害！
            */
            actorDamage: string;
            /**
             * 默认值:%1恢复了 %3 点 %2！
            */
            actorRecovery: string;
            /**
             * 默认值:%1的 %2 增加了 %3 点！
            */
            actorGain: string;
            /**
             * 默认值:%1的 %2 减少了 %3 点！
            */
            actorLoss: string;
            /**
             * 默认值:%1被吸收了 %3 点 %2！
            */
            actorDrain: string;
            /**
             * 默认值:%1没有受到伤害！
            */
            actorNoDamage: string;
            /**
             * 默认值:Miss！ %1没有受到伤害！
            */
            actorNoHit: string;
            /**
             * 默认值:%1受到了 %2 点伤害！
            */
            enemyDamage: string;
            /**
             * 默认值:%1恢复了 %3 点 %2！
            */
            enemyRecovery: string;
            /**
             * 默认值:%1的 %2 增加了 %3 点！
            */
            enemyGain: string;
            /**
             * 默认值:%1的 %2 减少了 %3 点！
            */
            enemyLoss: string;
            /**
             * 默认值:%1被吸收了 %3 点 %2！
            */
            enemyDrain: string;
            /**
             * 默认值:没有对%1造成伤害！
            */
            enemyNoDamage: string;
            /**
             * 默认值:Miss！没有对%1造成伤害！
            */
            enemyNoHit: string;
            /**
             * 默认值:%1躲开了攻击！
            */
            evasion: string;
            /**
             * 默认值:%1抵消了魔法！
            */
            magicEvasion: string;
            /**
             * 默认值:%1反射了魔法！
            */
            magicReflection: string;
            /**
             * 默认值:%1的反击！
            */
            counterAttack: string;
            /**
             * 默认值:%1保护了%2！
            */
            substitute: string;
            /**
             * 默认值:%1的%2上升了！
            */
            buffAdd: string;
            /**
             * 默认值:%1的%2下降了！
            */
            debuffAdd: string;
            /**
             * 默认值:%1的%2恢复正常了！
            */
            buffRemove: string;
            /**
             * 默认值:对%1没有效果
            */
            actionFailure: string;
        }
    },
    /**
     * 测试战斗者
    */
    testBattlers: Battler[];
    /**
     * 测试敌群
    */
    testTroopId: number;
    /**
     * 标题画面名称
    */
    title1Name: string;
    /**
     * 标题画面名称2
    */
    title2Name: string;
    /**
     * 标题音乐
    */
    titleBgm: SoundTiming;
    /**
     * 命令窗口设置
    */
    titleCommandWindow: {
        /**
         * 窗口背景
         * 0 窗口 1 暗淡 2 透明
        */
        background: 0 | 1 | 2;
        /**
         * 窗口纵向偏移
        */
        offsetX: number;
        /**
         * 窗口横向偏移
        */
        offsetY: number;
    },
    /**
     * 变量列表
    */
    variables: string[];
    /**
     * 版本id
    */
    versionId: number;
    /**
     * 胜利音效
    */
    victoryMe: SoundTiming;
    /**
     * 武器类型
    */
    weaponTypes: string[];
    /**
     * 窗口颜色
    */
    windowTone: [RGB['R'], RGB['G'], RGB['B'], RGB['GRAY']]
}
/**
 * 图块
*/
declare type Tileset = {
    /**
     * 图块ID
    */
    id: number;
    /**
     * 图块分块数据
    */
    flags: number[];
    /**
     * 模式
     * 0 世界类型 1 区域类型
    */
    mode: 0 | 1;
    /**
     * 图块名称
    */
    name: string;
    /**
     * 备注
    */
    note: string;
    /**
     * 图像组名称
     * [A1(动画),A2(地面),A3(建筑),A4(墙壁),A5(普通),B,C,D,E]
    */
    tilesetNames: [string, string, string, string, string, string, string, string, string]
}
/**
 * 敌群
*/
declare type Troop = {
    /**
     * 敌群ID
    */
    id: number;
    /**
     * 敌群组成
    */
    members: Member[];
    /**
     * 敌群名称
    */
    name: string;
    /**
     * 条件
    */
    pages: TroopPage[];
}
/**
 * 武器
*/
declare type Weapon = {
    /**
     * 武器ID
    */
    id: number;
    /**
     * 动画ID
    */
    animationId: number;
    /**
     * 说明
    */
    description: string;
    /**
     * 装备类别id
     * 武器固定1
    */
    etypeId: 1;
    /**
     * 特性
    */
    traits: Trait[];
    /**
     * 图标编号
    */
    iconIndex: number;
    /**
     * 武器名称
    */
    name: string;
    /**
     * 备注
    */
    note: string;
    /**
     * 能力变化参数
     * [攻击力, 防御力, 魔攻, 魔防, 敏捷, 幸运, 最大HP, 最大MP]
    */
    params: [UserStatus['atk'], UserStatus['def'], UserStatus['mat'], UserStatus['mdf'], UserStatus['agi'], UserStatus['luk'], UserStatus['mhp'], UserStatus['mmp']];
    /**
     * 价格
    */
    price: number;
    /**
     * 武器类别id
    */
    wtypeId: number;
}