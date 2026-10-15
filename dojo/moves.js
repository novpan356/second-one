import snapshot from '../public/data/shaheen.json' with {type:'json'};
const specs = [
 ['1','左直拳','jabL'],['2','右直拳','jabR'],['3','蔽日高踢','kickL'],['4','拇趾踢','kickR'],
 ['df+1','中段左拳','midL'],['df+2','猎隼升击','uppercut'],['df+3','旋风踢','spin'],['df+4','中段右踢','midKick'],
 ['d+2','腹部冲击','bodyR'],['d+3','寂静猎户','lowL'],['d+4','凶狠踩踏','lowR'],['db+3','蛇咬','lowL'],['db+4','升弯刀','kickR'],
 ['b+1','水委一','midL'],['b+3','脚跟击','midKick'],['b+4','破碎幻影','midKick'],['f+2','前进右拳','jabR'],['f+4','穿刺之爪','kickR'],
 ['uf+3','新月劈击','hopL'],['uf+4','牵牛星','hopR'],['3+4','轮旋','spin'],['1+3','沙漠之牙','throw'],['2+4','毕宿五','throw'],
 ['1,2','角宿一','jabR'],['1,2,2','角宿一腹击','bodyR'],['1,2,3','角宿一蔽日','kickL'],['1,2,4','角宿一轮旋','spin'],
 ['2,1','切入','midL'],['2,3','东上相蔽日','kickL'],['4,1','拇趾踢 → 壁宿一','jabL'],['4,3','拇趾踢 → 高斩','kickL'],['4,4','拇趾踢 → 雷','midKick'],
 ['df+4,1','右踢左拳','midL'],['df+4,1,3','飞马','spin'],
];
export const moves = specs.map(([command,zh,style])=>{
 const source=snapshot.moves.find(m=>m.command===command && m.section!=='10 Strings');
 if(!source)throw Error('Missing source move '+command);
 const parsed=source.startup.match(/i(\d+)(?:~(\d+))?/),startup=Number(parsed[1]),active=Number(parsed[2]||parsed[1])-startup+1;
 const total=Number(source.recovery.match(/\bt(\d+)/)?.[1]) || startup+active+(style.includes('jab')?15:style==='throw'?32:24);
 const damage=Number(source.damage.split(',').at(-1).match(/\d+/)?.[0]||0);
 return {id:command,command,zh,style,source,startup,active,total:Math.max(total,startup+active+3),damage,
  level:style==='throw'?'throw':source.target.split(',').at(-1).toLowerCase(),
  radius:style==='uppercut'?.18:style==='throw'?.20:style.includes('jab')||['midL','uppercut','bodyR'].includes(style)?.14:.18,
  prototypeRecovery:!source.recovery.match(/\bt\d+/),
  homing:/\bHoming\b/i.test(source.notes),
  limb:style.endsWith('L')?'handL':['kickL','hopL','lowL','spin'].includes(style)?'footL':['kickR','hopR','lowR','midKick'].includes(style)?'footR':'handR',
 };
});
// Style-specific limb identity overrides the generic pose suffix.
for(const m of moves)if(['kickL','hopL','lowL','spin'].includes(m.style))m.limb='footL';
export const moveMap = new Map(moves.map(m=>[m.id,m]));
export const sourceInfo={url:snapshot.source,date:snapshot.snapshotDate,version:snapshot.gameVersion};
export function impact(move,counter=false,crouching=false) {
 const text=counter&&move.source.counter_hit?move.source.counter_hit:move.source.hit;
 let launch=/\da\b/.test(text),down=/\dd\b/.test(text),crouch=/\dc\b/.test(text);
 let advantage=Number(text.match(/[+-]?\d+/)?.[0]||0);
 if(move.id==='df+2' && crouching && !counter){launch=false;advantage=4;}
 if(move.style==='throw'){launch=false;down=true;}
 return {launch,down,crouch,advantage,text,orientation:move.style==='throw'?'FUFA':null};
}
