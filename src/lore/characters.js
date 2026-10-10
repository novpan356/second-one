// Original three-language paraphrases of directly checked official character biographies.
const rows = {};
function add(id, zh, en, ja) {
  rows[id] = {
    id,
    kind: id === "clive" ? "guest" : id === "devil_jin" ? "form" : "fighter",
    biography: { zh, en, ja },
    sources: [
      {
        label: "TEKKEN 8 · official character background (JP)",
        url: `https://tk8.tekken-official.jp/character/index.php?chara=${id}`,
        checkedAt: "2026-10-10",
      },
    ],
  };
}
add(
  "jin",
  [
    "仁是风间准与三岛一八的儿子，在屋久岛由准抚养。准遭斗神袭击后失踪，仁投奔祖父平八学习战斗，却在击败斗神后遭到平八背叛，体内的恶魔之力因此觉醒。他后来放弃三岛流，改以空手道对抗自己的家族与血统。",
    "赢得第五届大会并掌控三岛财阀后，仁以唤醒恶魔始祖阿萨谢尔为目的发动世界战争。他相信让自己与始祖一同消亡能够终结恶魔血脉，但战争造成的大量伤亡成为无法抹去的罪责。第六作结尾，他击败阿萨谢尔，自己也陷入长期昏迷。",
    "仁沉睡期间，一八率领 G 公司夺取世界优势。数月后苏醒的仁已能够控制恶魔力量，与拉斯、李超狼等反抗军成员准备“雷光行动”。《铁拳 8》的起点不是他的罪已获宽恕，而是他决定终结一八的统治，并承担自己造成的后果。",
  ],
  [
    "Jin is the son of Jun Kazama and Kazuya Mishima. Raised on Yakushima, he sought Heihachi’s training after Ogre attacked and Jun disappeared. Heihachi betrayed him after Ogre’s defeat, awakening Jin’s Devil power. Jin subsequently rejected Mishima karate and adopted a different karate discipline.",
    "After defeating Jinpachi and taking control of the Zaibatsu, Jin started a world war to awaken Azazel. He believed destroying the progenitor alongside himself would eliminate Devil power. His plan caused immense suffering; defeating Azazel left Jin unconscious rather than bringing the promised end to the conflict.",
    "While Jin slept, Kazuya’s G Corporation gained the upper hand. Upon waking months later, Jin could control his Devil power. He joined Lars and the rebellion in preparing Operation Lightning, determined to end Kazuya’s rule and confront the consequences of the war he had started.",
  ],
  [
    "風間準と三島一八の息子である仁は、屋久島で育った。オーガの襲撃で準が消息不明になると平八に師事するが、オーガを倒した後に裏切られ、デビルの力が目覚める。その後は三島流を捨て、別の空手を身につけた。",
    "仁八を倒して財閥の頭首となった仁は、アザゼルを復活させるため世界に戦争を仕掛けた。始祖と自分を共に消すことでデビルを滅ぼせると考えたが、多大な犠牲を生み、アザゼルとの戦いの後も長く意識を失う。",
    "その間に一八のG社が世界を掌握する。数か月後に目覚めた仁はデビルの力を制御できるようになり、ラースらと雷光作戦を準備する。8の物語は、罪を消すのではなく、支配を止めてその責任に向き合う決意から始まる。",
  ],
);
add(
  "kazuya",
  [
    "一八与父亲平八之间的仇恨贯穿系列。首届大会中他击败平八并将其抛下悬崖；第二届大会形势逆转，平八夺回财阀，将一八扔进火山。一八后来被 G 公司救活，借助其研究与军事实力重新积蓄力量。",
    "第七作的父子决战中，一八击败平八并把他投入熔岩。失去领袖的三岛财阀无法阻止 G 公司的攻势，战争以 G 公司取得优势告终，但一八并没有就此停止侵略。",
    "《铁拳 8》开场，各国领导人在纽约讨论制裁与要求 G 公司解除武装。一八亲临会场拒绝停战，命令军队进攻城市。他以恶魔力量和军事统治推行强者支配的秩序，而儿子仁与反抗军准备挑战这套秩序。",
  ],
  [
    "Kazuya’s feud with Heihachi spans the series. He defeated and threw his father from a cliff in the first tournament; Heihachi reclaimed the Zaibatsu and threw Kazuya into a volcano in the second. G Corporation later revived Kazuya, giving him the means to rebuild his power.",
    "In TEKKEN 7, Kazuya defeated Heihachi in their final confrontation and cast him into lava. G Corporation overwhelmed the leaderless Zaibatsu, but victory did not end its military expansion.",
    "At the opening of TEKKEN 8, world leaders meet in New York to consider sanctions and disarmament. Kazuya rejects their demands and orders an assault on the city. His Devil power and corporate army enforce a world ruled by strength, opposed by Jin and the rebellion.",
  ],
  [
    "一八と平八の確執はシリーズを貫く。初代大会で父を崖から投げ捨てた一八は、第二回では敗れ火山に落とされる。後にG社に蘇生され、その研究と軍事力を利用して力を蓄えた。",
    "7の決闘で一八は平八を倒し、溶岩へ投げ込む。頭首を失った財閥はG社に敗れるが、一八は勝利後も侵攻を続けた。",
    "8の冒頭、制裁と武装解除を議論するニューヨークの国際会議に一八が現れる。停戦を拒んで街への攻撃を命じ、デビルの力と企業軍による支配を進める。仁と反乱軍はその秩序に挑む。",
  ],
);
add(
  "reina",
  [
    "蕾娜以三岛流与迅捷体术参加战斗。她最初的公开背景刻意保持神秘：官方只明确她是三岛工业高等专门学校的学生，未在这段介绍中解释她的出身与目的。",
    "《铁拳 8》主线中，她接近仁，并在与三岛家族的战斗中追求隐藏的目标。她与平八的关系以及恶魔力量的揭示属于主线结尾内容，下方“主线关联”单独收录。",
    "国光的后续官方背景补充了两人的交集：国光以学生会副会长身份调查蕾娜，双方识破对方并建立相互利用的关系。蕾娜以九咫刀的线索换取 G 公司机密；国光给出了入侵计划。该资料称她曾使用“八乙女蕾娜”的身份。",
  ],
  [
    "Reina’s original official profile deliberately reveals little beyond her attendance at Mishima Polytechnical School. Her fast attacks and Mishima-style techniques are visible, but that introduction does not explain her origins or objectives.",
    "In the main story she approaches Jin while pursuing concealed aims of her own. The revelations about Heihachi and her Devil power belong to the ending, presented separately in the linked main-story sections.",
    "Kunimitsu’s later official background adds a school connection: the infiltrating student council vice president uncovered Reina’s assumed identity. They recognized each other’s usefulness and maintained a dangerous apparent friendship. Reina traded information about nine ancient swords for G Corporation intelligence; Kunimitsu supplied its invasion plans. That biography records the alias Reina Yaotome.",
  ],
  [
    "麗奈の初期プロフィールは意図的に謎を残し、三島工業高等専門学校の学生であることだけを明示している。素早い体術と三島流を使うが、この紹介だけでは出自や目的は説明されない。",
    "本編では仁に近づきながら独自の目的を追う。平八との関係とデビルの力についての核心は結末で明かされるため、下の主線関連に分けて収録する。",
    "後に公開された州光の背景には学校での接点がある。副会長として潜入した州光は八乙女麗奈という身分を調べ、互いの正体を見抜いた二人は利用し合う関係になる。麗奈は九咫刀の情報と引き換えにG社の機密を要求し、州光は侵攻計画を渡した。",
  ],
);
add(
  "alisa",
  [
    "阿丽莎是波斯科诺维奇博士制造、曾用于保护财阀头首仁的战斗机器人。她与拉斯同行后，却被主人控制系统强制改写行为，与拉斯战斗至停止运作。",
    "拉斯等人帮助她重新启动，她成为反抗军的一员。但当拉斯的信息频繁出现在思考中、机体温度上升时，她误以为程序残留故障，向博士申请检修。",
    "大规模升级后，博士告诉她并没有那样的漏洞，旧有的主人控制功能也已被移除。她获得选择生活的自由，决定今后以自己的意志继续与拉斯同行。",
  ],
  [
    "Alisa is Dr. Bosconovitch’s combat android, originally built to protect Jin. After accompanying Lars, her master-control system forced her to fight him, leaving her nonfunctional.",
    "Lars and his allies restored her, and she joined the rebellion. Frequent thoughts of Lars and rising body temperature made her suspect a lingering program error, so she requested maintenance from her creator.",
    "Following a major upgrade, the doctor explained that no such bug remained and that the master-control function had been removed. Free to choose her own life, Alisa resolved to continue alongside Lars of her own will.",
  ],
  [
    "ボスコノビッチ博士が仁の護衛として造ったアンドロイド。ラースと行動した後、マスター制御で彼と戦わされ、機能を停止した。",
    "仲間の尽力で再起動し反乱軍に加わるが、思考にラースの情報が入り機体温度が上がる現象をバグと疑い、博士に整備を頼む。",
    "大型更新を経て、バグではなくマスターの制御機能も消えたことを知る。自由を得たアリサは、自分の意志でラースと歩むと決めた。",
  ],
);
add(
  "asuka",
  [
    "飞鸟是以风间流古武术与热心调解争端闻名的大阪格斗家。她在铁拳大会击败莉莉后，成为这位富家千金持续挑战的对象。",
    "莉莉的追逐不断升级，甚至买下飞鸟家的道场并用玫瑰重新装饰。飞鸟一面应付这些介入生活的挑战，一面坚持自己的格斗道路。",
    "随着 G 公司把战争推向世界，两人的喧闹日常也受到威胁。飞鸟与准、仁共享风间流与家族背景，但这不等于官网已说明她们之间精确的亲属辈分。",
  ],
  [
    "Asuka is an Osaka fighter known for Kazama-style martial arts and intervening in disputes. Defeating Lili at a tournament made her the heiress’s persistent rival.",
    "Lili’s challenges escalated into buying the Kazama dojo and covering it with roses. Asuka continued her martial path while coping with her rival’s intrusions into everyday life.",
    "G Corporation’s worldwide invasion threatens that familiar routine. Asuka shares the Kazama family and martial tradition with Jun and Jin; the consulted biography does not establish an exact family relationship.",
  ],
  [
    "大阪の喧嘩仲裁屋として知られる風間流の使い手。大会でリリを破ったことで、彼女から繰り返し挑戦を受けるようになった。",
    "リリの行動は道場を買い取りバラで飾るほどに拡大する。飛鳥は巻き込まれつつも自分の武術の道を歩む。",
    "G社の侵攻はそんな日常にも影を落とす。準や仁と風間の名や武術を共有するが、確認した紹介は正確な親等まで明示していない。",
  ],
);
add(
  "azucena",
  [
    "阿苏塞娜出生于秘鲁高地的奥尔蒂斯咖啡农场，是农场主的独女。她从小想让自家咖啡成为世界第一，反复尝试大胆的栽培方法，即使大人劝阻，也把它理解为支持。",
    "她的咖啡后来在国际评比获得最高品质评价。她继续在模特、舞蹈领域取得成绩，并学习商业管理，但认为通往世界第一还需要更冒险的宣传方式。",
    "在抓回逃走的羊驼时，她想到利用高地锻炼出的身体能力参加美国综合格斗赛事。第一年夺冠后，以自身为广告让“阿苏塞娜特调”与农场销量大增。铁拳大会成为她扩大品牌影响力的下一站，而非为三岛血仇而参赛。",
  ],
  [
    "Azucena grew up as the only daughter of the owner of Peru’s high-altitude Ortiz Farm. Determined to make its coffee the world’s best, she pursued unusually bold cultivation ideas and treated warnings as encouragement.",
    "Her beans earned top recognition at an international competition. Success in modeling and dance followed, alongside business studies, but she believed global recognition demanded a more adventurous promotional strategy.",
    "While retrieving an escaped alpaca, she devised a plan to use her high-altitude athleticism in American MMA. Becoming champion in her first year made her a successful ambassador for Azucena Blend and the farm. The Iron Fist Tournament became her next opportunity to grow the brand.",
  ],
  [
    "ペルー高地のオルティス・ファームの一人娘。世界一のコーヒーを目指し、大人の制止も応援と受け取って大胆な栽培を続けた。",
    "豆が国際品評会で最高評価を得ると、モデルやダンスでも成功し経営学を学ぶ。それでも世界一には冒険的な宣伝が必要だと考える。",
    "逃げるアルパカを捕まえた時、高地で培った身体能力をアメリカのMMAで活用する案を思いつく。初年度で王者となり自分のブレンドと農園を宣伝。次の舞台として鉄拳大会に注目した。",
  ],
);
add(
  "bryan",
  [
    "布莱恩曾是警察，如今是体内装有永久动力机构、以毁灭为乐的改造人。三岛财阀与 G 公司的战争结束后，他仍不断挑起战斗，遭国际警察通缉。",
    "在与国际警察反恐精锐的城市战中，他的永久动力机构突然热失控。官方没有确定这是长期战场消耗还是身体旧记忆造成的，只描写力量与快感席卷了他的意识。",
    "等他恢复意识，周围已成焦土。一名似乎认识从前布莱恩的人质问他的身份，得到的回应却只有攻击与狂笑。他的故事表现的是改造力量与破坏冲动，而不是反抗军的救赎路线。",
  ],
  [
    "Bryan is a former officer transformed into a destructive replicant with a perpetual energy generator. He kept fighting after the corporate war’s turning point and became wanted by the international police.",
    "During urban combat against an elite counterterrorism force, the generator overheated. The official account leaves its cause unresolved: prolonged battlefield use or memories within his body may have contributed.",
    "Power and pleasure overwhelmed his consciousness. He awoke amid scorched ruins, answering a survivor’s question about his former identity with violence and laughter. His arc centers on destructive power rather than the rebellion’s search for redemption.",
  ],
  [
    "元警官のブライアンは永久機関を備えたレプリカントとなり、企業間の戦争の決着後も破壊を続け、国際警察に追われていた。",
    "対テロ精鋭部隊との市街戦で永久機関が熱暴走する。酷使か肉体の記憶か、原因は公式文でも断定されていない。",
    "力と快楽に意識を焼かれ、目覚めると周囲は焦土だった。かつての彼を知るらしい者の問いにも暴力と笑いで応える。その物語は贖罪より破壊衝動を描く。",
  ],
);
add(
  "claudio",
  [
    "克劳迪奥是天狼星驱魔组织的实际领袖与最强能力者。平八告诉他仁与一八拥有恶魔身份后，他不顾组织反对选择合作，并接近寻找仁的晓雨，起初打算利用她找到并消灭仁。",
    "平八后来单方面抛弃盟约，使克劳迪奥失去声望，成员纷纷离开。晓雨始终相信仁的态度让他反省，他坦白原先的企图并道歉，转而答应协助寻找仁。",
    "不过他仍保留最坏情况的准备：如果仁彻底被恶魔支配并伤害晓雨的信任，他将承担驱魔者的责任。他解除了右臂上一重封印，准备使用会消耗施术者生命的禁术；又帮助扎菲娜抑制左臂中的阿萨谢尔。",
  ],
  [
    "Claudio leads the Sirius exorcists and is their strongest practitioner. After Heihachi identified Jin and Kazuya as Devils, he joined Heihachi despite internal opposition. He initially approached Xiaoyu to use her search for Jin as a means of finding and eliminating him.",
    "Heihachi abandoned the alliance, destroying Claudio’s standing and prompting departures. Xiaoyu’s unwavering trust in Jin made him reconsider. He confessed his deception, apologized and promised to help her search.",
    "He nevertheless prepared for Jin becoming fully controlled by Devil power. Releasing a seal on his arm gave access to a forbidden exorcism that consumes its user’s life. He also helped seal the Azazel power troubling Zafina, tying the three characters’ paths together.",
  ],
  [
    "シリウスの射手の実質的代表で最強の祓魔師。平八から仁と一八がデビルと知らされ、反対を押して協力した。初めは仁を討つためにシャオユウを利用しようとする。",
    "平八の一方的な離反で信用を失うが、仁を信じるシャオユウに心を動かされる。企みを告白して謝り、捜索への協力を誓った。",
    "ただし仁が完全にデビルに支配されれば討つ覚悟も残す。腕の封印を解き命を削る禁呪を準備し、ザフィーナの左腕のアザゼルを抑える聖なる封印にも力を貸す。",
  ],
);
add(
  "devil_jin",
  [
    "恶魔仁不是仁的兄弟或另一个独立血亲，而是仁被恶魔血统支配、失去理性时显现的另一种形态。黑翼、飞行与超自然力量都是这种状态的表现。",
    "仁遭平八背叛后恶魔力量觉醒，此后不断与它争夺身体与意识的控制权。后来能主动使用恶魔力量，并不等于失控形态与他已完全分离。",
    "《铁拳 8》将这场冲突推进到内心层面：仁必须面对一直试图否定的自己。关系树用“同一人物的形态”连接两份档案，不将其当成第二个人。",
  ],
  [
    "Devil Jin is not Jin’s sibling or a separate blood relative. He is the form manifested when Devil blood overwhelms Jin’s reason, expressed through black wings and supernatural abilities.",
    "The power awakened after Heihachi’s betrayal. Jin’s ability to use it deliberately later does not make the uncontrolled form an entirely separate person; their conflict concerns control of the same body and identity.",
    "TEKKEN 8 brings that struggle into Jin’s inner world, where he must confront the self he has tried to reject. The relationship tree therefore labels this connection as another form of the same person.",
  ],
  [
    "デビル仁は別の兄弟ではなく、デビルの血に理性を奪われた仁の姿。黒い翼と超常的な能力で表される。",
    "平八の裏切りで力が目覚めて以来、仁は身体と意識の主導権を巡って苦しむ。任意に力を使えることも、別人として分離したことを意味しない。",
    "8では内面の戦いとして、自分が否定してきた存在に向き合う。関係図も同一人物の別形態として結び、独立した血縁者にはしない。",
  ],
);
add(
  "feng",
  [
    "冯威追求神拳奥义之书中超越人类的“龙神”境界。他曾师从拳圣吴子豪，但认为压倒性的力量才是武者的资格，不接受师父强调心与技统一的教导，并杀死了师父。",
    "前届大会败给李洛伊后，师父的理念再次成为他无法回避的问题。冯威选择把愤怒化为训练，寻找擅长防守的高手挑战，试图证明绝对力量可以击穿一切防御。",
    "半年后，妮娜以加入 G 公司便能安排与李洛伊再战为条件招募他。冯威知道这意味着为侵略力量服务，仍然接受交易，继续以复仇与证明力量为目标。",
  ],
  [
    "Feng pursues the Dragon God ideal recorded in the martial scroll. His teacher Wu Zihao emphasized unity of mind and technique, but Feng believed only overwhelming power mattered and killed his master.",
    "Losing to Leroy challenged that conviction again. He turned anger into training, attacking defensive martial specialists to prove that superior force could break any guard.",
    "Nina later offered him a rematch with Leroy in exchange for serving G Corporation. Knowing the consequences, Feng accepted, continuing his search for power and vindication.",
  ],
  [
    "神拳奥義之書の龍神を目指すフェンは、心技一致を説く師ウー・ズーハオを否定し、力こそ真の資格だと考えて師を殺めた。",
    "リロイに敗れたことでその信念は再び揺らぐ。怒りを修業に変え、防御に優れた達人を倒して圧倒的な力を証明しようとする。",
    "ニーナからG社への協力と引き換えに再戦の場を提示され、意味を承知で応じる。目的はリロイと師の思想を否定し龍神へ進むことだった。",
  ],
);
add(
  "hwoarang",
  [
    "花郎是白头山门下的跆拳道高手，自与仁初次交手战平以来，一直把他视作必须超越的对手。",
    "在《铁拳 8》之前约半年，他在中东遇见长出黑翼的仁。这与过去曾瞬间击败他的形态相同；他拼尽全力击倒暴走的仁，但国际联合军介入后仁再度失踪。",
    "即使取得胜利，花郎仍觉得没有回答真正想要的问题。回国后他开始精神修行，重新审视自己为何追求与仁的对决，以及接下来应如何战斗。",
  ],
  [
    "A taekwondo expert trained by Baek, Hwoarang has regarded Jin as his rival since their first fight ended in a draw.",
    "About six months before TEKKEN 8, he encountered the black-winged Jin in the Middle East. He defeated the rampaging form after an exhausting fight, but international forces intervened and Jin disappeared again.",
    "Victory did not resolve what Hwoarang truly wanted. Returning home, he began spiritual training to understand his rivalry and the purpose behind his pursuit of another confrontation.",
  ],
  [
    "ペク門下のテコンドー使い。仁との初戦で引き分けて以来、彼を超えるべきライバルと考えている。",
    "8の約半年前、中東で黒翼の仁と再会し死力を尽くして倒す。しかし国際協力連合軍の介入で仁は再び姿を消す。",
    "勝ったはずなのに納得できず、帰国後に精神修行を始める。仁との勝負で本当に何を求めるのか、自分の望みとすべきことを見直していく。",
  ],
);
add(
  "jack8",
  [
    "杰克 8 是 G 公司杰克系列人形兵器的新原型。科学家简曾被早期杰克救命，此后把理想中的杰克作为研究目标，在 G 公司持续开发。",
    "杰克系列已经成为公司的主力兵器，但简仍希望它进化。新机型搭载远超杰克 7 的人工智能与学习能力，并加入以电磁脉冲攻击为核心的伽马系统和大型特殊装备。",
    "随着一八制造的世界战争升级，杰克 8 将被投入战场巩固 G 公司的支配。关系中的简是开发者，前代杰克是技术与情感上的传承对象，并非人类父子血缘。",
  ],
  [
    "Jack-8 is a new prototype in G Corporation’s Jack weapon series. Its developer Jane was once saved by an earlier Jack and has devoted her research to creating her ideal version.",
    "Despite the series’ established military role, Jane planned a major leap beyond Jack-7: advanced AI, improved learning, an electromagnetic-pulse Gamma System and larger special equipment.",
    "Kazuya’s escalating war provides the setting for deploying Jack-8 to strengthen G Corporation’s control. Jane is its creator; earlier Jacks represent technical and emotional inheritance, not a biological family.",
  ],
  [
    "G社のジャック系列の新型試作機。開発者ジェーンは以前ジャックに命を救われ、理想の機体を目指して研究を続ける。",
    "主力兵器となった後も進化を追求し、ジャック7を超えるAIと学習機能、電磁パルスを軸にしたガンマシステム、大型装備を追加した。",
    "一八の侵攻の混乱の中、支配を強めるため戦場に投入される。ジェーンは開発者、旧型との関係は技術と記憶の継承であって人間の血縁ではない。",
  ],
);
add(
  "jun",
  [
    "准从小便能与动物沟通，后来成为自然保护组织的野生动物走私调查员。她因一八涉嫌动物走私而追踪他，两人在第二届铁拳大会相遇并相互吸引，之后准怀上了仁。",
    "她返回故乡屋久岛，在远离人群的山林中抚养仁。仁十五岁时，斗神突然袭击，准由此失踪；官方背景将这段经历定位在《铁拳 8》约七年前。",
    "“失踪”不能直接等同于死亡。准留给仁的武术与精神支撑贯穿后续故事，《铁拳 8》主线与追加内容继续揭示她的去向和在父子命运中的作用。",
  ],
  [
    "Jun could communicate with animals from childhood. As a wildlife-smuggling investigator, she pursued Kazuya and met him during the second tournament. Their attraction led to Jin’s birth.",
    "She raised Jin in the remote mountains of Yakushima. Ogre attacked when Jin was fifteen, and Jun disappeared; the official TEKKEN 8 background places this approximately seven years earlier.",
    "Disappearance is not confirmation of death. Her martial tradition and memory continue to guide Jin, while the main story and additional material revisit her whereabouts and influence on the family.",
  ],
  [
    "幼い頃から動物と心を通わせる力を持ち、自然保護団体の密輸監視官となった準。動物密輸を疑われる一八を追い、第二回大会で惹かれ合って仁を身籠る。",
    "故郷屋久島の山奥で仁を育てたが、15歳の彼とオーガの襲撃を受け消息不明となる。8の公式背景では約7年前の出来事である。",
    "消息不明は死亡確定ではない。残した武術と想いは仁を支え続け、本編や追加の物語で彼女の行方と家族への影響が再び描かれる。",
  ],
);
add(
  "king",
  [
    "现任豹王是一位戴着豹头面具的职业摔角手，同时经营儿童福利机构。系列中的初代豹王与现任豹王是不同人物，不能因为共用名号而合并经历。",
    "随着 G 公司与三岛财阀的战争扩大，需要援助的儿童急剧增加。豹王虽然在摔角界是知名的绝对王者，但单靠既有收入已难以回应所有求助。",
    "他希望举办跨出传统摔角圈的新兴表演募集更多资金，寻找认同目标的协力者并继续训练。铠甲王的官方背景还描写了豹王试图阻止他以复仇毁掉人生，甚至主动提出在擂台上先击败自己。",
  ],
  [
    "The current King is a masked professional wrestler who runs an orphanage. He is a different person from the original bearer of the King title; their histories should not be merged.",
    "The corporate war sharply increased the number of children needing help. His fame as wrestling’s dominant champion could no longer meet the growing demand for support.",
    "King planned events beyond conventional wrestling to raise funds and sought allies who shared that aim. Armor King’s biography also describes King trying to stop his revenge, offering himself as an opponent rather than letting vengeance consume him.",
  ],
  [
    "現キングは豹のマスクを着けるプロレスラーで、児童養護施設を運営する。初代キングとは別人であり、同じ名だけで経歴を混同しない。",
    "企業間の戦争で助けを求める子供が増え、絶対王者としての収入だけでは支えきれなくなった。",
    "プロレスの枠を超える興行と協力者を求めて鍛錬する。またアーマーキングの紹介では復讐を止めようと身を挺し、まず自分をリングで倒すよう挑んでいる。",
  ],
);
add(
  "kuma",
  [
    "熊是平八的宠物，也属于铁拳众，曾参与东南亚灾害救援。他认真工作又带着滑稽的个性，逐渐赢得原本害怕他的当地人的信任。",
    "平八与一八决战后失踪，熊一直相信主人会回来。然而 G 公司持续进攻，他赶回三岛财阀大楼援助时，高层已经投降。为保住平八归来的地方，他决心独自继续战斗。",
    "熊穿上平八过去的道服与腰带，模仿主人修炼三岛流。后来救出三岛重工的工程师并着手秘密武器研发。法昆拉姆的背景另提到腐败军官与财阀残党交易，意图让熊成为地区代表；这不是两者自愿结盟的证据。",
  ],
  [
    "Kuma is Heihachi’s pet and a Tekken Force member who worked on disaster relief in Southeast Asia. His diligence and playful character gradually won over people initially afraid of him.",
    "After Heihachi vanished in the confrontation with Kazuya, Kuma kept waiting for his return. G Corporation advanced, and the Zaibatsu surrendered before Kuma could help defend its headquarters.",
    "Determined to preserve a home for his master, Kuma adopted Heihachi’s gi and training. He rescued engineers and began a secret weapon project. Fahkumram’s biography separately describes corrupt officials promoting Kuma through a covert deal; this does not establish a voluntary alliance between the two fighters.",
  ],
  [
    "平八のペットで鉄拳衆の一員。東南アジアの災害救助で働き、真面目さと愛嬌で人々の信頼を得た。",
    "一八との戦いで平八が消えた後も帰還を信じるが、G社の攻勢で財閥はクマの到着前に降伏する。",
    "主人の帰る場所を守るため道着と帯を受け継ぎ、三島流を鍛える。技術者を救って秘密兵器の開発にも着手。ファーカムラムの背景にある地方代表の密約は、二人の自主的な同盟を意味しない。",
  ],
);
add(
  "lars",
  [
    "拉斯是平八未公开承认的儿子，曾任铁拳众军官。他带领许多士兵离开三岛财阀，在与阿丽莎同行和调查的过程中，逐步成为反抗企业军事统治的重要人物。",
    "一八领导的 G 公司掌握世界优势后，拉斯重新组织“尤克特拉希尔”反抗军，与李超狼共同准备武器、人员和战略。",
    "他选择与昔日敌人仁合作，策划“雷光行动”讨伐一八。亲属关系上，一八与拉斯为同父异母兄弟，仁则是他的侄子；这些血缘没有决定他们必须站在同一阵营。",
  ],
  [
    "Lars is Heihachi’s unacknowledged son and a former Tekken Force officer. He led soldiers away from the Zaibatsu and, through his journey with Alisa, became a major opponent of corporate military rule.",
    "As Kazuya’s G Corporation gained power, Lars built the Yggdrasil rebellion with Lee’s support, assembling weapons, personnel and a strategy to resist.",
    "He allied with his former enemy Jin for Operation Lightning. Kazuya is his paternal half-brother and Jin his nephew, but their shared family does not place them on the same side.",
  ],
  [
    "平八の隠し子で元鉄拳衆将校。多くの兵を率いて財閥を離反し、アリサとの旅を経て企業の武力支配に対抗する。",
    "一八のG社が優勢になると、リーと反乱軍ユグドラシルを整え、兵器と戦力を集める。",
    "かつての敵である仁と協力し雷光作戦を立案。一八とは異母兄弟、仁とは叔父と甥の関係だが、血縁と陣営は一致しない。",
  ],
);
add(
  "lee",
  [
    "李超狼曾是平八的养子，在严酷环境中长大，后来成为全球机器人企业 Violet Systems 的经营者。他最初接近反叛的拉斯，是想借其力量报复平八与一八。",
    "拉斯真正追求和平的信念改变了李的动机。两人共同组建尤克特拉希尔，李担当参谋并投入知识与财力。与波斯科诺维奇博士合作开发的大型飞行艇和战斗摩托帮助反抗军获得战果。",
    "为对付连枪械都难以击穿的敌方装甲，他推出适用于近距离格斗的“Violet Suit”。这身战斗服兼顾机器人技术与个人审美，象征他已从单纯的家族复仇者转为反抗军的主动支持者。",
  ],
  [
    "Raised harshly as Heihachi’s adopted son, Lee later became the head of Violet Systems. He initially approached the rebellious Lars as a means of revenge against Heihachi and Kazuya.",
    "Lars’s genuine desire for peace changed his motives. They formed Yggdrasil, with Lee providing strategy, wealth and engineering. A flying vessel developed with Dr. Bosconovitch and combat motorcycles strengthened the rebellion.",
    "Against armor resistant to gunfire, Lee introduced the close-combat Violet Suit. Combining humanoid technology with his personal aesthetics, it represents his active commitment beyond family revenge.",
  ],
  [
    "平八の養子として厳しい環境で育ち、後にヴァイオレット・システムズを経営する。初めは平八と一八への復讐の駒としてラースに接近した。",
    "平和を求めるラースに共感してユグドラシルを共に設立し、参謀と資金・技術の支援を担う。博士との飛行艇開発や戦闘バイクが反乱軍を強化した。",
    "銃器を通さない装甲への対策として格闘用ヴァイオレットスーツを投入。技術と美学を備えた鎧は、復讐を超える協力の姿を示している。",
  ],
);
add(
  "leo",
  [
    "里奥的父亲尼克拉斯是考古学家，母亲艾玛是遗传学研究者。里奥继承了父亲教授的八极拳和母亲的求知精神，调查约一年前母亲离奇事故死亡的真相。",
    "冒险取得的 G 公司机密显示，艾玛参与恶魔因子研究，一八曾下令处理失去利用价值的重要研究员。财阀又公开了一八的恶魔身份，使里奥认为研究与母亲之死可能存在联系。",
    "但官方背景把“是一八下令杀害母亲”写作里奥依据证据形成的判断，并未给出司法式最终结论。里奥想起失踪父亲关于冷静寻找真相的教导，选择继续调查而不是立即被复仇冲昏头脑。",
  ],
  [
    "Leo is the child of archaeologist Niklas Kliesen and genetic researcher Emma. Using the martial training learned from Niklas and Emma’s inquisitive mindset, Leo investigates the suspicious accident that killed Emma roughly a year earlier.",
    "Stolen G Corporation records establish her Devil-factor research and Kazuya’s orders to dispose of researchers no longer useful. News of Kazuya’s Devil identity makes Leo suspect a connection to Emma’s death.",
    "The official background presents Kazuya’s responsibility as Leo’s conclusion from the clues, not a fully adjudicated fact. Remembering the missing Niklas’s advice to seek truth calmly, Leo continues investigating rather than rushing into revenge.",
  ],
  [
    "考古学者ニクラスと遺伝子研究者エマの子。父の八極拳と母の探究心を頼りに、約一年前の母の不自然な事故死を追う。",
    "G社の機密から母のデビル因子研究と、一八による不要な研究員の処分命令を知る。一八のデビルの公表で、母の死との関連を疑うようになる。",
    "ただし公式背景は一八の責任をレオの推論として描く。行方不明の父の教えを思い出し、感情に流されず確かな真実を求めて調査を続ける。",
  ],
);
add(
  "leroy",
  [
    "李洛伊以咏春拳清除了支配纽约的帮派，被居民视为英雄。他发现半个世纪前摧毁故乡生活的大规模帮派冲突背后有三岛财阀介入，于是参加大会追究根源。",
    "平八失踪后，G 公司击败财阀，却继续向世界扩张。李洛伊得知其领导者是一八，再度与爱犬 Sugar 一起行动，希望夺回平静生活。",
    "他曾击败冯威，并批评其只有力量而没有心的武术观，这在冯威的官方背景中得到明确记载。《铁拳 8》开场的纽约战火也让他的城市守护立场直接进入主线。",
  ],
  [
    "Leroy freed New York from gang domination through Wing Chun and became a local hero. Discovering the Zaibatsu’s involvement in the gang conflict of fifty years earlier, he entered the tournament to confront its source.",
    "Heihachi’s disappearance allowed G Corporation to win, but its invasion continued. Learning that Kazuya led it, Leroy again took action with his dog Sugar to restore peaceful life.",
    "Feng’s official biography confirms Leroy defeated him and challenged his strength-only philosophy. The attack on New York brings Leroy’s role as a protector directly into the opening of TEKKEN 8.",
  ],
  [
    "詠春拳でニューヨークをギャングから解放した英雄。半世紀前の抗争の裏に財閥がいたと知り、元凶を追って大会に参加する。",
    "平八が消えてG社が勝っても侵攻は止まらず、一八が率いると知って愛犬シュガーと再び立ち上がる。",
    "フェンの公式背景では彼を破り、心を伴わない武術を批判したことも明記される。ニューヨークへの攻撃により街を守る立場が8の冒頭に重なる。",
  ],
);
add(
  "lili",
  [
    "莉莉是摩纳哥石油富豪的女儿，热爱战斗但不愿让爱好和平的父亲知道。她搭乘私人飞机挑战各地高手，以自学技巧不断磨练自己。",
    "她把曾两度击败自己的飞鸟视作永远的对手，甚至拿零用钱买下风间家的道场，装饰玫瑰并寄去挑战书。她与爱猫 Salt 相伴，期待看见飞鸟气恼的反应。",
    "官方角色模式还用她与阿苏塞娜的饮品竞争作为支线例子。此类轻松外传与主线战争属于不同叙事层次，不能把某位角色获胜的虚构结局自动当作正史。",
  ],
  [
    "Lili is a Monaco oil magnate’s daughter who loves fighting while hiding it from her peace-loving father. Traveling by private jet, she challenges strong opponents and refines her self-taught style.",
    "She considers Asuka, who defeated her twice, an enduring rival. Buying and decorating the Kazama dojo with roses, she sends another challenge and enjoys imagining Asuka’s reaction beside her cat Salt.",
    "The official story-mode page also cites her beverage rivalry with Azucena as a character-episode example. Such playful side scenarios are a different layer from the war narrative and do not make every winning ending canonical.",
  ],
  [
    "モナコの石油王の娘。平和を愛する父に隠れて私有機で強者を訪ね、自分で磨いた技を試している。",
    "二度敗れた飛鳥を永遠のライバルと考え、風間道場を買収してバラで飾り、挑戦状を送る。愛猫ソルトと共にその反応を楽しみにする。",
    "公式モード紹介ではアズセナとの飲み物争いも外伝例として挙げる。こうしたifの結末は戦争の主線とは区別し、全てを正史にはしない。",
  ],
);
add(
  "xiaoyu",
  [
    "晓雨是一位中国武术家，对仁怀有感情。仁失踪后，她潜入三岛财阀大楼取得搜寻资料，并沿着稀少的线索旅行寻找他。",
    "半年过去，所有线索耗尽也未能重逢，她仍想当面确认仁的真实想法。熊猫选择一路陪伴，既担任保护者，也照顾旅行与生活。",
    "克劳迪奥原本想利用她找到仁，后来受她的信任感动而坦白并合作。她又在天狼星圣堂照顾被阿萨谢尔力量折磨的扎菲娜，形成贯穿《铁拳 8》主线的互助关系。",
  ],
  [
    "Xiaoyu is a Chinese martial artist with feelings for Jin. After he disappeared, she infiltrated the Zaibatsu building for search records and traveled following the few available clues.",
    "Half a year passed without a reunion, but she still wanted to hear Jin’s true intentions herself. Panda accompanied her as protector and traveling companion.",
    "Claudio initially tried to use her search, then confessed and joined it. Xiaoyu also cared for Zafina at the Sirius sanctuary, creating an alliance central to their TEKKEN 8 paths.",
  ],
  [
    "仁に想いを寄せる中国拳法家。失踪した彼を探すため財閥ビルから捜索資料を入手し、僅かな手がかりを追って旅を続けた。",
    "半年経っても再会できないが、仁に確かめたいことがあるため諦めない。パンダも護衛と旅の仲間として同行する。",
    "利用しようとしていたクラウディオは後に告白して捜索へ協力する。また聖堂でザフィーナを介抱し、8の主線に関わる助け合いが生まれる。",
  ],
);

