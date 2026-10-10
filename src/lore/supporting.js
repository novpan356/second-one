// Supporting dossiers deliberately summarize only published, relevant story context.
const records = {};
function add(id, names, zh, en, ja, refs) {
  records[id] = {
    id,
    kind: "support",
    name: { zh: names[0], en: names[1], ja: names[2] },
    biography: { zh, en, ja },
    sources: refs.map((ref) =>
      typeof ref === "string"
        ? {
            label: `TEKKEN 8 · ${ref} official background`,
            url: `https://tk8.tekken-official.jp/character/index.php?chara=${ref}`,
            checkedAt: "2026-10-10",
          }
        : ref,
    ),
  };
}
const history = {
  label: "TEKKEN 8 · official series history",
  url: "https://tk8.tekken-official.jp/mode/story.php#history",
  checkedAt: "2026-10-10",
};
add(
  "ogre",
  ["斗神（Ogre）", "Ogre", "オーガ"],
  [
    "斗神是《铁拳 3》袭击强大格斗家的神秘存在。它在屋久岛袭击准与仁，准由此失踪，仁则寻找平八学习能够复仇的力量。",
    "平八把大会作为引出斗神的手段。保罗击败第一形态，仁击败变身后的形态，随后平八背叛仁，触发恶魔之力。米亚莉家乡传说中的白银斗神没有被公开确认为同一存在。",
  ],
  [
    "Ogre attacked powerful fighters in TEKKEN 3, including Jun and Jin on Yakushima. Jun disappeared and Jin turned to Heihachi for training.",
    "Heihachi drew it out through the tournament. Paul defeated its first form and Jin its transformed form; Heihachi’s subsequent betrayal awakened Jin’s Devil power. Miary’s local Silver Fighting God is not established as this being.",
  ],
  [
    "3で強者を襲う存在。屋久島で準が消え、仁は平八に力を求めた。",
    "大会でポールが第一形態、仁が変身後を倒す。その後の裏切りで仁のデビルが目覚める。ミアリズの伝承の神とは同一と確定していない。",
  ],
  [history, "jun"],
);
add(
  "azazel",
  ["阿萨谢尔", "Azazel", "アザゼル"],
  [
    "阿萨谢尔是恶魔始祖，扎菲娜的家族长期守护其封印。仁发动战争试图唤醒并与它同归于尽。第六作中仁击败其实体，却没有消灭不灭的精神。",
    "扎菲娜将精神封入左臂，逐渐难以压制，得到克劳迪奥与晓雨帮助。《铁拳 8》中一八夺取其力量，使始祖再次成为父子决战的关键。",
  ],
  [
    "Azazel is the Devil progenitor whose seal Zafina’s family guarded. Jin’s war was intended to awaken it and destroy its source, but defeating its body did not eradicate its spirit.",
    "Zafina contained the spirit in her arm and sought help from Claudio and Xiaoyu. Kazuya’s acquisition of its power brings it back into TEKKEN 8’s central conflict.",
  ],
  [
    "ザフィーナの一族が封じてきたデビルの始祖。仁は戦争で復活させ倒そうとしたが精神体は残った。",
    "左腕に封じたザフィーナをクラウディオとシャオユウが助ける。8で一八が力を奪い、父子対決へ再び関わる。",
  ],
  [history, "zafina", "jin"],
);
add(
  "jinpachi",
  ["三岛仁八", "Jinpachi Mishima", "三島仁八"],
  [
    "仁八是平八的父亲、三岛家更早一代人物，遭长期囚禁在本丸地下。第五作的爆炸给他离开封印并掌控财阀的机会。",
    "他变成逐渐失去理性的怪物，因此举办大会，希望有人能够终结自己。仁最终击败他并成为财阀头首。这里的仁八不是风间仁，两人的名字与辈分必须区分。",
  ],
  [
    "Jinpachi is Heihachi’s father, imprisoned beneath Hon-Maru. The explosion preceding TEKKEN 5 enabled his return and seizure of the Zaibatsu.",
    "He held a tournament hoping someone would end his increasingly monstrous state. Jin defeated him and took command. Jinpachi and Jin are different people from different generations.",
  ],
  [
    "平八の父で本丸地下に長く囚われた人物。5直前の爆発で戻り財閥を掌握した。",
    "理性を失う前に倒してもらうため大会を開き、仁に敗れる。仁八と風間仁は別の世代の別人である。",
  ],
  [history],
);
add(
  "kazumi",
  ["三岛一美", "Kazumi Mishima", "三島一美"],
  [
    "一美是平八的妻子、一八的母亲。她与恶魔血脉及家族命运的关联是《铁拳 7》的重要回溯线，而非当前角色结局中的轻松外传。",
    "官方历代剧情概述明确写到豪鬼受她过去的请求，来杀平八与一八。即使她已不在当下事件中心，这个旧约仍改变第七作的战局。没有资料确认她是蕾娜的母亲。",
  ],
  [
    "Kazumi is Heihachi’s wife and Kazuya’s mother. Her connection to Devil blood is a central TEKKEN 7 backstory thread.",
    "The official series history confirms that Akuma acts on her earlier request to kill Heihachi and Kazuya. That promise influences the later conflict. No consulted material establishes her as Reina’s mother.",
  ],
  [
    "平八の妻で一八の母。デビルの血と家族の運命に関わる7の重要な過去の人物。",
    "公式の歴史は豪鬼が彼女の依頼で平八と一八を狙うと記す。旧い約束が戦局を動かすが、麗奈の母とは確認されていない。",
  ],
  [history],
);
add(
  "akuma",
  ["豪鬼", "Akuma", "豪鬼"],
  [
    "豪鬼是在《铁拳 7》中履行一美旧约的格斗家。他依照承诺挑战平八，再追击一八，迫使恶魔力量与卫星武器的计划走向新的冲突。",
    "其客串身份不等于三岛血亲。官方历代概述确认他经历卫星攻击仍生还，但没有在这里给出他在《铁拳 8》战争中的新角色，因此档案不新增其当代行动。",
  ],
  [
    "Akuma fulfills an earlier promise to Kazumi in TEKKEN 7, confronting Heihachi and then Kazuya. His involvement disrupts plans surrounding Devil exposure and satellite weapons.",
    "He is a guest fighter, not a Mishima blood relative. The official history records his survival but does not establish a new TEKKEN 8 role, so none is invented here.",
  ],
  [
    "一美との約束を果たすため7で平八と一八に挑む。デビルの暴露と衛星兵器の計画を変える客演者である。",
    "三島家の血縁ではなく、公式概述は生存を記すが8での新たな行動までは定めない。",
  ],
  [history],
);
add(
  "bosconovitch",
  ["波斯科诺维奇博士", "Dr. Bosconovitch", "Dr.ボスコノビッチ"],
  [
    "博士是阿丽莎的制造者，也是李超狼与吉光的重要技术盟友。他与李合作建造反抗军飞行艇，为吉光提供新型甲胄。",
    "阿丽莎误把对拉斯的情感反应当成故障前来检修，博士在升级后告诉她没有那种漏洞，原有主人控制功能也消失了，并鼓励她自主生活。关系图将制造者与父母血缘分开。",
  ],
  [
    "The doctor created Alisa and supplies technological help to Lee and Yoshimitsu, including the rebellion’s flying vessel and new armor.",
    "After Alisa mistook her feelings for a malfunction, his upgrade and explanation confirmed the removal of master control. He encouraged her freedom. The tree distinguishes a creator relationship from biological parentage.",
  ],
  [
    "アリサの創造者で、リーの飛行艇や吉光の甲冑にも協力する科学者。",
    "ラースへの反応を故障と疑うアリサを整備し、マスター制御が消えたことと自由な生き方を伝える。創造者の関係は血縁と区別する。",
  ],
  ["alisa", "lee", "yoshimitsu"],
);
add(
  "jane",
  ["简", "Jane", "ジェーン"],
  [
    "简年幼时曾被杰克系列机器人救下，此后在 G 公司研究心中理想的杰克。她的持续改进让系列成为公司主力武器。",
    "杰克 8 搭载更强 AI、学习能力、伽马系统和大型装备，体现她的研究目标。她既是创造者，也是整个系列背后的情感纽带，不能被写成机器人之间的生物血亲。",
  ],
  [
    "Jane was saved by an earlier Jack and later devoted her work at G Corporation to an ideal version of the machine.",
    "Jack-8’s AI, learning systems, Gamma System and special equipment embody that research. Her connection is creation and personal attachment rather than biological lineage.",
  ],
  [
    "旧型ジャックに救われ、G社で理想の機体を研究する科学者。",
    "ジャック8のAI、学習、ガンマシステムと装備はその成果であり、関係は開発と想いの継承であって血縁ではない。",
  ],
  ["jack8"],
);
add(
  "emma",
  ["艾玛·克里森", "Emma Kliesen", "エマ・クリーゼン"],
  [
    "艾玛是里奥的母亲与遗传学权威，曾在 G 公司研究恶魔因子，约一年前死于可疑事故。",
    "里奥查到一八处理失去利用价值的研究员的命令，因此怀疑母亲被灭口。但公开背景仍保留调查者的推论视角，没有把所有未查明细节写成最终结论。",
  ],
  [
    "Emma, Leo’s mother, was a genetic-research expert studying the Devil factor at G Corporation. Her suspicious death prompted Leo’s investigation.",
    "Records of Kazuya’s disposal order led Leo to suspect a cover-up. The official account keeps this as an investigator’s conclusion rather than resolving every detail.",
  ],
  [
    "レオの母でG社のデビル因子研究者。不自然な事故死が調査のきっかけとなる。",
    "不要な研究員の処分命令から口封じを疑われるが、紹介はレオの推論という視点を保つ。",
  ],
  ["leo"],
);
add(
  "niklas",
  ["尼克拉斯·克里森", "Niklas Kliesen", "ニクラス・クリーゼン"],
  [
    "尼克拉斯是里奥的父亲与知名考古学家，教授里奥武术，并在其幼年时失踪。",
    "他关于冷静寻找真相的教导，在里奥调查艾玛死亡时再次发挥作用。官网背景未交代最终去向，档案不自行确认他已死亡或与某位化名人物相同。",
  ],
  [
    "Niklas is Leo’s archaeologist father and martial teacher, missing since Leo’s childhood.",
    "His advice to seek truth with a calm mind guides the investigation into Emma’s death. The biography does not resolve his whereabouts or identify him with an assumed persona.",
  ],
  [
    "レオの父で考古学者、武術も教えた。幼い頃に消息を絶つ。",
    "冷静に真実を探せという教えが母の死の調査を支える。行方や別名の人物との同一性はここで断定しない。",
  ],
  ["leo"],
);
add(
  "wu_zihao",
  ["吴子豪", "Wu Zihao", "ウー・ズーハオ"],
  [
    "吴子豪是被称作神拳的拳圣，也是冯威的师父。他强调心与技的统一，与徒弟只重视绝对力量的思想产生根本分歧。",
    "冯威杀死他后以为证明了自己的道路，但李洛伊再次以心与技的观点击败冯威，使这段师承争论在《铁拳 8》背景中重新出现。",
  ],
  [
    "Wu Zihao taught Feng that mind and technique must unite. Feng instead worshipped overwhelming force and killed him.",
    "Leroy’s later victory challenged Feng with the same principle, making the murdered teacher’s legacy central to Feng’s TEKKEN 8 motivations.",
  ],
  [
    "フェンの師で心技一致を説いた拳聖。絶対的な力を信じる弟子に殺された。",
    "リロイの勝利と同じ教えが、8でもフェンの思想を再び問い直す。",
  ],
  ["feng"],
);
add(
  "baek",
  ["白头山", "Baek Doo San", "ペク・トー・サン"],
  [
    "白头山是花郎的跆拳道师父，构成他的武术传承背景。花郎与仁的竞争建立在这段训练成长之后。",
    "花郎在《铁拳 8》背景中转向精神修行，试图明确自己真正想要的胜利。现行花郎简介没有更新白头山的去向，因此这里仅归纳已知的师承作用，不编写未公开的当代事件。",
  ],
  [
    "Baek is Hwoarang’s taekwondo teacher, providing the martial lineage behind his rivalry with Jin.",
    "Hwoarang’s TEKKEN 8 setup focuses on spiritual training and his own goals. The consulted profile supplies no new contemporary Baek events, so the dossier does not invent them.",
  ],
  [
    "ファランのテコンドーの師で、仁との競争の前提となる武術を伝えた。",
    "8の紹介は弟子自身の精神修業を中心とし、師の新たな動向はここでは補作しない。",
  ],
  ["hwoarang"],
);
add(
  "forest",
  ["福雷斯特·洛", "Forest Law", "フォレスト・ロウ"],
  [
    "福雷斯特是马歇尔·洛的儿子。摩托事故带来的债务迫使父亲把大量时间投入筹款，间接让道场失去学员并最终被没收。",
    "他的事故是《铁拳 8》洛参赛动机的重要前因，但当前背景不等于他也出现在主线战场或已拥有新的独立剧情。",
  ],
  [
    "Forest is Marshall Law’s son. His motorcycle accident created the debts that distracted Law from the dojo and contributed to its seizure.",
    "This explains Law’s prize-money motivation, without establishing Forest as a new participant in the main battlefield narrative.",
  ],
  [
    "マーシャルの息子。バイク事故の借金が父の金策と道場喪失へ繋がる。",
    "ロウの参戦理由の前提だが、8本編での新たな出番までは示していない。",
  ],
  ["law"],
);
add(
  "mr_rochefort",
  ["罗什福尔先生", "Mr. Rochefort", "ロシュフォール氏"],
  [
    "莉莉的父亲是摩纳哥的石油富豪，爱好和平，与女儿热爱格斗的生活形成反差。",
    "莉莉以私人飞机挑战世界高手，并尽量不让父亲知道。父女关系解释她的财富与隐瞒行动，而不是三岛战争中的明确军事同盟。",
  ],
  [
    "Lili’s father is a Monaco oil magnate who prefers peace, contrasting with his daughter’s love of fighting.",
    "She travels privately to challenge opponents while hiding the activity from him. This explains her resources and secrecy, not a demonstrated corporate-war alliance.",
  ],
  [
    "リリの父で平和を愛するモナコの石油王。娘の格闘好きと対照的である。",
    "リリは父に隠れて私有機で挑戦を続ける。財力と行動の理由を説明する関係で、軍事同盟ではない。",
  ],
  ["lili"],
);
add(
  "kunimitsu_i",
  ["初代国光", "Kunimitsu I", "初代州光"],
  [
    "初代国光是现任国光的母亲，与吉光有长期宿敌关系。现任继承名号，但并不是初代以年轻外貌重新出现。",
    "《铁拳 8》背景中她仍卧病，女儿在修复九咫刀后参赛，想夺走妖刀吉光，祈求母亲康复。公开背景并未给出疾病治疗的最终结果。",
  ],
  [
    "The first Kunimitsu is the current bearer’s mother and Yoshimitsu’s longstanding rival. Inheriting the name does not make them the same person.",
    "She remains ill in the TEKKEN 8 setup. Her daughter pursues Yoshimitsu’s sword hoping to help her recover; the outcome is not resolved in the profile.",
  ],
  [
    "当代の母で吉光の宿敵。名の継承と同一人物は違う。",
    "8では病床にあり、娘が快復を願って妖刀を狙う。治療の結末は背景では確定していない。",
  ],
  ["kunimitsu"],
);
add(
  "armor_king_i",
  ["初代铠甲王", "Armor King I", "初代アーマーキング"],
  [
    "初代铠甲王是现任铠甲王的兄长，也是现任豹王的师父。其被杀留下弟弟的复仇与弟子的感激两种不同回应。",
    "现任铠甲王想以兄长传授的禁招完成复仇，而豹王希望阻止这个循环，两人的新擂台对决由此形成。",
  ],
  [
    "The first Armor King is the current fighter’s older brother and King’s teacher. His death leaves vengeance in one successor and concern in another.",
    "The younger brother releases forbidden techniques he taught, while King tries to prevent revenge from consuming him. Their confrontation grows from that shared legacy.",
  ],
  [
    "現アーマーキングの兄でキングの師。死が弟の復讐と弟子の別の願いを生む。",
    "弟が伝授された禁じ手を解く一方、キングは復讐を止めようとする。共通の継承が対決へ繋がる。",
  ],
  ["armor_king"],
);
add(
  "king_i",
  ["初代豹王", "King I", "初代キング"],
  [
    "初代豹王与现任豹王是不同人物。共同的面具、摔角名号与儿童救助传统构成传承，不能让两人的所有大会经历合并。",
    "现任豹王延续对孤儿的支持，并在世界战争扩大时筹集更多救助资金。本档案以当前官方背景为重点，不把未重新核对的初代详细年表当成已完成。",
  ],
  [
    "The original King and the current wrestler are different people. The mask, wrestling title and concern for children form a legacy rather than a single continuous biography.",
    "The current King sustains orphan support amid expanding war. This dossier centers that published connection rather than asserting a newly verified exhaustive chronology for the first bearer.",
  ],
  [
    "初代と現キングは別人。マスク、名と子供への支援が継承されても全大会の経歴を統合しない。",
    "現キングは戦争下でも支援を続ける。ここは確認した現在の背景を中心にした継承の説明である。",
  ],
  ["king"],
);
add(
  "dragunov_command",
  ["德拉古诺夫所属部队", "Dragunov’s command", "ドラグノフの所属部隊"],
  [
    "德拉古诺夫以军人身份执行任务并参加大会。他的官方背景没有把上级写成某一位有姓名的可玩角色。",
    "大会中断后，指挥体系肯定其工作，批准首次长假。这是他“假期愿望清单”故事的起点；关系树保留组织关系，而不虚构上级的姓名、家庭或个人生平。",
  ],
  [
    "Dragunov acts under military command. The consulted biography does not identify that authority as a named playable fighter.",
    "After the tournament’s interruption, service recognition grants him a long vacation, beginning the wish-list story. This node represents an organization, not an invented commander’s life.",
  ],
  [
    "任務と大会に関わる軍の指揮系統。公式背景は上官を特定のプレイアブル人物として名指ししない。",
    "功績を評価し長期休暇を与えたことが手帳の話の起点。組織ノードとして扱い架空の上官の生涯は作らない。",
  ],
  ["dragunov"],
);
records.dragunov_command.kind = "organization";
add(
  "azucena_father",
  ["奥尔蒂斯农场主", "Azucena’s father", "オルティス農園の父"],
  [
    "阿苏塞娜的父亲经营秘鲁高海拔咖啡农场，女儿从他的咖啡和栽培生活中产生成为世界第一的梦想。",
    "阿苏塞娜通过咖啡品质、模特舞蹈与综合格斗扩大农场声誉。官网未公布父亲姓名或完整个人生平，因此这个节点呈现与女儿相关的已知背景。",
  ],
  [
    "Azucena’s father runs the high-altitude Ortiz coffee farm that inspired her ambition.",
    "Her cultivation and promotional career increase its recognition. The profile does not publish his name or a full independent life story; this node records the known family context.",
  ],
  [
    "ペルー高地の農園を営み、娘の世界一の夢の原点となる父。",
    "娘の栽培と宣伝で農園の名が広がる。名前と独立した生涯は未公表のため、確認できる家族の背景を示す。",
  ],
  ["azucena"],
);
add(
  "miary_grandmother",
  ["米亚莉的祖母", "Miary’s grandmother", "ミアリズの祖母"],
  [
    "祖母是当地著名占卜师，预言红眼的斗神之子会在古老猴面包树枯萎时诞生。米亚莉的出生使这个预言与她联系起来。",
    "米亚莉高热昏迷后醒来，祖母解释白银斗神已寄宿其身，应与使者旅行。祖母的解释是传说与人物信仰的一部分，尚不能用它直接确认与其他作品神灵的同一性。",
  ],
  [
    "Miary’s grandmother is a renowned diviner who foretold a red-eyed child associated with the Silver Fighting God.",
    "After Miary’s illness, she explains the deity’s presence and sends her traveling with its messengers. This remains the setting’s prophecy, not proof of equivalence with another franchise deity.",
  ],
  [
    "赤い瞳の闘神の子の誕生を予言した著名な占い師。",
    "孫の昏睡後に神の宿りと旅を説明するが、他の神との同一性を証明するものではない。",
  ],
  ["miary_zo"],
);
add(
  "vanilla_cacao",
  ["Vanilla 与 Cacao", "Vanilla & Cacao", "バニラとカカオ"],
  [
    "这对环尾狐猴在米亚莉苏醒后频繁出现并始终跟随她，被祖母解释为斗神使者。米亚莉为它们取名并与它们一同旅行。",
    "它们是动物伙伴，而不是人类亲属；官网尚未给出超出这段背景的独立剧情或能力年表。",
  ],
  [
    "The two ring-tailed lemurs follow Miary after her recovery. Her grandmother describes them as messengers of the deity; Miary names them and takes them on her journey.",
    "They are animal companions, not human relatives. No separate exhaustive chronology is established by the profile.",
  ],
  [
    "快復後にミアリズを追う二匹のワオキツネザル。祖母は御使いと説明し、彼女が名前を付け旅を共にする。",
    "動物の仲間であり人間の血縁ではない。独立した詳しい年表は公表されていない。",
  ],
  ["miary_zo"],
);
add(
  "salim",
  ["萨利姆", "Salim", "サリーム"],
  [
    "萨利姆曾在市场遭暗杀，被沙欣救下。他劝沙欣把武力变为保护人的盾，家族也支持沙欣成长。两人此后互相尊敬，分别投身石油企业与军事事业。",
    "萨利姆离奇死亡成为沙欣调查 G 公司的动机。弟弟扎里夫把他的剑交给沙欣，请其继承保护财富与尊严的理想。",
  ],
  [
    "Salim was rescued from assassins by Shaheen and urged him to use his skills as a shield. His family supported Shaheen, and their friendship continued as their careers diverged.",
    "His suspicious death prompted the G Corporation investigation. Zarif later entrusted his sword and ideals to Shaheen.",
  ],
  [
    "市場でシャヒーンに救われ、技を人を守る盾にするよう勧めた友。家族の援助と尊敬を通じ別々の職へ進んだ。",
    "不審死がG社調査の動機となり、弟が剣と志をシャヒーンに託す。",
  ],
  ["shaheen"],
);
add(
  "zarif",
  ["扎里夫", "Zarif", "ザリーフ"],
  [
    "扎里夫是萨利姆的弟弟。沙欣回乡报告调查后，他赶来把兄长的宝剑交给沙欣，希望对方继承萨利姆的志向。",
    "这次托付让沙欣从追查个案继续走向阻止 G 公司暴行。公开背景没有说明扎里夫也是格斗家或军人，因此关系树只记录亲属与托付。",
  ],
  [
    "Zarif is Salim’s younger brother. After Shaheen reports his findings, Zarif gives him Salim’s sword and asks him to carry on his ideals.",
    "The exchange strengthens Shaheen’s broader resistance to G Corporation. The profile does not establish Zarif as another fighter or soldier.",
  ],
  [
    "サリームの弟。調査報告の後、兄の宝剣をシャヒーンへ渡し志の継承を頼む。",
    "G社への抵抗を決意させるが、ザリーフ自身を格闘家や軍人とは断定しない。",
  ],
  ["shaheen"],
);
add(
  "dr_nakamura",
  ["Nakamura 博士", "Dr. Nakamura", "Dr. Nakamura"],
  [
    "Nakamura 博士是安娜找到的武器专家，应委托制造“Lovely Tom”。武器具有携带与变形能力，帮助她应对多人警戒。",
    "安娜以这件武器为核心调整打法，准备挑战妮娜。官方没有确认他就是波斯科诺维奇博士或三岛家族成员，因此单独建立技术合作节点。",
  ],
  [
    "Nakamura is the weapons specialist commissioned by Anna to make Lovely Tom, a portable transforming firearm.",
    "Anna adapts her style around it to challenge Nina. Nothing in the biography identifies him as Bosconovitch or a Mishima relative.",
  ],
  [
    "アンナの依頼で携帯・変形重火器ラブリー・トムを作った武器職人。",
    "その武器でニーナへの対策を立てる。ボスコノビッチや三島家の人物と同一にはしない。",
  ],
  ["anna"],
);
add(
  "torgal",
  ["托加尔", "Torgal", "トルガル"],
  [
    "托加尔是克莱夫的动物伙伴。客串背景中，克莱夫在精神干涉后由它的叫声唤醒，才发现身处陌生世界。",
    "它与克莱夫的返乡旅程属于《最终幻想 XVI》客串设定，不是三岛战争的动物兵器谱系。",
  ],
  [
    "Torgal is Clive’s animal companion. Its cry wakes him after the mental intrusion that displaces him into an unfamiliar world.",
    "Their return journey belongs to the FINAL FANTASY XVI crossover premise rather than a Mishima weapon lineage.",
  ],
  [
    "精神干渉後のクライヴを鳴き声で起こす相棒。",
    "帰還の道はFFXVIの客演設定に属し、三島の兵器系譜ではない。",
  ],
  ["clive"],
);
add(
  "jill",
  ["吉尔", "Jill Warrick", "ジル・ワーリック"],
  [
    "吉尔是克莱夫原世界的重要伙伴，也是他在来到铁拳世界后希望重返的人之一。",
    "当前客串背景没有展开她在铁拳世界的行动或给出新的结局，档案只把她作为返乡目标与原作关系收录。",
  ],
  [
    "Jill is an important companion in Clive’s original world and one of the people he wants to return to.",
    "The guest biography establishes no independent Tekken-world actions or new ending for her; this dossier records that crossover connection.",
  ],
  [
    "クライヴの元の世界の大切な仲間で帰りたい相手。",
    "客演背景は鉄拳側での独立した行動や結末を示さず、帰郷の関係として収録する。",
  ],
  ["clive"],
);
add(
  "joshua",
  ["约书亚", "Joshua Rosfield", "ジョシュア・ロズフィールド"],
  [
    "约书亚是克莱夫在原作世界的弟弟，也是他在异世界醒来后呼唤、希望重逢的人。",
    "铁拳官方客串简介以这份牵挂说明克莱夫寻找返乡之路。它没有逐章重述《最终幻想 XVI》的约书亚线，也不应由此新增一个三岛亲属。",
  ],
  [
    "Joshua is Clive’s younger brother in his original game and one of the people he names when seeking a way home.",
    "The guest setup records that motivation, not a new chapter-by-chapter Joshua story or a Mishima relation.",
  ],
  [
    "原作での弟で、異世界から帰りたい相手としてクライヴが名を挙げる。",
    "客演背景の動機であり、新たな三島家の人物としては扱わない。",
  ],
  ["clive"],
);

