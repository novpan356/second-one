const edges = [];
function link(a, b, group, ab, ba, refs, spoiler = false) {
  edges.push({ a, b, group, ab, ba, refs, spoiler });
}
link("heihachi", "kazuya", "family", "sonEnemy", "fatherEnemy", ["kazuya"]);
link("heihachi", "lars", "family", "son", "father", ["lars"]);
link("heihachi", "lee", "family", "adoptedSon", "adoptiveFather", ["lee"]);
link("heihachi", "jin", "family", "grandson", "grandfather", ["jin"]);
link("heihachi", "reina", "family", "daughter", "father", ["game-main"], true);
link("heihachi", "kazumi", "family", "wife", "husband", ["game-history"]);
link("heihachi", "jinpachi", "family", "father", "son", ["game-history"]);
link("kazuya", "jin", "family", "sonEnemy", "fatherEnemy", ["jin"]);
link("kazuya", "jun", "family", "jinsMother", "jinsFather", ["jun"]);
link("jun", "jin", "family", "son", "mother", ["jun"]);
link("kazuya", "kazumi", "family", "mother", "son", ["game-history"]);
link("kazuya", "lars", "family", "halfBrother", "halfBrother", ["lars"]);
link("jin", "lars", "family", "uncle", "nephew", ["lars", "jin"]);
link("asuka", "jun", "family", "kazamaConnection", "kazamaConnection", [
  "asuka",
  "jun",
]);
link("nina", "anna", "family", "youngerSister", "olderSister", ["anna"]);
link("nina", "steve", "family", "geneticSon", "geneticMother", ["steve"]);
link("leo", "emma", "family", "mother", "child", ["leo"]);
link("leo", "niklas", "family", "fatherTeacher", "childStudent", ["leo"]);
link("lili", "mr_rochefort", "family", "father", "daughter", ["lili"]);
link("law", "forest", "family", "son", "father", ["law"]);
link("armor_king", "armor_king_i", "family", "olderBrother", "youngerBrother", [
  "armor_king",
]);
link(
  "kunimitsu",
  "kunimitsu_i",
  "family",
  "motherPredecessor",
  "daughterSuccessor",
  ["kunimitsu"],
);
link("azucena", "azucena_father", "family", "father", "daughter", ["azucena"]);
link(
  "miary_zo",
  "miary_grandmother",
  "family",
  "grandmother",
  "granddaughter",
  ["miary_zo"],
);
link("salim", "zarif", "family", "youngerBrother", "olderBrother", ["shaheen"]);
link("clive", "joshua", "family", "youngerBrother", "olderBrother", ["clive"]);
link("jin", "devil_jin", "identity", "otherForm", "samePerson", ["devil_jin"]);
link("jack8", "jane", "legacy", "creator", "creation", ["jack8"]);
link("alisa", "bosconovitch", "legacy", "creator", "creation", ["alisa"]);
link("hwoarang", "baek", "legacy", "teacher", "student", ["hwoarang"]);
link("feng", "wu_zihao", "legacy", "slainTeacher", "student", ["feng"]);
link("king", "armor_king_i", "legacy", "teacher", "student", ["armor_king"]);
link("king", "king_i", "legacy", "predecessor", "successor", ["king"]);
link("heihachi", "kuma", "legacy", "petStudent", "master", ["kuma"]);
link("lars", "alisa", "allies", "partner", "partner", ["alisa", "lars"]);
link("lars", "lee", "allies", "strategicAlly", "strategicAlly", [
  "lee",
  "lars",
]);
link("jin", "lee", "allies", "strategicAlly", "strategicAlly", ["jin", "lee"]);
link("jin", "xiaoyu", "allies", "supporter", "searchTarget", ["xiaoyu"]);
link("jin", "hwoarang", "conflict", "rival", "rival", ["hwoarang"]);
link("jun", "ogre", "conflict", "attacker", "attackTarget", ["jun"]);
link("jin", "ogre", "conflict", "enemy", "enemy", ["game-history"]);
link("jin", "azazel", "conflict", "devilSource", "opponent", ["jin"]);
link("zafina", "azazel", "conflict", "sealedSpirit", "sealKeeper", ["zafina"]);
link("zafina", "claudio", "allies", "sealHelper", "protectedAlly", ["zafina"]);
link("zafina", "xiaoyu", "allies", "caregiver", "protectedAlly", ["zafina"]);
link("claudio", "xiaoyu", "allies", "searchPartner", "searchPartner", [
  "claudio",
]);
link("claudio", "heihachi", "conflict", "brokenAlly", "formerAlly", [
  "claudio",
]);
link("kazuya", "nina", "allies", "commander", "employer", ["nina"]);
link("nina", "feng", "allies", "recruit", "recruiter", ["feng"]);
link("feng", "leroy", "conflict", "rival", "rival", ["feng"]);
link("asuka", "lili", "conflict", "rival", "rival", ["asuka", "lili"]);
link("law", "paul", "allies", "friend", "friend", ["law", "paul"]);
link("steve", "paul", "allies", "trainingFriend", "trainingFriend", ["steve"]);
link("steve", "law", "allies", "trainingFriend", "trainingFriend", ["steve"]);
link("xiaoyu", "panda", "allies", "bodyguard", "protectedCompanion", ["panda"]);
link("victor", "raven", "legacy", "agent", "founderCommander", ["victor"]);
link("lee", "bosconovitch", "allies", "technologyAlly", "technologyAlly", [
  "lee",
]);
link(
  "yoshimitsu",
  "bosconovitch",
  "allies",
  "technologyAlly",
  "technologyAlly",
  ["yoshimitsu"],
);
link("eddy", "kazuya", "conflict", "enemy", "opponent", ["eddy"]);
link("eddy", "jin", "conflict", "formerEmployer", "formerSubordinate", [
  "eddy",
]);
link("eddy", "yoshimitsu", "allies", "rescuer", "rescuedAlly", ["eddy"]);
link("eddy", "lidia", "allies", "friendAlly", "friendAlly", ["eddy", "lidia"]);
link("lidia", "yoshimitsu", "allies", "intelligenceAlly", "intelligenceAlly", [
  "lidia",
]);
link("king", "armor_king", "conflict", "rivalLegacy", "rivalLegacy", [
  "armor_king",
]);
link("kunimitsu", "reina", "allies", "intelligenceDeal", "intelligenceDeal", [
  "kunimitsu",
]);
link("kunimitsu", "yoshimitsu", "conflict", "swordTarget", "swordHunter", [
  "kunimitsu",
]);
link("kunimitsu_i", "yoshimitsu", "conflict", "rival", "rival", ["kunimitsu"]);
link("anna", "dr_nakamura", "allies", "weaponMaker", "client", ["anna"]);
link("shaheen", "salim", "allies", "fallenFriend", "friendProtector", [
  "shaheen",
]);
link("shaheen", "zarif", "allies", "legacyEntruster", "trustedGuardian", [
  "shaheen",
]);
link("shaheen", "kazuya", "conflict", "investigationTarget", "investigator", [
  "shaheen",
]);
link("leo", "kazuya", "conflict", "suspectedTarget", "investigator", ["leo"]);
link("leroy", "kazuya", "conflict", "enemy", "opponent", ["leroy"]);
link("leroy", "heihachi", "conflict", "investigationTarget", "investigator", [
  "leroy",
]);
link("fahkumram", "kuma", "conflict", "politicalObstacle", "displacedFighter", [
  "fahkumram",
]);
link(
  "miary_zo",
  "vanilla_cacao",
  "allies",
  "animalCompanions",
  "travelCompanion",
  ["miary_zo"],
);
link("dragunov", "dragunov_command", "legacy", "command", "soldier", [
  "dragunov",
]);
link("clive", "torgal", "allies", "animalCompanion", "travelCompanion", [
  "clive",
]);
link("clive", "jill", "allies", "homeCompanion", "homeCompanion", ["clive"]);
link("kazumi", "akuma", "allies", "promiseKeeper", "promiseSource", [
  "game-history",
]);
link("akuma", "heihachi", "conflict", "missionTarget", "opponent", [
  "game-history",
]);
link("akuma", "kazuya", "conflict", "missionTarget", "opponent", [
  "game-history",
]);

