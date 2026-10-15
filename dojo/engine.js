import {Vector3} from 'three';
import {moves,moveMap,impact} from './moves.js';
import {createRig,buildClips,sampleRig,joint,volumes} from './rig.js';
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
// Closest points of two finite line segments; hit/hurt volumes are capsules, not distance-only guesses.
export function capsuleOverlap(a,b){
 const u=a.b.clone().sub(a.a),v=b.b.clone().sub(b.a),w=a.a.clone().sub(b.a);
 const A=u.dot(u),B=u.dot(v),C=v.dot(v),D=u.dot(w),E=v.dot(w),den=A*C-B*B;
 let s=0,t=0;
 if(A<=1e-8){t=C>1e-8?clamp(E/C,0,1):0;}
 else if(C<=1e-8){s=clamp(-D/A,0,1);}
 else {s=den>1e-8?clamp((B*E-C*D)/den,0,1):0;t=(B*s+E)/C;
  if(t<0){t=0;s=clamp(-D/A,0,1);}else if(t>1){t=1;s=clamp((B-D)/A,0,1);}
 }
 const pa=a.a.clone().addScaledVector(u,s),pb=b.a.clone().addScaledVector(v,t);
 return pa.distanceToSquared(pb)<=(a.r+b.r)**2;
}
const buildActor=(id,x,facing)=>{const rig=createRig();buildClips(rig,moves);return {id,x,z:0,y:0,facing,yaw:facing*Math.PI/2,rig,hp:180,attack:null,stun:0,down:0,air:false,vy:0,crouching:false,walking:false,guard:false,orientation:null,queue:null,jumpLatch:false,combo:0,comboDamage:0};};
export class FightEngine {
 constructor(){this.player=buildActor('player',-.52,1);this.bot=buildActor('bot',.52,-1);this.frame=0;this.freeze=0;this.botMode='stand';this.infinite=false;this.paused=false;this.slow=false;this.inputs={left:false,right:false,up:false,down:false,ssl:false,ssr:false};this.events=[];this.history=[];this.feedback='READY';this.lastMove=null;this.boxes=[];this.lastImpact=null;this.botTimer=80;this.reset();}
 reset(){for(const [actor,x,f]of [[this.player,-.52,1],[this.bot,.52,-1]]){Object.assign(actor,{x,z:0,y:0,facing:f,yaw:f*Math.PI/2,hp:180,attack:null,stun:0,down:0,air:false,vy:0,crouching:false,walking:false,guard:false,orientation:null,queue:null,combo:0,comboDamage:0,jumpLatch:false,upFrames:0});sampleRig(actor,this.frame);}this.freeze=0;this.feedback='READY';this.lastImpact=null;this.boxes=[];this.botTimer=80;}
 emit(type,detail={}){const e={type,frame:this.frame,...detail};this.events.push(e);if(this.events.length>100)this.events.shift();this.feedback=type;return e;}
 direction(){const i=this.inputs,h=(i.right?1:0)-(i.left?1:0),v=i.down?'d':i.up?'u':'';return (v+(h?(h===this.player.facing?'f':'b'):''))||'n';}
 press(buttons){
  const dir=this.direction(),actor=this.player;
  let command=(dir==='n'?'':dir+'+')+buttons;
  const previous=actor.attack?.move.id;
  if(dir==='n'&&previous&&moveMap.has(previous+','+buttons))command=previous+','+buttons;
  this.history.unshift({dir,buttons,command,frame:this.frame});this.history=this.history.slice(0,12);
  if(!moveMap.has(command)){this.emit('未实现指令',{command});return false;}
  return this.request(actor,command);
 }
 request(actor,command,demo=false){const move=moveMap.get(command);if(!move)return false;
  if(actor.hp<=0||actor.down||actor.air)return false;
  const chained=actor.attack&&command.startsWith(actor.attack.move.id+',');
  if(actor.stun||actor.attack){actor.queue={command,until:this.frame+14,chained,demo};return true;}
  this.start(actor,move,demo);return true;
 }
 start(actor,move,demo=false){actor.attack={move,frame:0,connected:false,serial:this.frame,demo};actor.crouching=false;actor.guard=false;actor.queue=null;if(actor===this.player)this.lastMove=move;this.emit(demo?'演示':'出招',{actor:actor.id,command:move.id});}
 defense(actor,move){if((actor.stun&&actor.stunKind!=='block')||actor.attack||actor.air||actor.down)return false;
  if(actor===this.bot&&this.botMode==='allGuard')return move.level!=='throw';
  return actor.guard&&(move.level==='l'?actor.crouching:!actor.crouching)&&move.level!=='throw';}
 tick(){if(this.paused)return;this.frame++;
  if(this.freeze>0){this.freeze--;return;}
  const p=this.player,b=this.bot;
  if(!p.attack&&!p.stun&&!p.air&&!p.down&&p.hp>0){
   const i=this.inputs,h=(i.right?1:0)-(i.left?1:0);p.crouching=i.down;p.guard=h===-p.facing;p.walking=Boolean(h||i.ssl||i.ssr);
   p.x+=h*(p.crouching?.013:.033);p.z+=((i.ssl?1:0)-(i.ssr?1:0))*p.facing*.035;
   if(i.up&&!p.jumpLatch){p.upFrames=(p.upFrames||0)+1;if(p.upFrames>10){p.air=true;p.vy=.10;p.jumpLatch=true;}}
   if(!i.up){p.upFrames=0;p.jumpLatch=false;}
  }else p.walking=false;
  if(!b.attack&&!b.stun&&!b.air&&!b.down){b.crouching=this.botMode==='crouch';b.guard=this.botMode==='guard'||this.botMode==='crouch';}
  if(this.botMode==='jab'&&!b.attack&&!b.stun&&!b.air&&!b.down&&b.hp>0&&--this.botTimer<=0){this.start(b,moveMap.get('1'));this.botTimer=65;}
  for(const a of [p,b]){
   if(a.stun>0)a.stun--;if(a.down>0&&--a.down===0){a.orientation=null;a.combo=0;}
   if(a.air){a.y+=a.vy;a.vy-=.004;if(a.y<=0&&a.vy<0){a.y=0;a.air=false;a.vy=0;a.down=a.hp<=0?999999:34;a.orientation='FUFT';a.stun=0;a.combo=0;}}
   if(a.attack){a.attack.frame++;const m=a.attack.move;if(a.attack.frame<=m.startup){a.x+=Math.sin(a.yaw)*.006;a.z+=Math.cos(a.yaw)*.006;}
    if(a.attack.frame>=m.total){a.attack=null;}
   }
   if(a.queue){const queued=a.queue;
    if(queued.until<this.frame)a.queue=null;
    else if(!a.stun&&!a.air&&!a.down&&(!a.attack||(queued.chained&&a.attack.frame>=a.attack.move.startup+a.attack.move.active+2))){this.start(a,moveMap.get(queued.command),queued.demo);}
   }
   a.x=clamp(a.x,-4.1,4.1);a.z=clamp(a.z,-2.7,2.7);
  }
  // Push capsules are horizontal ground volumes and do not prevent aerial crossovers.
  if(!p.air&&!b.air){let dx=b.x-p.x,dz=b.z-p.z,dist=Math.hypot(dx,dz);if(dist<.68){if(dist<.001){dx=.001;dz=0;dist=.001;}const push=(.68-dist)/2;p.x-=dx/dist*push;b.x+=dx/dist*push;p.z-=dz/dist*push;b.z+=dz/dist*push;}}
  for(const a of [p,b]){
   a.x=clamp(a.x,-4.1,4.1);a.z=clamp(a.z,-2.7,2.7);
   const target=a===p?b:p;
   if(!a.down&&!a.air&&(!a.attack||a.attack.move.homing)){a.facing=target.x-a.x>=0?1:-1;a.yaw=Math.atan2(target.x-a.x,target.z-a.z);}
  }
  for(const a of [p,b])sampleRig(a,this.frame);
  this.boxes=[];
  // Resolve both actors from the same frame pose. Attack connections are single-use per segment.
  const contacts=[];
  for(const [a,d]of [[p,b],[b,p]]){
   const attack=a.attack;if(!attack)continue;const m=attack.move;
   if(attack.frame<m.startup||attack.frame>=m.startup+m.active||attack.connected)continue;
   const end=joint(a,m.limb),parent=joint(a,m.limb.startsWith('foot')?m.limb==='footL'?'shinL':'shinR':m.limb==='handL'?'foreArmL':'foreArmR');
   const start=end.clone().lerp(parent,.35),box={a:start,b:end,r:m.radius,actor:a.id};this.boxes.push(box);
   if(d.hp<=0||d.down>0)continue;
   if(m.level==='h'&&d.crouching&&!d.air)continue;
   if(m.level==='throw'&&(d.crouching||d.air))continue;
   if(volumes(d).some(v=>capsuleOverlap(box,v)))contacts.push({a,d,m,end,attack,counter:Boolean(d.attack&&!d.attack.connected)});
  }
  for(const c of contacts)this.connect(c);
 }
 connect({a,d,m,end,attack,counter}){
  if(attack.connected)return;attack.connected=true;
  const blocked=this.defense(d,m),remaining=Math.max(0,m.total-attack.frame);
  if(blocked){const advantage=Number(m.source.block.match(/[+-]?\d+/)?.[0]||0);d.stun=Math.max(1,remaining+advantage);d.stunKind='block';d.crouching=/\dc/.test(m.source.block)||m.level==='l';this.freeze=3;this.lastImpact={point:end.clone(),type:'block',age:0};this.emit('防御',{actor:a.id,command:m.id,advantage});a.combo=0;return;}
  const wasAir=d.air,wasCrouch=d.crouching,out=impact(m,counter,wasCrouch),scaling=wasAir?Math.max(.3,.8-a.combo*.1):1,damage=Math.max(1,Math.round(m.damage*scaling));
  a.combo=d.stun>0||wasAir?a.combo+1:1;a.comboDamage=a.combo===1?damage:a.comboDamage+damage;
  d.hp=this.infinite?180:Math.max(0,d.hp-damage);d.attack=null;d.queue=null;d.stunKind='hit';d.stun=Math.max(1,remaining+out.advantage);d.crouching=out.crouch;d.guard=false;
  if(out.launch||wasAir){d.air=true;d.y=Math.max(.02,d.y);const flight=wasAir?30:clamp(d.stun,38,65);d.vy=wasAir?.075:.004*flight/2;}
  else if(out.down||d.hp<=0){d.down=d.hp<=0?999999:48;d.orientation=out.orientation||'FUFT';d.stun=0;}
  const dx=d.x-a.x,dz=d.z-a.z,len=Math.hypot(dx,dz)||1;d.x=clamp(d.x+dx/len*.12,-4.1,4.1);d.z=clamp(d.z+dz/len*.12,-2.7,2.7);
  this.freeze=5;this.lastImpact={point:end.clone(),type:counter?'counter':'hit',age:0};
  this.emit(d.hp<=0?'K.O.':wasAir?'空中连击':out.launch?'浮空':out.down?'倒地':counter?'COUNTER':'命中',{actor:a.id,command:m.id,damage,advantage:out.advantage,orientation:out.orientation,prototype:!out.orientation&&out.down});
 }
 step(frames=1){for(let i=0;i<frames;i++)this.tick();}
}