add(
  "international_police",
  ["国际警察", "International police", "国際警察"],
  [
    "布莱恩曾在国际警察任职，改造后继续制造破坏，反而成为该组织通缉的对象。",
    "《铁拳 8》背景中的精锐反恐部队在城市中与他交战，见证永久机构热失控。该节点代表机构及其任务关系，不把未具名警员伪装为有完整个人传记的人物。",
  ],
  [
    "Bryan once served in the international police. After becoming a destructive replicant, he became one of its wanted targets.",
    "Its elite counterterrorism force confronts him in the urban battle where his generator overheats. This is an institutional node, not a fabricated officer biography.",
  ],
  [
    "以前ブライアンが属し、今は彼を追う国際警察。",
    "市街戦の対テロ部隊が永久機関の暴走に遭遇する。名のない警官の架空の個人伝記ではなく組織として示す。",
  ],
  ["bryan"],
);
records.international_police.kind = "organization";
add(
  "marduk",
  ["克雷格·马杜克", "Craig Marduk", "クレイグ・マードック"],
  [
    "系列背景中，马杜克在争斗中杀死初代铠甲王，成为其弟弟追索的仇敌，也让豹王面对复仇的诱惑。豹王与马杜克后来发展出竞争与伙伴关系。",
    "《铁拳 8》当前铠甲王的官方介绍只称其为“宿敌”，主要叙述大会中断及与豹王的新挑战。此档案用系列背景补足这个名字，不把他当成已确认的《铁拳 8》可玩角色。",
  ],
  [
    "In earlier series backstory, Marduk killed the first Armor King, becoming the younger brother’s revenge target and drawing King into a conflict of his own. King and Marduk later formed a rivalry and partnership.",
    "The current Armor King web biography names only an enemy and centers the interrupted tournament and challenge to King. This dossier supplies the series context without claiming a confirmed TEKKEN 8 playable slot.",
  ],
  [
    "シリーズの過去で初代アーマーキングを殺し、弟の仇となる。キングも復讐に向き合い、後に競争と協力の関係になる。",
    "8の現行紹介は宿敵とだけ呼び、キングとの挑戦を中心にする。名前を系列背景で補い、8の参戦確定とはしない。",
  ],
  [
    {
      label: "Earlier TEKKEN character backstories · editorial series context",
      url: "https://tk8.tekken-official.jp/mode/story.php#history",
    },
    "armor_king",
  ],
);

export const supportingStories = records;