export const relationLabels = {
  zh: {
    family: "家族与亲缘",
    legacy: "师承与传承",
    allies: "同盟与牵挂",
    conflict: "冲突与追索",
    identity: "身份与形态",
    son: "儿子",
    daughter: "女儿",
    father: "父亲",
    mother: "母亲",
    child: "子女",
    wife: "妻子",
    husband: "丈夫",
    adoptedSon: "养子",
    adoptiveFather: "养父",
    grandson: "孙子",
    grandfather: "祖父",
    grandmother: "祖母",
    granddaughter: "孙女",
    sonEnemy: "儿子 / 对立",
    fatherEnemy: "父亲 / 对立",
    jinsMother: "仁的母亲",
    jinsFather: "仁的父亲",
    halfBrother: "同父异母兄弟",
    uncle: "叔父",
    nephew: "侄子",
    kazamaConnection: "风间家关联 · 辈分未明",
    youngerSister: "妹妹 / 宿敌",
    olderSister: "姐姐 / 宿敌",
    geneticSon: "遗传上的儿子",
    geneticMother: "遗传上的母亲",
    fatherTeacher: "父亲 / 武术启蒙",
    childStudent: "子女 / 学生",
    olderBrother: "兄长",
    youngerBrother: "弟弟",
    motherPredecessor: "母亲 / 前代名号",
    daughterSuccessor: "女儿 / 名号继承者",
    otherForm: "同一人物的恶魔形态",
    samePerson: "同一人物的人类形态",
    creator: "创造者",
    creation: "创造物",
    teacher: "师父",
    student: "弟子",
    slainTeacher: "被其杀害的师父",
    predecessor: "名号前代",
    successor: "名号继承者",
    petStudent: "宠物 / 弟子",
    master: "主人 / 师承",
    partner: "同行伙伴",
    strategicAlly: "反抗军战略同盟",
    supporter: "信任与支持",
    searchTarget: "思念与寻找的对象",
    rival: "竞争 / 宿敌",
    attacker: "袭击者",
    attackTarget: "袭击对象",
    enemy: "敌对",
    opponent: "对手",
    devilSource: "恶魔始祖",
    sealedSpirit: "左臂封印的精神",
    sealKeeper: "封印者",
    sealHelper: "封印协助者",
    protectedAlly: "帮助的盟友",
    caregiver: "照顾与支持",
    searchPartner: "寻仁的协力者",
    brokenAlly: "背弃合作的前盟友",
    formerAlly: "曾合作的驱魔者",
    commander: "军队指挥",
    employer: "雇主",
    recruit: "招募的战力",
    recruiter: "招募者",
    friend: "好友",
    trainingFriend: "训练伙伴",
    bodyguard: "宠物 / 保镖",
    protectedCompanion: "守护的伙伴",
    agent: "部队特工",
    founderCommander: "组织创建者 / 指挥",
    technologyAlly: "技术盟友",
    formerEmployer: "过去的雇主",
    formerSubordinate: "过去的部下",
    rescuer: "救援者",
    rescuedAlly: "被救的盟友",
    friendAlly: "旧友 / 同盟",
    intelligenceAlly: "情报盟友",
    rivalLegacy: "因前代相连的对手",
    intelligenceDeal: "互相利用的情报交易",
    swordTarget: "妖刀追索对象",
    swordHunter: "妖刀追索者",
    weaponMaker: "武器制造者",
    client: "委托者",
    fallenFriend: "已故好友",
    friendProtector: "好友 / 护卫",
    legacyEntruster: "遗物托付者",
    trustedGuardian: "托付志向的守护者",
    investigationTarget: "调查目标",
    investigator: "调查者",
    suspectedTarget: "母亲之死的怀疑目标",
    politicalObstacle: "腐败密约造成的阻碍",
    displacedFighter: "密约排除的格斗家",
    animalCompanions: "动物伙伴 / 传说使者",
    travelCompanion: "旅行伙伴",
    command: "所属指挥体系",
    soldier: "所属军人",
    animalCompanion: "动物伙伴",
    homeCompanion: "原世界重要伙伴",
    promiseKeeper: "旧约履行者",
    promiseSource: "旧约委托者",
    missionTarget: "任务中的对立",
  },
  en: {
    family: "Family & kinship",
    legacy: "Teachers & legacy",
    allies: "Allies & bonds",
    conflict: "Conflict & pursuit",
    identity: "Identity & forms",
    son: "Son",
    daughter: "Daughter",
    father: "Father",
    mother: "Mother",
    child: "Child",
    wife: "Wife",
    husband: "Husband",
    adoptedSon: "Adopted son",
    adoptiveFather: "Adoptive father",
    grandson: "Grandson",
    grandfather: "Grandfather",
    grandmother: "Grandmother",
    granddaughter: "Granddaughter",
    sonEnemy: "Son / enemy",
    fatherEnemy: "Father / enemy",
    jinsMother: "Jin’s mother",
    jinsFather: "Jin’s father",
    halfBrother: "Paternal half-brother",
    uncle: "Paternal uncle",
    nephew: "Nephew",
    kazamaConnection: "Kazama connection · degree unspecified",
    youngerSister: "Younger sister / rival",
    olderSister: "Older sister / rival",
    geneticSon: "Genetic son",
    geneticMother: "Genetic mother",
    fatherTeacher: "Father / martial teacher",
    childStudent: "Child / student",
    olderBrother: "Older brother",
    youngerBrother: "Younger brother",
    motherPredecessor: "Mother / earlier title bearer",
    daughterSuccessor: "Daughter / title successor",
    otherForm: "Same person’s Devil form",
    samePerson: "Same person’s human form",
    creator: "Creator",
    creation: "Creation",
    teacher: "Teacher",
    student: "Student",
    slainTeacher: "Teacher killed by this fighter",
    predecessor: "Earlier title bearer",
    successor: "Title successor",
    petStudent: "Pet / student",
    master: "Master / teacher",
    partner: "Companion",
    strategicAlly: "Rebellion strategic ally",
    supporter: "Trust and support",
    searchTarget: "Person sought",
    rival: "Rival",
    attacker: "Attacker",
    attackTarget: "Person attacked",
    enemy: "Enemy",
    opponent: "Opponent",
    devilSource: "Devil progenitor",
    sealedSpirit: "Spirit sealed in the arm",
    sealKeeper: "Keeper of the seal",
    sealHelper: "Help with the seal",
    protectedAlly: "Ally helped",
    caregiver: "Care and support",
    searchPartner: "Partner in finding Jin",
    brokenAlly: "Ally who broke the pact",
    formerAlly: "Former exorcist ally",
    commander: "Military commander",
    employer: "Employer",
    recruit: "Recruit",
    recruiter: "Recruiter",
    friend: "Friend",
    trainingFriend: "Training companion",
    bodyguard: "Pet / bodyguard",
    protectedCompanion: "Protected companion",
    agent: "Unit agent",
    founderCommander: "Founder / commander",
    technologyAlly: "Technology ally",
    formerEmployer: "Former employer",
    formerSubordinate: "Former subordinate",
    rescuer: "Rescuer",
    rescuedAlly: "Rescued ally",
    friendAlly: "Old friend / ally",
    intelligenceAlly: "Intelligence ally",
    rivalLegacy: "Rival linked by a shared legacy",
    intelligenceDeal: "Mutual intelligence bargain",
    swordTarget: "Target of the sword pursuit",
    swordHunter: "Sword pursuer",
    weaponMaker: "Weapon maker",
    client: "Client",
    fallenFriend: "Deceased friend",
    friendProtector: "Friend / protector",
    legacyEntruster: "Keeper who entrusted a legacy",
    trustedGuardian: "Trusted guardian",
    investigationTarget: "Investigation target",
    investigator: "Investigator",
    suspectedTarget: "Suspect in mother’s death",
    politicalObstacle: "Obstacle from a corrupt pact",
    displacedFighter: "Fighter displaced by the pact",
    animalCompanions: "Animal companions / messengers",
    travelCompanion: "Travel companion",
    command: "Military command",
    soldier: "Soldier in the unit",
    animalCompanion: "Animal companion",
    homeCompanion: "Companion in the home world",
    promiseKeeper: "Keeper of the promise",
    promiseSource: "Source of the promise",
    missionTarget: "Mission opponent",
  },
  ja: {
    family: "家族と親族",
    legacy: "師弟と継承",
    allies: "協力と絆",
    conflict: "対立と追求",
    identity: "同一性と形態",
    son: "息子",
    daughter: "娘",
    father: "父",
    mother: "母",
    child: "子",
    wife: "妻",
    husband: "夫",
    adoptedSon: "養子",
    adoptiveFather: "養父",
    grandson: "孫",
    grandfather: "祖父",
    grandmother: "祖母",
    granddaughter: "孫娘",
    sonEnemy: "息子 / 対立",
    fatherEnemy: "父 / 対立",
    jinsMother: "仁の母",
    jinsFather: "仁の父",
    halfBrother: "異母兄弟",
    uncle: "叔父",
    nephew: "甥",
    kazamaConnection: "風間の関連 · 親等不明",
    youngerSister: "妹 / 宿敵",
    olderSister: "姉 / 宿敵",
    geneticSon: "遺伝上の息子",
    geneticMother: "遺伝上の母",
    fatherTeacher: "父 / 武術の師",
    childStudent: "子 / 生徒",
    olderBrother: "兄",
    youngerBrother: "弟",
    motherPredecessor: "母 / 先代",
    daughterSuccessor: "娘 / 名の継承者",
    otherForm: "同じ人物のデビル形態",
    samePerson: "同じ人物の人間形態",
    creator: "創造者",
    creation: "創造物",
    teacher: "師",
    student: "弟子",
    slainTeacher: "殺された師",
    predecessor: "名の先代",
    successor: "名の継承者",
    petStudent: "ペット / 弟子",
    master: "主人 / 師",
    partner: "同行の仲間",
    strategicAlly: "反乱軍の戦略的協力者",
    supporter: "信頼と支え",
    searchTarget: "探す相手",
    rival: "ライバル",
    attacker: "襲撃者",
    attackTarget: "襲撃された相手",
    enemy: "敵",
    opponent: "対戦相手",
    devilSource: "デビルの始祖",
    sealedSpirit: "腕に封じた精神",
    sealKeeper: "封印を守る者",
    sealHelper: "封印の協力者",
    protectedAlly: "助けた仲間",
    caregiver: "介抱と支え",
    searchPartner: "仁を探す協力者",
    brokenAlly: "協力を破棄した相手",
    formerAlly: "以前の祓魔の協力者",
    commander: "軍の指揮官",
    employer: "雇い主",
    recruit: "勧誘した戦力",
    recruiter: "勧誘者",
    friend: "友人",
    trainingFriend: "練習仲間",
    bodyguard: "ペット / 護衛",
    protectedCompanion: "守る仲間",
    agent: "部隊の諜報員",
    founderCommander: "創設者 / 指揮官",
    technologyAlly: "技術の盟友",
    formerEmployer: "以前の雇い主",
    formerSubordinate: "以前の部下",
    rescuer: "救助者",
    rescuedAlly: "救った仲間",
    friendAlly: "旧友 / 同盟",
    intelligenceAlly: "情報の協力者",
    rivalLegacy: "先代で繋がる対戦相手",
    intelligenceDeal: "互いを利用する情報取引",
    swordTarget: "妖刀を狙う対象",
    swordHunter: "妖刀を狙う者",
    weaponMaker: "武器の製作者",
    client: "依頼者",
    fallenFriend: "亡くなった友",
    friendProtector: "友 / 護衛",
    legacyEntruster: "形見を託す相手",
    trustedGuardian: "志を託した守り手",
    investigationTarget: "調査の対象",
    investigator: "調査者",
    suspectedTarget: "母の死で疑う相手",
    politicalObstacle: "腐敗の密約での障害",
    displacedFighter: "密約で外された格闘家",
    animalCompanions: "動物の仲間 / 御使い",
    travelCompanion: "旅の仲間",
    command: "所属の指揮系統",
    soldier: "所属軍人",
    animalCompanion: "動物の仲間",
    homeCompanion: "元の世界の仲間",
    promiseKeeper: "約束を果たす者",
    promiseSource: "約束の依頼者",
    missionTarget: "任務での対立",
  },
};
link("bryan", "international_police", "conflict", "enemy", "opponent", [
  "bryan",
]);
link("bryan", "yoshimitsu", "conflict", "rival", "rival", ["game-context"]);
link("armor_king", "marduk", "conflict", "enemy", "enemy", [
  "game-context",
  "armor_king",
]);
link("king", "marduk", "allies", "rivalLegacy", "rivalLegacy", [
  "game-context",
]);

export const relationships = edges;
