// Keep simultaneous buttons (+), sequences (,), and just-frame inputs (#) distinct.
export function normalizeCommand(value = '') {
  return value.normalize('NFKC').toLowerCase()
    .replace(/↘|d\s*\/\s*f/g, 'df').replace(/↙|d\s*\/\s*b/g, 'db')
    .replace(/↗|u\s*\/\s*f/g, 'uf').replace(/↖|u\s*\/\s*b/g, 'ub')
    .replace(/→/g, 'f').replace(/←/g, 'b').replace(/↓/g, 'd').replace(/↑/g, 'u')
    .replace(/\b(?:lp|rp|lk|rk)\b/g, x => ({lp:'1',rp:'2',lk:'3',rk:'4'})[x])
    .replace(/\s+/g, '').replace(/([a-z])\+(?=[1-4])/g, '$1');
}
const normalizeText = (s = '') => s.normalize('NFKC').toLowerCase().replace(/[_-]/g, ' ').replace(/\s+/g, ' ').trim();
const aliases = [
  [/^(电风|电风拳|最速风神拳|最速風神拳|ewgf)$/i, /electric wind (?:god|hook) fist/i],
  [/^(风神拳|風神拳|wgf)$/i, /wind (?:god|hook) fist/i],
  [/^(地狱扫|地狱扫腿|地獄払い|hellsweep)$/i, /hell\s*sweep|spinning demon/i],
  [/^(跳踢|hopkick)$/i, /hop\s*kick/i],
];
const properties = {
  '浮空': m => /\d+a/.test(m.hit || ''), 'launcher': m => /\d+a/.test(m.hit || ''),
  '倒地': m => /\d+d/.test(m.hit || ''), 'knockdown': m => /\d+d/.test(m.hit || ''),
  '蹲姿': m => /\d+c/.test(`${m.hit} ${m.block} ${m.counter_hit}`),
  '上段': m => /^(h|high)$/.test(m.target), '中段': m => /^(m|mid)$/.test(m.target),
  '下段': m => /^(l|low)$/.test(m.target), '投技': m => /throw/i.test(m.section) || /^(?:th?)(?:\(|$)/i.test(m.target),
  '追踪': m => /\bhoming\b/i.test(m.notes), '追蹤': m => /\bhoming\b/i.test(m.notes),
  '霸体': m => /power crush/i.test(m.notes) || /pc\d/.test(m.states || ''),
  '龙卷': m => /tornado|strong aerial tailspin/i.test(m.notes),
  '墙崩': m => /wall splat/i.test(m.notes),
  '不可防御': m => m.block === '!',
  '热启动': m => /heat engager/i.test(m.notes), '熱発動': m => /heat engager/i.test(m.notes),
};
const cache = new WeakMap();
function index(move) {
  if (!cache.has(move)) cache.set(move, {
    name: normalizeText(move.name),
    text: normalizeText([move.name, move.command, move.displayed_input, ...(move.alt || []), move.notes, move.section, move.target].join(' ')),
    commands: [move.command, move.displayed_input, ...(move.alt || [])].filter(Boolean).map(normalizeCommand),
  });
  return cache.get(move);
}
function oneEdit(a, b) {
  if (Math.abs(a.length-b.length)>1) return false;
  let i=0,j=0,edits=0;
  while(i<a.length && j<b.length) {
    if(a[i]===b[j]) {i++;j++;continue;}
    if(++edits>1) return false;
    if(a.length>=b.length)i++;
    if(b.length>=a.length)j++;
  }
  return edits + (i<a.length || j<b.length ? 1 : 0) <= 1;
}
export function moveSearchScore(move, query) {
  const q = normalizeText(query);
  if (!q) return 0;
  const idx = index(move), cmd = normalizeCommand(query);
  if (idx.commands.includes(cmd) || idx.name === q) return 100;
  const alias = aliases.find(([pattern]) => pattern.test(q));
  if (alias) return alias[1].test(move.name) ? 85 : -1;
  if (properties[q]) return properties[q](move) ? 75 : -1;
  const looksCommand = /[1-4]/.test(cmd) && /^[a-z0-9+,.*#~_()/\[\]-]+$/.test(cmd);
  if (looksCommand && idx.commands.some(c => c.startsWith(cmd))) return 90;
  if (idx.name.includes(q)) return 80;
  if (idx.text.includes(q)) return 60;
  const tokens = q.split(' ');
  if (tokens.every(token => properties[token]?.(move) || aliases.some(([p, name]) => p.test(token) && name.test(move.name)) || idx.text.includes(token) ||
    (/[1-4]/.test(token) && idx.commands.some(c => c.includes(normalizeCommand(token)))))) return 50;
  // Only tolerate spelling errors in names. Never guess a mistyped input or frame value.
  if (tokens.every(token => idx.name.includes(token) ||
    (/^[a-z]{4,}$/.test(token) && idx.name.split(/\W+/).some(word => oneEdit(token,word))))) return 25;
  return -1;
}
