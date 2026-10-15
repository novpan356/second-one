import * as T from 'three';
const schema=[
 ['hips',null,[0,1,0]],['spine','hips',[0,.28,0]],['chest','spine',[0,.27,0]],['neck','chest',[0,.18,0]],['head','neck',[0,.14,0]],
 ['upperArmL','chest',[-.29,-.02,0]],['foreArmL','upperArmL',[0,-.35,0]],['handL','foreArmL',[0,-.33,0]],
 ['upperArmR','chest',[.29,-.02,0]],['foreArmR','upperArmR',[0,-.35,0]],['handR','foreArmR',[0,-.33,0]],
 ['thighL','hips',[-.15,-.02,0]],['shinL','thighL',[0,-.47,0]],['footL','shinL',[0,-.45,.04]],
 ['thighR','hips',[.15,-.02,0]],['shinR','thighR',[0,-.47,0]],['footR','shinR',[0,-.45,.04]],
];
export function createRig(){
 const group=new T.Group(),bones={},list=[];
 for(const[name,parent,pos]of schema){const bone=new T.Bone();bone.name=name;bone.position.fromArray(pos);bones[name]=bone;list.push(bone);(parent?bones[parent]:group).add(bone);}
 group.updateMatrixWorld(true);
 const skeleton=new T.Skeleton(list);skeleton.calculateInverses();
 return {group,bones,list,skeleton,mixer:new T.AnimationMixer(group),clips:new Map(),current:null};
}
const q=(x=0,y=0,z=0)=>new T.Quaternion().setFromEuler(new T.Euler(x,y,z)).toArray();
function basePose(){return {hips:q(),spine:q(-.05),chest:q(.08),neck:q(),head:q(),upperArmL:q(-.65,0,.15),foreArmL:q(-1.25),handL:q(),upperArmR:q(-.65,0,-.15),foreArmR:q(-1.25),handR:q(),thighL:q(-.16,0,.08),shinL:q(.22),footL:q(-.06),thighR:q(.18,0,-.08),shinR:q(.20),footR:q(-.38)};}
function attackPose(style,power){
 const p=basePose();let arm='L';
 if(['jabR','bodyR','uppercut','throw'].includes(style))arm='R';
 if(['jabL','jabR','midL','uppercut','bodyR','throw'].includes(style)){
  const angle=style==='uppercut'?-1.7:style==='bodyR'?-1.22:style==='midL'?-1.48:-1.67;
  p['upperArm'+arm]=q(angle,arm==='L'?.35:-.35,arm==='L'?.1:-.1);
  p['foreArm'+arm]=q(style==='uppercut'?-.4:.02);
  p.chest=q(style==='bodyR'?.32:.05,arm==='L'?.12:-.12);
  if(style==='throw'){p.upperArmL=q(-1.5,.4,.1);p.foreArmL=q(-.15);p.upperArmR=q(-1.5,-.4,-.1);p.foreArmR=q(-.15);}
 } else {
  const side=['kickL','hopL','lowL','spin'].includes(style)?'L':'R';
  const low=style.startsWith('low'),mid=style==='midKick';
  p['thigh'+side]=q(low?-1.35:mid?-1.65:-2.25,style==='spin'?.55:0,side==='L'?-.12:.12);
  p['shin'+side]=q(low?.4:mid?.15:.35);p['foot'+side]=q(.05);
  p.spine=q(.17);p.chest=q(-.2,style==='spin'?1.2:0);p.upperArmL=q(-.7,0,-.9);p.upperArmR=q(-.7,0,.9);
 }
 const base=basePose();for(const key of Object.keys(p)){p[key]=new T.Quaternion().fromArray(base[key]).slerp(new T.Quaternion().fromArray(p[key]),power).toArray();}
 return p;
}
function makeClip(name,points,positions){
 const tracks=[];
 for(const bone of Object.keys(points[0][1]))tracks.push(new T.QuaternionKeyframeTrack(bone+'.quaternion',points.map(x=>x[0]),points.flatMap(x=>x[1][bone])));
 if(positions)tracks.push(new T.VectorKeyframeTrack('hips.position',positions.map(x=>x[0]),positions.flatMap(x=>x[1])));
 return new T.AnimationClip(name,-1,tracks);
}
export function buildClips(rig,moves){
 const base=basePose(),idle2=basePose();idle2.chest=q(.1);idle2.spine=q(-.07);
 rig.clips.set('idle',makeClip('idle',[[0,base],[.8,idle2],[1.6,base]]));
 const walkA=basePose(),walkB=basePose();walkA.thighL=q(-.5);walkA.thighR=q(.4);walkB.thighL=q(.4);walkB.thighR=q(-.5);
 rig.clips.set('walk',makeClip('walk',[[0,walkA],[.35,walkB],[.7,walkA]]));
 const crouch=basePose();crouch.thighL=q(-1.1);crouch.thighR=q(-1.0);crouch.shinL=q(1.7);crouch.shinR=q(1.6);crouch.spine=q(.3);crouch.head=q(-.2);
 rig.clips.set('crouch',makeClip('crouch',[[0,crouch],[1,crouch]],[[0,[0,.55,0]],[1,[0,.55,0]]]));
 const hurt=basePose();hurt.chest=q(-.45);hurt.upperArmL=q(-.9,0,-.5);hurt.upperArmR=q(-.9,0,.5);
 rig.clips.set('hurt',makeClip('hurt',[[0,hurt],[.3,base]]));
 const air=basePose();air.hips=q(-.7);air.thighL=q(-.7);air.thighR=q(-.3);air.shinL=q(.9);air.shinR=q(.7);
 rig.clips.set('air',makeClip('air',[[0,air],[1,air]]));
 for(const orientation of ['FUFT','FUFA','FDFT','FDFA']){
  const face=orientation.startsWith('FU')?1:-1,head=orientation.endsWith('FA')?1:-1;
  const y=new T.Vector3(0,0,head),z=new T.Vector3(0,face,0),x=new T.Vector3().crossVectors(y,z);
  const down=basePose();down.hips=new T.Quaternion().setFromRotationMatrix(new T.Matrix4().makeBasis(x,y,z)).toArray();down.spine=q();down.chest=q();down.neck=q();down.head=q();
  down.upperArmL=q(0,0,-.4);down.upperArmR=q(0,0,.4);down.foreArmL=q(-.2);down.foreArmR=q(-.2);down.thighL=q();down.thighR=q();down.shinL=q(.1);down.shinR=q(.1);
  rig.clips.set('down'+orientation,makeClip('down'+orientation,[[0,down],[1,down]],[[0,[0,.22,0]],[1,[0,.22,0]]]));
 }
 for(const m of moves){
  const s=m.startup/60,end=(m.startup+m.active)/60,total=m.total/60;
  const wind=attackPose(m.style,-.15),strike=attackPose(m.style,1);
  rig.clips.set(m.id,makeClip(m.id,[[0,base],[s*.45,wind],[s,strike],[end,strike],[Math.min(end+.12,total-.001),attackPose(m.style,.65)],[total,base]]));
 }
}
export function sampleRig(actor,frame){
 const rig=actor.rig;
 const name=actor.attack?actor.attack.move.id:actor.down>0?'down'+(actor.orientation||'FUFT'):actor.air?'air':actor.stun>0?'hurt':actor.crouching?'crouch':actor.walking?'walk':'idle';
 const clip=rig.clips.get(name);if(!clip)return;
 if(rig.current!==name){rig.mixer.stopAllAction();rig.current=name;rig.action=rig.mixer.clipAction(clip);rig.action.setLoop(T.LoopOnce,1);rig.action.clampWhenFinished=true;rig.action.play();}
 rig.action.time=actor.attack?Math.min(actor.attack.frame/60,clip.duration):name==='hurt'?0:(frame/60)%clip.duration;
 // Restore rest hip position before sampling clips that do not animate translation.
 rig.bones.hips.position.set(0,1,0);
 rig.mixer.update(0);
 rig.group.position.set(actor.x,actor.y,actor.z);rig.group.rotation.y=actor.yaw ?? actor.facing*Math.PI/2;
 if(actor.attack?.move.style.startsWith('hop'))rig.group.position.y+=Math.sin(Math.PI*actor.attack.frame/actor.attack.move.total)*.3;
 rig.group.updateMatrixWorld(true);
}
export function joint(actor,name){return actor.rig.bones[name].getWorldPosition(new T.Vector3());}
export function volumes(actor){
 const at=n=>joint(actor,n);
 return [
  {a:at('neck'),b:at('head'),r:.17,part:'head'},
  {a:at('hips'),b:at('chest'),r:.24,part:'body'},
  {a:at('thighL'),b:at('footL'),r:.13,part:'leg'},
  {a:at('thighR'),b:at('footR'),r:.13,part:'leg'},
 ];
}
