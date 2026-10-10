import research from "./movement-research.json" with { type: "json" };
// Interpret only explicit defender counterplay and tracking statements.
// Never infer an escape direction from the opposite tracking direction.
export function movementAssessment(move, fighterId) {
  const extra = research.entries[fighterId]?.[move.command];
  if (extra) return { ...extra, tentative: false };
  const notes = move.notes || "";
  const evade = notes.match(
    /Can (?:only be sidewalked left at range|(?:SSL|SSR)[^.;]*?from \d+(?:st|nd|rd|th) block|be sidestepped)/i,
  );
  if (evade) {
    const quote = evade[0];
    return {
      kind: "evade",
      directions: /sidewalked left/i.test(quote)
        ? ["SWL"]
        : [...new Set(quote.match(/\b(?:SSL|SSR|SWL|SWR)\b/g) || [])],
      evidence: quote,
      context: /at range/i.test(quote)
        ? "range"
        : /from \d/.test(quote)
          ? "string"
          : "unspecified",
      afterBlock: quote.match(/from (\d+)(?:st|nd|rd|th) block/i)?.[1],
      tentative: quote.includes("?"),
    };
  }
  const directional = notes.match(
    /(?:has )?good (?:left|right|sidestep right|SSR)(?: sidestep)? tracking|tracks SSR\/SWR completely|(?:pseudo[ -]?homing|(?:completely )?homing) to (?:SSL\/SWL(?: side)?|SSR\/SWR(?: side)?|SSR side|SSL\/SSR\/SWR\??|sidestep (?:left|right) and sidewalk (?:left|right)\??)|tracks sidestep right and sidewalk right completely\??|cannot be sidestepped or sidewalked right\??|tracks (?:to the left|left side)/i,
  );
  if (directional) {
    const quote = directional[0];
    const directions =
      quote.match(/\b(?:SSL|SSR|SWL|SWR)\b/g) ||
      (/right|SSR/i.test(quote) ? ["SSR", "SWR"] : ["SSL", "SWL"]);
    return {
      kind: "tracking",
      directions: [...new Set(directions)],
      evidence: quote,
      tentative:
        quote.includes("?") ||
        /\?/.test(
          notes.slice(
            directional.index + quote.length,
            directional.index + quote.length + 1,
          ),
        ),
    };
  }
  const homing = notes.match(
    /tracks to both sides effectively homing|tracks side steps|\b(?:pseudo[- ]|effectively )?Homing\b(?! to)(?: low)?\??/i,
  );
  if (homing)
    return {
      kind: "homing",
      directions: ["SSL", "SSR"],
      evidence: homing[0],
      tentative:
        /pseudo|\?/i.test(homing[0]) ||
        /\?/.test(
          notes.slice(
            homing.index + homing[0].length,
            homing.index + homing[0].length + 1,
          ),
        ),
    };
  return { kind: "unknown", directions: [], evidence: null };
}
export function movementMatches({ move, assessment: a }, query, filter) {
  if (
    query &&
    !`${move.name} ${move.command} ${a.evidence || ""}`
      .toLowerCase()
      .includes(query.toLowerCase())
  )
    return false;
  if (filter === "all") return true;
  if (filter === "documented") return a.kind !== "unknown";
  if (filter === "left" || filter === "right")
    return (
      a.kind === "evade" &&
      a.directions.some((d) =>
        (filter === "left" ? ["SSL", "SWL"] : ["SSR", "SWR"]).includes(d),
      )
    );
  return a.kind === filter;
}
export const movementCopy = {
  zh: {
    title: "逐招拆解，横移破局。",
    intro:
      "选择的是对手角色。按招式查可规避方向、追踪侧与连携窗口；SSL / SSR 为你操控角色的左 / 右，SWL / SWR 为持续向左 / 右横走。",
    documented: "有方向 / 追踪资料",
    escapeRecords: "来源明确注明可规避",
    caution:
      "社区快照的游戏补丁未标定。方向受帧差、距离、体型、轴线和延迟出招影响；所有条目需在当前版本复测。",
    search: "搜索对手招式或输入，例如 df+1",
    filter: "横移对策筛选",
    records: "条招式",
    perspective: "方向以防守方自身为准",
    filters: {
      documented: "有资料的招式",
      all: "全部招式（含未收录）",
      evade: "来源注明可规避",
      left: "可向左规避 SSL / SWL",
      right: "可向右规避 SSR / SWR",
      tracking: "单侧追踪提醒",
      homing: "双向追踪 / Homing",
      unknown: "尚无方向资料",
    },
    response: "应对 / 追踪方向",
    conditions: "条件与窗口",
    evidence: "证据与来源",
    kinds: {
      evade: "可规避方向",
      tracking: "追踪这一侧",
      homing: "双侧追踪",
      unknown: "方向未收录",
    },
    noGuess: "未从追踪反推可躲方向",
    noEvidence: "来源未注明逐招方向",
    quote: "查看原文依据",
    afterBlock: "防住第 {n} 段后",
    tentative: "原文带疑问，需优先复测",
    contexts: {
      range: "仅注明远距离向左横走；贴身不适用。",
      string: "针对连携的指定防御段；不是从第一段开始横移。",
      unspecified: "原文注明可横移，未给方向和精确窗口。",
      tracking: "此方向有追踪。反方向能否规避尚无结论。",
      homing: "原文标注追踪。请优先考虑防御、距离或其他对策。",
      unknown: "未标注不代表线性，也不代表能被左右横移。",
    },
    practiceTitle: "在训练模式确认这一条对策",
    practice:
      "录制对手单招或完整连携，固定前置帧差与距离，分别测试 SSL、SSR、SWL、SWR 后回防。连携从注明的防御段开始测试，并交换 P1 / P2 与使用角色复测；延迟出招、墙边和轴线变化单独记录。",
    moreResearch: "查阅社区对策页（部分角色可能未建页）",
    controls: "展开横移 / 横走输入对照",
    defenderScope: "来源记录的防守角色",
    contextsExtra:
      "防住第 1 段、在第 2 段前向左横移。仅以下防守角色有此来源记录，其他角色未验证。",
  },
  en: {
    title: "Read the move. Break the axis.",
    intro:
      "This is the opponent’s character. Look up escape directions, tracking sides and string gaps. SSL / SSR mean your defender’s left / right; SWL / SWR mean sustained sidewalk left / right.",
    documented: "Direction / tracking records",
    escapeRecords: "Explicit escape records",
    caution:
      "The community snapshot has no patch version. Frames, range, character size, axis and delayed inputs affect results. Retest every entry in your current patch.",
    search: "Search opponent move or input, e.g. df+1",
    filter: "Sidestep response filter",
    records: "move records",
    perspective: "Directions are from the defender’s perspective",
    filters: {
      documented: "Moves with evidence",
      all: "All moves (including unknown)",
      evade: "Explicit escape records",
      left: "Escape left SSL / SWL",
      right: "Escape right SSR / SWR",
      tracking: "One-side tracking",
      homing: "Both-side tracking / Homing",
      unknown: "Direction not documented",
    },
    response: "Response / tracked direction",
    conditions: "Conditions & window",
    evidence: "Evidence & source",
    kinds: {
      evade: "Escape direction",
      tracking: "Tracks this side",
      homing: "Tracks both sides",
      unknown: "Direction unknown",
    },
    noGuess: "No escape inferred from tracking",
    noEvidence: "No move-specific direction in source",
    quote: "Read source excerpt",
    afterBlock: "After blocking hit {n}",
    tentative: "Source is tentative; prioritize retesting",
    contexts: {
      range: "Only sidewalk left at range is documented; not point blank.",
      string:
        "Applies after the specified blocked string hit, not before the first hit.",
      unspecified:
        "The source states it can be stepped, without a direction or exact window.",
      tracking:
        "Tracks this side. Escaping the opposite side is not established.",
      homing:
        "Source marks tracking. Consider blocking, spacing or another response.",
      unknown: "Unmarked does not mean linear or escapable to either side.",
    },
    practiceTitle: "Confirm this response in practice",
    practice:
      "Record the single move or complete string. Fix the setup’s frames and distance; test SSL, SSR, SWL and SWR into guard. Start strings after the specified blocked hit. Retest on P1 / P2 and with your own character; record delayed inputs, walls and axis changes separately.",
    moreResearch: "Community counterplay page (some may not exist)",
    controls: "Sidestep / sidewalk input reference",
    defenderScope: "Defenders documented by the source",
    contextsExtra:
      "Sidestep left after blocking hit 1, before hit 2. Only the defenders listed below have source records; other characters are unverified.",
  },
  ja: {
    title: "技を読む。軸で崩す。",
    intro:
      "選択中のキャラクターは対戦相手です。技ごとの回避方向、追尾側、連係の隙間を検索できます。SSL / SSR は防御側自身の左 / 右、SWL / SWR は左 / 右への横歩きです。",
    documented: "方向・追尾の資料あり",
    escapeRecords: "回避可能と明記された技",
    caution:
      "コミュニティ資料のパッチは不明です。フレーム差、距離、体格、軸、ディレイで結果が変わるため、現行版で再検証してください。",
    search: "相手の技・コマンドを検索（例 df+1）",
    filter: "横移動対策フィルター",
    records: "件の技",
    perspective: "方向は防御側自身を基準とします",
    filters: {
      documented: "資料のある技",
      all: "全技（未収録を含む）",
      evade: "回避可能と明記",
      left: "左回避 SSL / SWL",
      right: "右回避 SSR / SWR",
      tracking: "片側への追尾",
      homing: "両側追尾 / Homing",
      unknown: "方向未収録",
    },
    response: "対策・追尾方向",
    conditions: "条件とタイミング",
    evidence: "根拠・出典",
    kinds: {
      evade: "回避方向",
      tracking: "この方向を追尾",
      homing: "両側を追尾",
      unknown: "方向未収録",
    },
    noGuess: "反対側の回避は推測しません",
    noEvidence: "技別方向の記載なし",
    quote: "原文の根拠を見る",
    afterBlock: "{n} 発目をガードした後",
    tentative: "原文は暫定的。優先して再検証",
    contexts: {
      range: "遠距離での左横歩きのみ記載。密着では未確認。",
      string: "指定段をガードした後の連係対策。初段前の回避ではありません。",
      unspecified: "横移動可能との記載のみ。方向・詳細タイミングは不明。",
      tracking: "この側を追尾。反対側で回避できるとは限りません。",
      homing: "出典に追尾の記載。ガード・間合い等も検討してください。",
      unknown: "記載がない技も、直線的・左右で回避可能とは限りません。",
    },
    practiceTitle: "トレーニングで対策を確認",
    practice:
      "単発技または連係を録画し、前置きのフレーム差と距離を固定して SSL・SSR・SWL・SWR 後のガードを試します。連係は指定段をガードしてから検証します。P1 / P2 と自分のキャラでも再確認し、ディレイ、壁際、軸ずれは別に記録してください。",
    moreResearch: "コミュニティ対策ページ（一部未作成）",
    controls: "横移動・横歩きの入力対照",
    defenderScope: "出典に記録のある防御側",
    contextsExtra:
      "初段ガード後、2 発目の前に左横移動。下記キャラのみ出典に記載。その他は未確認です。",
  },
};
