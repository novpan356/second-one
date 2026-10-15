// Interpret opponent frame suffixes separately from the attacker's recovery/state.
export const effectCopy = {
  zh: {
    relevance:'匹配程度优先', title:'命中与收招效果', block:'被防御后 · 对手', hit:'普通命中 · 对手', counter:'反击命中 · 对手', self:'使用者收招',
    unknown:'未收录', normal:'普通受击；站／蹲姿未标注', guard:'防御结束姿态未标注',
    airborne:'浮空／空中状态', crouch:'蹲姿', down:'倒地 · 姿态未收录', guardable:'可防御恢复（g）',
    counterUnknown:'未单独收录，参阅普通命中及备注', unguardable:'不可防御／无防御帧数据',
    FUFT:'仰面倒地 · 脚朝对手（FUFT）', FUFA:'仰面倒地 · 头朝对手（FUFA）',
    FDFT:'俯面倒地 · 脚朝对手（FDFT）', FDFA:'俯面倒地 · 头朝对手（FDFA）',
    FUFL:'仰面倒地 · 脚朝左侧（FUFL）', FUFR:'仰面倒地 · 脚朝右侧（FUFR）', FDFL:'俯面倒地 · 脚朝左侧（FDFL）', FDFR:'俯面倒地 · 脚朝右侧（FDFR）', FDFL_FDFR:'俯面倒地 · 脚朝左／右侧（FDFL/FDFR）', tentative:'来源标注存疑', BT:'背向对手（BT）', FC:'蹲姿收招（FC）', standing:'站立收招',
    conditional:'含条件或状态变化，展开查看原始备注',
    note:'按来源帧数后缀和明确备注解读。普通数字不代表必定站立；浮空不保证可连段。倒地的头脚朝向以受击者相对攻击者为准；侧躺、轴线及未记录的落地姿态不作推断。',
    evidence:'来源标记', help:'支持 d/f+2、df2、↘+2、RP；可搜“电风”“倒地”“中段 浮空”，英文名称支持部分词和轻微拼写错误。',
  },
  en: {
    relevance:'Best match', title:'Impact & recovery',block:'On block · opponent',hit:'On hit · opponent',counter:'Counter hit · opponent',self:'Attacker recovery',
    unknown:'Not recorded',normal:'Normal hit; standing/crouching unspecified',guard:'Post-block stance unspecified',airborne:'Airborne',crouch:'Crouching',down:'Knockdown · orientation unknown',guardable:'Guardable recovery (g)',
    counterUnknown:'Not separately recorded; see normal hit and notes',unguardable:'Unblockable / no block frames',
    FUFT:'Face up · feet toward attacker (FUFT)',FUFA:'Face up · head toward attacker (FUFA)',FDFT:'Face down · feet toward attacker (FDFT)',FDFA:'Face down · head toward attacker (FDFA)',
    FUFL:'Face up · feet left (FUFL)', FUFR:'Face up · feet right (FUFR)', FDFL:'Face down · feet left (FDFL)', FDFR:'Face down · feet right (FDFR)', FDFL_FDFR:'Face down · feet left/right (FDFL/FDFR)', tentative:'Tentative in source', BT:'Back turned (BT)',FC:'Crouching recovery (FC)',standing:'Standing recovery',conditional:'Conditional effects; open source notes',
    note:'Decoded from source frame suffixes and explicit notes. Plain numbers do not establish standing recovery; airborne does not guarantee a combo. Ground orientation is relative to the attacker. Side-lying, axis and unspecified landings are not inferred.',
    evidence:'Source notation',help:'Try d/f+2, df2, ↘+2 or RP; search partial names, properties or multiple keywords. Minor name spelling errors are supported.',
  },
  ja: {
    relevance:'関連度順', title:'ヒット・硬直後の状態',block:'ガード後 · 相手',hit:'通常ヒット · 相手',counter:'カウンター · 相手',self:'使用側の硬直後',
    unknown:'未収録',normal:'通常ヒット・立ち／しゃがみ未記載',guard:'ガード後の姿勢は未記載',airborne:'空中状態',crouch:'しゃがみ',down:'ダウン・向き未収録',guardable:'ガード可能な回復（g）',
    counterUnknown:'個別データ未収録・通常ヒットと注釈を参照',unguardable:'ガード不能／ガードフレームなし',
    FUFT:'仰向け・足が攻撃側向き（FUFT）',FUFA:'仰向け・頭が攻撃側向き（FUFA）',FDFT:'うつ伏せ・足が攻撃側向き（FDFT）',FDFA:'うつ伏せ・頭が攻撃側向き（FDFA）',
    FUFL:'仰向け・足が左向き（FUFL）', FUFR:'仰向け・足が右向き（FUFR）', FDFL:'うつ伏せ・足が左向き（FDFL）', FDFR:'うつ伏せ・足が右向き（FDFR）', FDFL_FDFR:'うつ伏せ・足が左右向き（FDFL/FDFR）', tentative:'出典では未確定', BT:'背向け（BT）',FC:'しゃがみ状態で硬直終了（FC）',standing:'立ち状態で硬直終了',conditional:'条件による変化あり・原文注釈を確認',
    note:'出典のフレーム接尾辞と明示された注釈から表示。数値だけでは立ち状態を断定できず、浮きもコンボを保証しません。ダウンの向きは攻撃側が基準。横倒れ・軸・不明な着地状態は推定しません。',
    evidence:'出典の表記',help:'d/f+2・df2・↘+2・RP、技名の一部や複数キーワードに対応。英語技名の軽微な入力ミスも検索できます。',
  },
};
function frameState(raw, kind) {
  if (!raw) return kind === 'counter' ? 'counterUnknown' : 'unknown';
  if (raw === '!') return 'unguardable';
  const suffix = raw.match(/\d([a-z]+)\b/i)?.[1] || '';
  if (suffix.includes('a')) return 'airborne';
  if (suffix.includes('d')) return 'down';
  if (suffix.includes('c')) return 'crouch';
  if (/^[+-]?\d+(?:~[+-]?\d+)?g?$/.test(raw)) return kind === 'block' ? 'guard' : 'normal';
  return 'unknown';
}
export function moveEffects(move) {
  const notes = move.notes || '';
  const result = {};
  for (const [kind, field] of [['block','block'],['hit','hit'],['counter','counter_hit']]) {
    const raw = move[field] || '';
    result[kind] = { state: frameState(raw, kind), raw, guardable: /\dg\b|\d[csg]*g\b/.test(raw) };
  }
  // Scope ground codes to explicit opponent outcomes, never to input notation or self recovery.
  const orientation = notes.match(/Opponent (?:status on hit:\s*|recovers in\s+|left\s+)((?:FU|FD)F[TALR](?:\/(?:FU|FD)F[TALR])?)(\?)?/i)
    || notes.match(/\b((?:FU|FD)F[TALR])(\?)?\s+knockdown on hit/i);
  if (orientation) result.hit = {...result.hit, state: orientation[1].toUpperCase().replace('/', '_'), tentative: Boolean(orientation[2])};
  const counterOrientation = notes.match(/\b((?:FU|FD)F[TALR])(\?)?\s+knockdown on (?:CH|counter hit)/i);
  if (counterOrientation) result.counter = {...result.counter, state:counterOrientation[1].toUpperCase(), tentative:Boolean(counterOrientation[2])};
  for (const [kind, trigger] of [['block','block'],['hit','hit'],['counter','(?:CH|counter hit)']]) {
    if (new RegExp('(?:Forces crouch|Opponent recovers crouching) on ' + trigger + '\\b', 'i').test(notes)) {
      result[kind] = {...result[kind], state:'crouch'};
    }
  }
  result.self = { state: /(?:^|\s)(?:r)?FC\b/.test(move.recovery || '') ? 'FC' : /(?:^|\s)(?:r)?BT\b/.test(move.recovery || '') ? 'BT' : 'unknown', raw:move.recovery || '' };
  result.conditional = /\b(?:against|only|if|unless|during|heat dash|on CH|on counter hit|on air hit|wall|clean hit|(?:first|1st|second|2nd) hit)\b/i.test(notes);
  return result;
}