add(
  "law",
  [
    "马歇尔·洛是武术高手与道场经营者，也是保罗的好友。儿子的摩托事故带来巨额债务，他奔波筹款，忽略道场经营，学员人数随之减少。",
    "为扭转局面，他外出寻找可以托付道场的师范，但交涉接连失败；离开期间，道场又作为债务抵押被没收。",
    "身无分文的洛把希望放在有奖金的格斗大会，与保罗约定无论谁获胜都平分奖金，两人到山中训练。史蒂夫也受他们鼓励重拾斗志，但礼貌拒绝了山中集训。",
  ],
  [
    "Marshall Law is a martial artist and dojo owner, and Paul’s close friend. His son’s motorcycle accident created substantial debts. Fundraising distracted him from the dojo and students left.",
    "He searched for a skilled instructor to run the school, but negotiations failed and creditors seized the dojo while he was away.",
    "Penniless, Law turned to prize tournaments and agreed to split winnings with Paul. They trained in the mountains. They also helped Steve regain motivation, although Steve declined their mountain retreat.",
  ],
  [
    "道場を経営する武術家でポールの親友。息子のバイク事故の借金返済に追われ、経営がおろそかになり門下生が減った。",
    "任せられる師範を探す旅も交渉に失敗し、その間に道場が差し押さえられる。",
    "一文無しとなり賞金大会に望みを託し、ポールと山分けを約束して山籠もりする。二人はスティーブも励ましたが、彼は山での修業は断った。",
  ],
);
add(
  "nina",
  [
    "妮娜是被称作“沉默刺客”的职业杀手，曾受三岛财阀雇佣并指挥铁拳众。负责回收仁的行动失败后，她离开财阀，一度恢复自由接单。",
    "一八的 G 公司取得世界优势后将她招募为直属部下，并把军队指挥交给她。冯威的背景也记录了她以安排再战为条件招揽战力。",
    "她与安娜的姐妹冲突及史蒂夫的身世是不同于雇佣关系的个人线索。史蒂夫由她的遗传资料产生，属于遗传上的母子，但妮娜并未因此接受母亲身份；安娜的未婚夫事件则让姐妹矛盾再度升级。",
  ],
  [
    "Nina is the professional assassin known as the Silent Assassin. She once commanded Tekken Force for the Zaibatsu, then left after failing an operation to retrieve Jin.",
    "After a period of freelance work, Kazuya recruited her as a direct subordinate and commander of G Corporation forces. Feng’s biography also records her recruiting him through a promised rematch.",
    "Her personal connections are separate from employment: Steve was created using her genetic material, but she does not accept a maternal role. Anna’s fiancé’s death and their competition for a G Corporation position reignite the sisters’ hostility.",
  ],
  [
    "サイレント・アサシンと呼ばれる殺し屋。財閥で鉄拳衆を指揮したが、仁の回収失敗を機に離脱し、フリーに戻った。",
    "その後一八に招かれG社軍の指揮を任される。フェンの背景にも、再戦を条件に彼を勧誘したことが記される。",
    "個人史ではアンナとの姉妹の確執とスティーブの出自が重要。彼は遺伝子上の息子だが母として受け入れず、アンナの婚約者の死とG社での地位も新たな対立を生む。",
  ],
);
add(
  "panda",
  [
    "熊猫是晓雨的宠物兼保镖。晓雨为了寻找失踪的仁离家不归，熊猫担心她的安全，一路追查到三岛财阀大楼。",
    "得知晓雨取得仁的搜寻记录、打算环游世界追寻线索后，熊猫决定同行。她希望晓雨既能完成寻找，也能享受旅行、观光与食物，并帮她安排服装。",
    "半年过去仍然没有找到仁，晓雨也不肯放弃。熊猫于是决定陪到底。她与熊的角色互动不应被直接写成已经确立的恋爱关系，更不涉及同一物种的血缘。",
  ],
  [
    "Panda is Xiaoyu’s pet and bodyguard. When Xiaoyu left to find the missing Jin, Panda tracked her to the Zaibatsu building out of concern.",
    "Learning that Xiaoyu planned a worldwide search using recovered records, Panda joined her. She wanted her companion to enjoy sightseeing and food as well, and helped coordinate her clothes.",
    "After six months without finding Jin, Panda chose to stay until the end. Interactions with Kuma should not be treated as confirmation of a mutual romance or a family relationship.",
  ],
  [
    "シャオユウのペット兼護衛。仁を探しに家を出た彼女を心配し、財閥ビルまで追いかけた。",
    "捜索資料を頼りに世界を巡ると聞き、旅行や食事も楽しめるように同行し、服のコーディネートも手伝う。",
    "半年経っても仁に会えず、なお諦めないシャオユウに最後まで付き合うと決める。クマとのやり取りを相思相愛や血縁の確定にはしない。",
  ],
);
add(
  "paul",
  [
    "保罗是一心要成为宇宙最强的热血格斗家，与洛长期结伴参加大会。在第三届大会中，他击败了斗神的第一形态，却不知道其随后变身并由仁击败，因此那场胜利与最终冠军需要区分。",
    "第七届大会原本是他争取巨额奖金的机会，但主办者失踪使赛事中断，他没能取得预期报酬，生活陷入窘迫。",
    "他将希望寄托于下一次奖金赛事，和洛约定平分奖金并在山中训练。两人也鼓励迷失目标的史蒂夫，体现他们在竞争之外的友谊。",
  ],
  [
    "Paul wants to be the strongest fighter in the universe and often competes alongside Law. In the third tournament he defeated Ogre’s first form, but Jin defeated its transformed form afterward; that victory is distinct from overall tournament resolution.",
    "The seventh tournament promised prize money, but its interruption after the organizer disappeared left Paul without the payment he expected.",
    "He agreed to split the next winnings with Law and trained in the mountains. Their encouragement also helped Steve recover a sense of purpose, showing friendship beyond competition.",
  ],
  [
    "宇宙一を目指す熱血格闘家でロウの親友。第三回でオーガの第一形態を倒すが、その後の第二形態は仁が撃破したため、途中の勝利と大会全体の決着は区別する。",
    "第七回で賞金を狙うも主催者失踪により中断し、期待した報酬を得られず困窮した。",
    "次の賞金をロウと山分けする約束で山中の修業に臨む。二人は目的を失ったスティーブも励まし、競争を超えた友情を示す。",
  ],
);
add(
  "raven",
  [
    "雷文是国际协力联合军独立部队的特工，使用忍术执行情报任务，以阻止各地冲突。他意识到三岛财阀与 G 公司的战争会让世界继续恶化。",
    "为适应更艰难的任务，他申请回到过去的忍术师父身边训练。上级批准，但最多只能替他填补半年的空缺，他于是集中强化已有的技术。",
    "数月后，他掌握影分身奥义，并收到归队暗号，立即离开修炼地投向新的战场。维克多是其组织的创立者与领导者，Master Raven 则属于这套情报体系，不能把两人等同为雷文自己。",
  ],
  [
    "Raven is an agent of the international forces’ independent unit, using ninjutsu for intelligence and conflict prevention. He anticipated worsening instability from the corporate war.",
    "He requested retraining with his former ninjutsu teacher. Command granted at most six months away, so he concentrated on developing existing techniques.",
    "After mastering shadow clones, he received the recall signal and returned to duty. Victor founded and leads the organization; Master Raven is another agent in its structure, not the same individual as Raven.",
  ],
  [
    "国際協力連合軍の独立部隊に属する忍術諜報員。企業間戦争によって世界の混迷が深まると考え、自分も強化すべきだと判断した。",
    "以前の師のもとへ再修業を願い出る。許される欠員は最長半年で、得意な術の強化に集中した。",
    "影分身の奥義を得た後、帰還の符丁を受けて戦場へ戻る。組織の創設者はヴィクターで、マスターレイヴンは同組織の別の人物である。",
  ],
);
add(
  "dragunov",
  [
    "德拉古诺夫是以战斗桑搏和高效作战闻名的俄罗斯军人，被称作“白色死神”。他带着特定任务参加大会，但平八失踪使赛事中断。",
    "返回部队后，他因长期表现获得人生首次长假。传闻中连睡觉都不休息的军人，却轻快地回到书房，取出一本令同僚畏惧的旧笔记。",
    "这并不是杀戮名单，而是他一直记录的“长假想做的事”。喝着自制热饮、哼着歌复查清单后，他选中最难实现的一项开始行动。官网没有把这个愿望公开为一条确定的主线军事任务，档案保持其轻松而神秘的性质。",
  ],
  [
    "Dragunov is a Russian combat-sambo specialist known as the White Reaper. His tournament mission was interrupted when Heihachi disappeared.",
    "His service earned him a first extended vacation. The supposedly tireless soldier returned home cheerfully and retrieved an old notebook his colleagues feared as a death list.",
    "It was actually a list of things to do on a long holiday. Drinking a homemade warm beverage and humming, he chose a particularly difficult wish to pursue. The official biography does not identify it as a definite military plot objective.",
  ],
  [
    "白き死神と呼ばれるロシアのコンバットサンボ使い。目的を持って大会に参加するが平八失踪で中断する。",
    "帰還後に働きを評価され、初めて長期休暇を得る。書斎へ戻り、同僚が死神のリストと恐れる古い手帳を取り出した。",
    "正体は長期休暇にやりたいことの一覧だった。自家製の温かい飲み物と鼻歌で見直し、難しい願いの実現へ動く。公式紹介は具体的な軍事目的とは断定しない。",
  ],
);
add(
  "shaheen",
  [
    "沙欣在私人军事公司工作，调查好友萨利姆的离奇死亡。他通过 G 公司中东分部高层获得一八是幕后黑手的线索。",
    "十三年前，失去家人的沙欣在市场用父亲传授的杀人技巧救下同龄的萨利姆。萨利姆建议他把力量用于保护人，并以护卫名义让家族帮助他。两人互相尊重着成长，分别成为军事专家与石油企业领袖。",
    "沙欣返回故乡报告调查所得，临行时萨利姆的弟弟扎里夫把兄长的宝剑交给他，嘱托延续其志向。他携遗物立誓阻止 G 公司的暴行；这条线是保护与追责，而不只是争夺冠军。",
  ],
  [
    "Shaheen works for a private military company and investigates his friend Salim’s suspicious death. A G Corporation regional executive identifies Kazuya as the figure behind it.",
    "Thirteen years earlier, after losing his family, Shaheen saved Salim from assassins using skills taught by his father. Salim urged him to protect people and his family supported him. They grew into a military specialist and an oil-industry leader.",
    "After Shaheen reported his findings, Salim’s brother Zarif entrusted him with Salim’s sword and ideals. Carrying the keepsake, Shaheen resolved to oppose G Corporation’s abuses.",
  ],
  [
    "民間軍事会社で働き、親友サリームの不審死を追う。G社中東幹部との交渉で一八が黒幕だと聞き出す。",
    "13年前、家族を失った彼は父に教わった技でサリームを暗殺者から救った。人を守る盾になれと励まされ援助を受け、二人は軍事の専門家と石油企業の長へ成長する。",
    "調査を親族に報告した後、弟ザリーフから兄の宝剣と志を託される。形見を携え、G社の横暴を止めると誓った。",
  ],
);
add(
  "steve",
  [
    "史蒂夫是善于掌控比赛的世界中量级拳击冠军。他知道自己曾是三岛财阀设施中的实验对象，仍不断寻找真正的父母。",
    "与妮娜相遇后，他得知自己由她的遗传资料产生。遗传意义上两人是母子，但妮娜拒绝承认情感上的母子关系。这使一心寻找过去的史蒂夫失去长久的目标。",
    "训练伙伴保罗与洛邀他再次参赛、平分奖金，帮助他意识到自己仍能用双拳开创未来。他感谢两人，但拒绝旧式山中集训，转而探索新的拳击风格与人生第二回合。",
  ],
  [
    "Steve is a world middleweight boxing champion. Discovering that he had been an experimental subject at a Zaibatsu facility did not stop his search for his parents.",
    "Nina revealed he was created from her genetic material. Although biologically mother and son, she refused the emotional relationship. His lifelong search reaching that painful answer left him without direction.",
    "Paul and Law encouraged him to compete again and split the prize, reminding him that his fists could shape his future. He thanked them but declined mountain training and began exploring a new fighting style.",
  ],
  [
    "世界ミドル級王者。財閥の施設で育てられた被験体と知っても本当の親を探し続けた。",
    "ニーナとの再会で彼女の遺伝子から作られたと知るが、遺伝上の母は息子として受け入れない。過去を知る目的を失い、虚脱状態となる。",
    "ポールとロウの大会への誘いで、自分の拳が未来を開けると気づく。山籠もりは断り、新たな戦い方を探し始めた。",
  ],
);
add(
  "victor",
  [
    "维克多出身法国骑士后裔家庭，受海军高官父亲影响参军。遭嫉妒而屡次被派往危险任务，他用向东方佣兵学习的技法完成任务并生还，代号“幽灵雷文”逐渐成为传奇。",
    "为保护更多人，他转入国际组织，预见企业私军可能统治世界，借助谈判创建能够独立决策行动的国际协力联合军。他训练雷文部队并部署全球情报网络。",
    "当 G 公司侵略扩大，他不再只留在指挥位置，亲自穿上定制服装、配备先进光学兵器回到前线。雷文与 Master Raven 的组织背景因此与他连接，而不是与三岛血统连接。",
  ],
  [
    "Victor descends from French knights and followed his naval-officer father into service. Dangerous assignments and training with an eastern mercenary forged the legend of Phantom Raven.",
    "He moved into international service to protect more people, anticipating a future dominated by corporate armies. Through negotiation he established independent international forces and personally trained the Raven intelligence unit.",
    "As G Corporation’s invasion spread, Victor returned from command to the front line in a tailored suit and advanced optical weapons. Raven and Master Raven connect to him through that organization, not Mishima blood.",
  ],
  [
    "騎士の血を引き、海軍高官の父の影響で入隊したヴィクター。危険な任務と東洋の傭兵から学んだ技によって、ファントムレイヴンの伝説を築く。",
    "多くを救うため国際組織へ移り、企業軍の支配を予見して独立判断できる軍を創設。自らレイヴン部隊を訓練し諜報網を広げた。",
    "G社の侵攻が広がると指揮だけでなく自ら前線へ戻る。レイヴン達との関係はこの組織に由来し三島家の血縁ではない。",
  ],
);
add(
  "yoshimitsu",
  [
    "吉光是继承卍忍术的义贼集团卍党首领。为了难民救助计划的出资者，他在半年前搜寻涉及三岛家过去的古文书，并潜入传说中曾封印妖魔的地下洞窟。",
    "找到文书时，祖传妖刀吉光与洞窟的妖气共鸣，猛烈侵蚀他的精神。他刺伤自己让刀吸血才暂时压下暴走，又向长老学习封魔术，但仍不断听见邪恶的呼唤。",
    "他决定寻找呼声源头，以根除妖刀异常，并换上盟友波斯科诺维奇博士研发的新甲胄。此外，他救下挑战一八失败的艾迪，与莉迪亚合作；国光则为夺取妖刀而追逐他，两人的关系来自母辈遗留的宿敌目标。",
  ],
  [
    "Yoshimitsu leads the Manji clan of benevolent thieves. For a benefactor funding refugee aid, he searched for Mishima records and entered a cave associated with an old demon-sealing legend.",
    "Finding the document caused his inherited cursed sword to resonate with hostile energy and erode his mind. Feeding it his own blood and learning sealing arts brought only partial control; an evil call persisted.",
    "He equipped new armor from Dr. Bosconovitch and followed the sword toward that source. He also rescued Eddy and cooperated with Lidia. Kunimitsu pursues his sword on behalf of her ailing mother, adding a different inherited rivalry.",
  ],
  [
    "義賊集団卍党の党首。難民支援の出資者の依頼で三島家の古文書を探し、妖魔封じの伝説がある洞窟へ入った。",
    "文書を発見した時、妖刀が妖気と共鳴して精神を侵す。自らの血を与え封魔術を学んでも不安定さと邪悪な呼び声は残った。",
    "博士の新甲冑で原因を追うほか、エディを救出しリディアに協力する。州光は母のため妖刀を狙い、別の継承された対立も生まれている。",
  ],
);
add(
  "zafina",
  [
    "扎菲娜出身自古守护封印的驱邪家族，以敏锐灵感从事占星。仁与一八两颗“凶星”的冲突让阿萨谢尔复活；仁虽击败它，始祖不灭的精神仍可能再次出现。",
    "为延缓复活，她以家传秘术把精神封入自己的左臂，但其力量超出预测，多次几乎夺去她的身心控制。她耗尽体力抵达天狼星圣堂，在晓雨的照顾和克劳迪奥施加的新封印下醒来。",
    "两人知道真相后答应帮助。扎菲娜在组织庇护下寻找改变毁灭未来的方法，最终看到一条可能之路，却知道必须付出重大代价。她的左臂封印是《铁拳 8》恶魔主线的关键，而不是独立的装饰能力。",
  ],
  [
    "Zafina comes from an ancient family charged with containing evil and works as an astrologer. Jin and Kazuya’s clash revived Azazel; its spirit survived Jin’s victory.",
    "She sealed that spirit in her left arm to delay its return, but its strength repeatedly threatened her body and mind. Exhausted, she reached the Sirius sanctuary, where Xiaoyu cared for her and Claudio reinforced the seal.",
    "They promised help after hearing the truth. Under their protection she sought a future that escaped catastrophe, finding one possibility that demanded a heavy sacrifice. The seal connects her directly to TEKKEN 8’s Devil conflict.",
  ],
  [
    "古代から禍を封じる一族の占星術師。仁と一八の衝突でアザゼルが復活し、仁の勝利後も精神体は残った。",
    "復活を遅らせるため左腕に封じるが制御を失いかけ、聖堂へたどり着く。シャオユウの介抱とクラウディオの封印で目を覚ました。",
    "真実を知った二人の助けで未来を探り、破滅を避ける一筋の可能性を見いだす。ただし大きな犠牲が必要だった。左腕の封印は8のデビルの物語に直接関わる。",
  ],
);
add(
  "clive",
  [
    "克莱夫来自《最终幻想 XVI》的瓦利斯泽亚，是罗扎利亚的第一王子，也是能够寄宿召唤兽力量的显化者。他的行动以创造让人作为人活着的地方为信念。",
    "《铁拳 8》的官方客串背景设置在他准备最终决战之前：他突然受到强烈精神干涉而昏迷，醒来时听见伙伴托加尔的叫声，却身处陌生世界。",
    "意识到此地不是瓦利斯泽亚后，他开始寻找返乡方法，希望回到吉尔与约书亚身边。这是跨作品客串设定，不能据此声称《最终幻想 XVI》原作结局已被铁拳正史改写，也没有公开确认他属于三岛家族。",
  ],
  [
    "Clive comes from FINAL FANTASY XVI’s Valisthea: the first prince of Rosaria and a Dominant who bears an Eikon’s power. He fights for a place where people can live as people.",
    "The official TEKKEN guest setup takes place before his final battle. A powerful mental intrusion leaves him unconscious; Torgal’s cry wakes him in unfamiliar surroundings.",
    "Realizing he is no longer in Valisthea, he seeks a way back to Jill and Joshua. This crossover premise does not rewrite the original game’s ending or establish a Mishima family connection.",
  ],
  [
    "FFXVIのヴァリスゼアから来たロザリア第一王子でドミナント。人が人として生きられる場所のため戦う。",
    "鉄拳での客演は最終決戦前の設定。強い精神干渉で気を失い、トルガルの声で知らない土地に目覚める。",
    "元の世界ではないと知り、ジルとジョシュアのもとへ帰る方法を探す。客演の設定を原作の結末改変や三島家の血縁の証明にはしない。",
  ],
);
add(
  "eddy",
  [
    "艾迪长期为父亲之死向一八复仇，练习卡波耶拉。师父罹患绝症后，他向当时的财阀头首仁求助，以担任铁拳众指挥、执行破坏任务换取治疗。",
    "师父最终仍然去世。艾迪退出铁拳众并攻入 G 公司大楼挑战一八，却被击败，濒死时被吉光救出。康复后，他与十年未见的莉迪亚重逢，对方请求他协助解放世界。",
    "“人能重新站起来”的信念让他重新训练并反省过去。他不再只为复仇而战，而选择救助更多人，以此回应父亲和师父的教导，开始赎罪。莉迪亚的官方背景明确补全了艾迪介绍中最初未直接点名的重逢者。",
  ],
  [
    "Eddy devoted much of his life to avenging his father against Kazuya. When his capoeira teacher became terminally ill, he served Jin’s Tekken Force in exchange for treatment, committing sabotage despite knowing its moral cost.",
    "The teacher died regardless. Eddy left and attacked G Corporation’s tower, but Kazuya defeated him. Yoshimitsu rescued him, and after recovery he reunited with Lidia after ten years; she asked him to help free the world.",
    "Encouraged that people can rise again, Eddy retrained and reconsidered his past. He chose protecting people over revenge as a tribute to his father and mentor. Lidia’s biography explicitly identifies the reunion only indirectly described in Eddy’s own introduction.",
  ],
  [
    "父の仇一八への復讐に人生を費やしたエディ。師の治療と引き換えに仁の鉄拳衆を率い、罪を自覚しながら破壊工作を行った。",
    "師が亡くなると離脱してG社へ突入するが一八に敗れ、吉光に救われる。回復後、10年ぶりにリディアと再会し世界を救う協力を頼まれた。",
    "人は再び立てるという言葉から鍛え直し、復讐より人々を救う戦いを選ぶ。自身の紹介で伏せられた再会相手はリディアの公式背景で補われる。",
  ],
);
add(
  "heihachi",
  [
    "平八是三岛财阀的建立者，以军事实力、权力欲与残酷手段闻名。他与亲生儿子一八之间的反复决斗，从悬崖到火山，不断把家族争端扩大为世界战争。",
    "他还曾收养李超狼，并在仁投奔后教导他，却在第三届大会末背叛仁。拉斯和蕾娜与他有关的身世必须分别从背景资料与《铁拳 8》结尾理解，不能把所有三岛相关人物都混成同一代。",
    "现行官网背景以悬念收束：平八在与一八的最终决斗中败北，被投入熔岩，本应死亡。《铁拳 8》的追加剧情再解释他的归来；这与第七作结尾当时的视角不同，不能简单删除原来的战败事件。",
  ],
  [
    "Heihachi founded the Mishima Zaibatsu and became known for military power, ambition and ruthless acts. His repeated clashes with Kazuya expanded a family feud into global conflict.",
    "He adopted Lee, trained Jin and betrayed him after the third tournament. Lars’s parentage and Reina’s later revelations belong to distinct branches and generations of the family.",
    "The current official biography ends on the apparent contradiction: Kazuya defeated him and threw him into lava, where he should have died. Additional TEKKEN 8 story material addresses his return without erasing that earlier defeat.",
  ],
  [
    "三島財閥の創設者で、軍事力と非道な権力追求で知られる。息子一八との決闘は家族の確執を世界規模に広げた。",
    "リーを養子とし、仁を教えた後に裏切る。ラースの出自と麗奈の後の核心も別の枝・世代として整理する。",
    "現行の公式紹介は、一八に敗れて溶岩に落ち死亡したはず、という謎を残す。8の追加物語は帰還を扱うが、7での敗北そのものを消すわけではない。",
  ],
);
add(
  "lidia",
  [
    "莉迪亚是传统空手道世界冠军与波兰首相。童年卷入针对祖父的炸弹袭击，失去父亲并在左眼留下伤痕，使她坚信不能向不公的力量屈服。",
    "她既公开反对三岛财阀与 G 公司，又意识到道德立场需要实际力量保护。她与吉光建立情报合作，发现旧识艾迪已成为铁拳众指挥后，安排救援并与他十年后重逢。",
    "了解艾迪犯罪背后的困境，她决定不能放弃曾走错路的人。两人争取部分铁拳众改悔，建立混成队伍；同时她推动国际社会制裁 G 公司，并继续扩充战力与制定行动。",
  ],
  [
    "Lidia is Poland’s prime minister and a traditional-karate world champion. A childhood bombing aimed at her grandfather killed her father and scarred her eye, shaping her refusal to yield to unjust power.",
    "She opposed the corporate armies but knew principles required practical strength. Cooperation with Yoshimitsu brought intelligence about her old acquaintance Eddy; she arranged his rescue and their reunion after ten years.",
    "Understanding his circumstances, Lidia sought to reclaim people who had served unjust forces. With Eddy she persuaded some Tekken Force members to change sides, built a mixed force and promoted international sanctions while preparing for confrontation.",
  ],
  [
    "波蘭首相で空手世界王者。祖父を狙った爆破で父を失い左目に傷を負った経験から、不当な力に屈しないと決めた。",
    "企業軍に対抗するには理念だけでなく力が必要と考え、吉光と情報面で協力する。旧知のエディの現状を知り救援を手配し10年ぶりに再会した。",
    "彼の事情を理解し、過ちを犯した人にも希望を示す方針を得る。鉄拳衆の一部も改心させ混成部隊を作り、制裁と決戦準備を進めた。",
  ],
);
add(
  "anna",
  [
    "安娜是妮娜的妹妹，曾退休并担任 G 公司作战参谋。在准备与公司高层结婚时，婚礼当天未婚夫被妮娜杀害，她也被公司逐出。",
    "通过旧情报网调查后，她发现未婚夫在地下世界犯下诸多恶行，一度怀疑姐姐是否意外替她除去了祸害。但得知妮娜取代自己的 G 公司职位，短暂的感谢又化为复仇欲。",
    "她向武器专家 Nakamura 博士订制可携带、可变形应对多人的重火器“Lovely Tom”，并重新调整格斗风格，准备突破 G 公司警戒打败妮娜。官网把妮娜的善意写作安娜的猜测，未确认是姐姐的真实动机。",
  ],
  [
    "Anna is Nina’s younger sister. Retired from assassination and serving as a G Corporation strategist, she was about to marry an executive when Nina killed her fiancé on the wedding day and Anna was expelled.",
    "Investigation exposed the fiancé’s criminal behavior. Anna briefly wondered whether Nina had protected her, but learning that Nina had taken her position reignited revenge. The protective motive remains Anna’s speculation.",
    "She commissioned Dr. Nakamura’s compact transforming firearm, Lovely Tom, and rebuilt her fighting style around it. Her goal is to breach G Corporation security and defeat her sister.",
  ],
  [
    "ニーナの妹。暗殺を引退してG社参謀となり幹部と結婚するはずだったが、式の日に姉が婚約者を殺し、自分も追放された。",
    "調査で相手の悪事を知り、姉が守ったのかと一瞬考える。しかし地位も奪われたと知り復讐心を燃やす。善意はアンナの推測であり断定しない。",
    "Nakamura博士に変形重火器ラブリー・トムを注文し戦い方を見直す。G社の警備を越えニーナを屈服させることを狙う。",
  ],
);
add(
  "armor_king",
  [
    "现任铠甲王是已故初代铠甲王的弟弟，两人共用名号但不是同一个人。他为被杀的兄长追逐宿敌，却在第七届大会中断后一直等不到清算的机会。",
    "豹王来到他面前，希望他放下复仇。豹王是兄长的弟子，也曾经历复仇与自我克服，但铠甲王不接受劝告。豹王于是要求他先在擂台击败自己。",
    "铠甲王并不因这层阻拦而恨豹王，但认为任何障碍都必须清除。他解封兄长传授、过去被当成禁招的犯规技巧，为打倒现任冠军和完成未来的复仇而战。",
  ],
  [
    "The current Armor King is the younger brother of the deceased first bearer of the title. Seeking revenge for his brother, he entered the seventh tournament but its interruption denied the confrontation.",
    "King, his brother’s student, tried to persuade him to abandon revenge. When words failed, King challenged him to win in the ring first.",
    "Armor King does not hate King for the connection, but refuses to let any obstacle stop him. He releases previously forbidden foul techniques learned from his brother to defeat the champion and continue toward his enemy.",
  ],
  [
    "現アーマーキングは亡くなった初代の弟で、同じ名でも別人。兄の仇を追うが第七回の中断で決着の機会を失う。",
    "兄の弟子キングが復讐を止めようと説得するが拒否され、まずリングで自分を倒すよう挑む。",
    "キングを憎んではいないが障害は越えると決め、兄に教わった禁じ手を解く。王者を倒した先の復讐を見据えて戦う。",
  ],
);
add(
  "fahkumram",
  [
    "法昆拉姆曾是泰国全民英雄与不败泰拳冠军。他破坏腐败军官安排的假赛后被拘禁，妻女也被扣为人质，迫使他作为军方武器行动。",
    "他曾被派去参加摧毁三岛财阀的大会，但赛事因平八死亡消息而中断。新大会以国家命运为赌注开启后，他反而没有收到参赛令，因为腐败军官收取贿赂，与财阀残党交易，谋求让熊成为地区代表。",
    "军官以延长战争才能保住妻女生命相威胁。法昆拉姆愤怒却仍被困住，只能下定决心为家人承担杀戮，登上军方研发的突入兵器前往战场。这个角色的暴力立场与被胁迫背景必须一起呈现。",
  ],
  [
    "Fahkumram was an unbeaten Thai Muay Thai champion and national hero. Refusing corrupt officers’ fixed match led to imprisonment, with his wife and daughter held hostage to force his service.",
    "His mission against the Zaibatsu was interrupted by the tournament’s cancellation. When the next tournament began, officers withheld his entry: bribes and a pact with Zaibatsu remnants were intended to promote Kuma as a regional representative.",
    "They threatened his family’s survival unless war continued. Furious but trapped, he accepted further violence to keep them alive and boarded a military assault weapon for deployment. Coercion is essential to understanding his role.",
  ],
  [
    "無敗の泰拳王者だったが、腐敗幹部の八百長を壊して拘束され、妻子も人質にされた。軍の手駒として大会へ送られる。",
    "大会中断後、次の大会では指令が来ない。幹部が財閥残党と賄賂の密約を交わし、クマを地区代表にするためだった。",
    "戦争が続く間だけ家族を生かすと脅され、怒りを抱えながら妻子のため戦う決意を固める。突入兵器で戦場へ向かう暴力には強制という背景がある。",
  ],
);
add(
  "miary_zo",
  [
    "米亚莉·佐因红色双眼符合占卜师祖母关于“白银斗神之子”的预言，从小受到这个称呼。她热爱观察和模仿动物，逐渐把这种兴趣融入格斗，并把交手对象视作“拳友”。",
    "她不论胜负都尊重对手，进步惊人，吸引非洲大陆的高手前来交流。然而半年前，她全身浮现蓝色光纹并因高热昏迷，数月后才苏醒。",
    "祖母告诉她斗神已寄宿其体内，应与使者踏上旅程。她的力量增强，两只环尾狐猴不断跟随，被她取名 Vanilla 与 Cacao。为寻找新拳友，她离开马达加斯加；此地传说的斗神不应未经证明就与《铁拳 3》的 Ogre 画上等号。",
  ],
  [
    "Miary’s red eyes matched her diviner grandmother’s prophecy about a child of the Silver Fighting God. Observing and imitating animals led her toward martial arts and friendships through sparring.",
    "Respecting opponents regardless of victory, she improved quickly and attracted fighters from mainland Africa. Six months earlier, blue markings and a severe fever left her unconscious for months.",
    "Her grandmother said the god now resided within her and she should travel with its messengers. Stronger after waking, she named two persistent ring-tailed lemurs Vanilla and Cacao and set out for new friends. This local deity is not established as TEKKEN 3’s Ogre.",
  ],
  [
    "祖母の白銀の闘神の予言に合う赤い瞳で生まれ、闘神の子と呼ばれた。動物を観察し真似るうちに格闘へ興味を持ち、拳トモを増やす。",
    "勝敗に関係なく敬意を払い急速に上達したが、半年前に青い紋様と高熱で倒れ、数か月眠った。",
    "祖母から神が宿り御使いと旅立つ時と告げられる。力が増し、ついてくるワオキツネザルをバニラとカカオと名付けて世界へ出る。この伝承の神をオーガと同一には扱わない。",
  ],
);
add(
  "kunimitsu",
  [
    "现任国光是继承母亲名号的女忍者，不是过去那位初代国光。受国际协力联合军的委托，她潜入三岛工业高等专门学校调查财阀，并以优等生形象成为二年级学生会副会长。",
    "她盗取服务器权限追查学生记录，发现使用“八乙女蕾娜”身份的蕾娜隐瞒来历。双方试探交手后认可彼此可利用，表面维持好友关系，暗中监视。蕾娜提出以九咫刀的线索换取 G 公司军事情报。",
    "国光在一年前烧毁的三岛家本丸找到隐藏通道与九把生锈的大太刀，把入侵计划交给蕾娜后，返回父亲所在的忍者村修复武器、掌握奥义。",
    "数月后 G 公司按情报突袭纽约，一八宣布新大会。国光发现母亲的宿敌吉光参赛，便携九咫刀出发，要夺取妖刀吉光，盼望仍卧病的母亲康复。官方公布背景不等于这里已经独立核验了最新可购买日期。",
  ],
  [
    "The current Kunimitsu is a kunoichi who inherited her mother’s name. Commissioned by the international forces, she infiltrated Mishima Polytechnical School and became its second-year student council vice president.",
    "Stolen administrator access exposed Reina’s assumed identity as Reina Yaotome. After testing each other in combat, they maintained an apparent friendship while observing one another. Reina offered information about nine ancient swords for G Corporation intelligence.",
    "Kunimitsu found a hidden passage beneath the Mishima compound burned a year earlier and recovered nine rusted blades. She leaked the invasion plan to Reina, then returned to her father’s ninja village for restoration and training.",
    "Months later, G Corporation attacked New York and Kazuya announced the tournament. Seeing Yoshimitsu on its roster, she set out with the restored weapons to take his cursed sword and help her ailing mother. This published background does not by itself verify a current purchase or release date.",
  ],
  [
    "母の名を継いだ当代州光。国際協力連合軍の依頼で三島高専に潜入し、二年で生徒会副会長となる。",
    "サーバー権限を奪い八乙女麗奈の身分を調べた結果、双方が正体と実力を認める。表向き親友、裏では探り合いながら、九咫刀の情報とG社機密を交換する約束を結ぶ。",
    "焼失した本丸の隠し通路から九本の錆びた大太刀を得て侵攻計画を渡し、父のいる隠れ里で修復と奥義習得に取り組む。",
    "数か月後にニューヨーク襲撃と大会宣言が起こり、吉光の参加を知った州光は病気の母のため妖刀を狙って出発する。この背景の公開と購入・配信日の確認は別である。",
  ],
);

export const characterStories = rows;
