import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {volumes} from './rig.js';
const box=(x,y,z)=>new T.BoxGeometry(x,y,z);
function scarfTexture(bot){const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d');g.fillStyle='#e2ddc8';g.fillRect(0,0,64,64);g.strokeStyle=bot?'#355675':'#85302d';g.lineWidth=3;for(let i=-64;i<128;i+=10){g.beginPath();g.moveTo(i,0);g.lineTo(i+64,64);g.stroke();g.beginPath();g.moveTo(i,64);g.lineTo(i+64,0);g.stroke();}const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;return tex;}
function skinModel(actor,bot=false){
 const rig=actor.rig;rig.mixer.stopAllAction();rig.current=null;rig.group.position.set(0,0,0);rig.group.rotation.set(0,0,0);for(const b of rig.list)b.quaternion.identity();rig.bones.hips.position.set(0,1,0);rig.group.updateMatrixWorld(true);rig.skeleton.calculateInverses();
 const colors=[bot?'#a8977d':'#b78a62','#d4ccb5',bot?'#234658':'#6b7053',bot?'#273849':'#565c42','#f2e8cf','#23282a','#25201e','#92774c'];
 const materials=colors.map(color=>new T.MeshStandardMaterial({color,roughness:.86,flatShading:true}));materials[4].map=scarfTexture(bot);
 const pieces=[],indices=[];
 function piece(geometry,boneName,material,offset=[0,0,0],rotation=[0,0,0],child){
  const bone=rig.bones[boneName],index=rig.list.indexOf(bone),childIndex=child?rig.list.indexOf(rig.bones[child]):index;
  geometry=geometry.toNonIndexed();const m=new T.Matrix4().compose(new T.Vector3(...offset),new T.Quaternion().setFromEuler(new T.Euler(...rotation)),new T.Vector3(1,1,1));geometry.applyMatrix4(m);geometry.applyMatrix4(bone.matrixWorld);
  const count=geometry.attributes.position.count,si=[],sw=[],p=new T.Vector3(),childPos=child?rig.bones[child].getWorldPosition(new T.Vector3()):null;
  for(let i=0;i<count;i++){p.fromBufferAttribute(geometry.attributes.position,i);const weight=childPos?Math.max(0,1-p.distanceTo(childPos)/.1)*.3:0;si.push(index,childIndex,0,0);sw.push(1-weight,weight,0,0);}
  geometry.setAttribute('skinIndex',new T.Uint16BufferAttribute(si,4));geometry.setAttribute('skinWeight',new T.Float32BufferAttribute(sw,4));pieces.push(geometry);indices.push(material);
 }
 piece(box(.44,.22,.28),'hips',3,[0,.02,0]);piece(box(.48,.30,.28),'spine',2,[0,-.04,0]);piece(box(.55,.28,.31),'chest',2,[0,-.05,0]);
 piece(box(.49,.07,.30),'hips',5,[0,.12,0]);piece(box(.07,.07,.025),'hips',7,[0,.12,.167]);
 for(const x of [-.135,.135])piece(box(.18,.14,.045),'chest',7,[x,-.08,.18]);
 piece(box(.035,.35,.04),'chest',5,[-.23,.01,.17],[0,0,.1]);piece(box(.035,.35,.04),'chest',5,[.23,.01,.17],[0,0,-.1]);
 piece(new T.CylinderGeometry(.07,.08,.18,8),'neck',0,[0,.04,0]);
 piece(new T.SphereGeometry(.147,12,10).scale(.9,1.16,.92),'head',0,[0,.025,.01]);
 piece(box(.23,.115,.07),'head',6,[0,-.065,.12]);piece(new T.ConeGeometry(.032,.08,4),'head',0,[0,.005,.165],[Math.PI/2,0,0]);
 for(const x of [-.055,.055]){piece(box(.048,.016,.02),'head',6,[x,.065,.14]);piece(box(.028,.013,.02),'head',5,[x,.043,.151]);}
 piece(box(.32,.12,.29),'head',4,[0,.15,-.02]);piece(box(.07,.37,.27),'head',4,[-.16,-.05,-.05],[0,0,-.09]);piece(box(.07,.37,.27),'head',4,[.16,-.05,-.05],[0,0,.09]);
 piece(new T.TorusGeometry(.166,.017,5,20),'head',5,[0,.13,-.015],[Math.PI/2,0,0]);
 for(const side of ['L','R']){
  piece(new T.CapsuleGeometry(.082,.19,4,8),'upperArm'+side,1,[0,-.13,0],[0,0,0],'foreArm'+side);
  piece(new T.CapsuleGeometry(.069,.21,4,8),'foreArm'+side,0,[0,-.16,0],[0,0,0],'hand'+side);
  piece(box(.13,.1,.13),'foreArm'+side,5,[0,-.26,0]);piece(new T.SphereGeometry(.085,8,6).scale(.85,1.03,1.15),'hand'+side,0,[0,-.015,.025]);
  piece(new T.CapsuleGeometry(.118,.25,4,8),'thigh'+side,3,[0,-.23,0],[0,0,0],'shin'+side);
  piece(new T.CapsuleGeometry(.087,.28,4,8),'shin'+side,3,[0,-.22,0],[0,0,0],'foot'+side);
  piece(box(.16,.20,.10),'shin'+side,2,[0,-.02,.07]);piece(box(.15,.17,.30),'foot'+side,5,[0,-.005,.08]);
 }
 const merged=mergeGeometries(pieces,true);merged.groups.forEach((g,i)=>g.materialIndex=indices[i]);const mesh=new T.SkinnedMesh(merged,materials);mesh.castShadow=true;mesh.receiveShadow=true;mesh.bind(rig.skeleton);mesh.frustumCulled=false;rig.group.add(mesh);rig.mesh=mesh;
 rig.helper=new T.SkeletonHelper(rig.group);rig.helper.material.depthTest=false;rig.helper.visible=false;
 return rig.group;
}
function signTexture(text){const c=document.createElement('canvas');c.width=1024;c.height=256;const g=c.getContext('2d');g.fillStyle='#191b18';g.fillRect(0,0,1024,256);g.strokeStyle='#b59252';g.lineWidth=12;g.strokeRect(12,12,1000,232);g.fillStyle='#dec996';g.font='bold 116px serif';g.textAlign='center';g.textBaseline='middle';g.fillText(text,512,126);const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;return t;}
function stage(scene){
 const wood=new T.MeshStandardMaterial({color:'#594539',roughness:.8}),dark=new T.MeshStandardMaterial({color:'#171c20',roughness:.9}),gold=new T.MeshStandardMaterial({color:'#9d7a45',metalness:.45,roughness:.5}),paper=new T.MeshStandardMaterial({color:'#d4b990',emissive:'#8e6032',emissiveIntensity:.23}),red=new T.MeshStandardMaterial({color:'#6b2527',roughness:.9});
 const put=(geo,mat,pos,rotation)=>{const m=new T.Mesh(geo,mat);m.position.fromArray(pos);if(rotation)m.rotation.fromArray(rotation);m.receiveShadow=true;m.castShadow=true;scene.add(m);return m;};
 put(box(15,.4,11),dark,[0,-.27,0]);
 for(let i=0;i<30;i++){const mat=new T.MeshStandardMaterial({color:new T.Color('#74634e').multiplyScalar(.88+(i%5)*.045),roughness:.9});put(box(.465,.12,10),mat,[-6.97+i*.48,-.02,0]);}
 for(const z of [-3.05,3.05])put(box(8.9,.025,.065),gold,[0,.053,z]);for(const x of [-4.45,4.45])put(box(.065,.025,6.15),gold,[x,.053,0]);
 put(box(14,4,.3),dark,[0,1.8,-4.6]);put(box(3.3,2.6,.09),wood,[0,1.45,-4.39]);
 const sign=put(box(2.9,.72,.1),new T.MeshStandardMaterial({map:signTexture('三島道場'),roughness:.75}),[0,3.1,-4.35]);
 for(const x of [-5,-2.5,2.5,5]){
  put(box(.21,4.25,.23),red,[x,1.9,-4.1]);put(box(.35,.13,.36),gold,[x,.14,-4.1]);
  if(Math.abs(x)>3){put(box(1.8,2.6,.08),paper,[x,1.65,-4.37]);for(let i=-3;i<=3;i++)put(box(.035,2.6,.04),wood,[x+i*.24,1.65,-4.28]);for(const y of [.6,1.4,2.2,2.9])put(box(1.85,.035,.05),wood,[x,y,-4.28]);}
 }
 for(const z of [-4,0,4])for(const x of [-6.2,6.2]){put(box(.25,4.4,.25),wood,[x,2,z]);put(box(.40,.15,.4),gold,[x,.12,z]);}
 for(const y of [3.7,4.3])put(box(13.4,.17,.22),wood,[0,y,-4.1]);
 for(const x of [-5.8,5.8]){put(new T.CylinderGeometry(.2,.14,.25,8),gold,[x,.2,-3.4]);put(new T.CylinderGeometry(.075,.1,1.1,8),dark,[x,.85,-3.4]);const lantern=put(new T.SphereGeometry(.24,12,8).scale(1,1.35,1),paper,[x,1.7,-3.4]);const light=new T.PointLight('#ffcb80',11,8,2);light.position.copy(lantern.position);scene.add(light);}
 const light=new T.HemisphereLight('#bcd7ec','#403023',2);scene.add(light);
 const key=new T.DirectionalLight('#ffe1b0',3.1);key.position.set(-3,7,5);key.castShadow=true;key.shadow.mapSize.set(1024,1024);Object.assign(key.shadow.camera,{left:-7,right:7,top:7,bottom:-7,near:.5,far:20});key.shadow.bias=-.0006;scene.add(key);
 const rim=new T.DirectionalLight('#71aee8',2);rim.position.set(5,4,-3);scene.add(rim);
}
export class DojoView {
 constructor(canvas,engine){
  this.engine=engine;this.canvas=canvas;this.renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'});this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=T.PCFSoftShadowMap;this.renderer.outputColorSpace=T.SRGBColorSpace;this.renderer.toneMapping=T.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.12;
  this.scene=new T.Scene();this.scene.background=new T.Color('#0c141e');this.scene.fog=new T.Fog('#0c141e',13,29);
  this.camera=new T.PerspectiveCamera(36,1,.05,70);this.controls=new OrbitControls(this.camera,canvas);this.controls.target.set(0,1,0);this.controls.enablePan=false;this.controls.enableDamping=true;this.controls.minDistance=4.5;this.controls.maxDistance=15;this.controls.maxPolarAngle=Math.PI*.49;this.controls.minPolarAngle=.3;
  stage(this.scene);
  for(const [actor,bot]of [[engine.player,false],[engine.bot,true]]){this.scene.add(skinModel(actor,bot));this.scene.add(actor.rig.helper);}
  this.debug=new T.Group();this.scene.add(this.debug);this.debugPool=[];this.boxesVisible=false;this.bonesVisible=false;
  this.spark=new T.Group();this.scene.add(this.spark);this.spark.visible=false;
  for(let i=0;i<12;i++){const m=new T.Mesh(new T.BoxGeometry(.013,.013,.1),new T.MeshBasicMaterial({color:'#ffcf7c'}));this.spark.add(m);}
  this.resetCamera();this.resize();this.observer=new ResizeObserver(()=>this.resize());this.observer.observe(canvas.parentElement);
 }
 resize(){const r=this.canvas.parentElement.getBoundingClientRect();this.renderer.setSize(r.width,r.height,false);this.camera.aspect=r.width/r.height;this.camera.updateProjectionMatrix();}
 resetCamera(){const mobile=this.canvas.parentElement.clientWidth<650;this.camera.position.set(.6,mobile?2.8:3.4,mobile?7.4:9.0);this.controls.target.set(0,1.05,0);this.controls.update();}
 volume(a,b,r,color,index){let object=this.debugPool[index];if(!object){object=new T.Group();object.line=new T.Mesh(new T.CylinderGeometry(1,1,1,8,1,true),new T.MeshBasicMaterial({color,wireframe:true,transparent:true,opacity:.65,depthTest:false}));object.add(object.line);object.caps=[0,1].map(()=>{const s=new T.Mesh(new T.SphereGeometry(1,8,5),object.line.material);object.add(s);return s;});this.debugPool.push(object);this.debug.add(object);}object.visible=true;object.line.material.color.set(color);const delta=b.clone().sub(a);object.line.position.copy(a).add(b).multiplyScalar(.5);object.line.scale.set(r,Math.max(.001,delta.length()),r);object.line.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),delta.normalize());object.caps[0].position.copy(a);object.caps[1].position.copy(b);for(const cap of object.caps)cap.scale.setScalar(r);}
 draw(dt){
  const e=this.engine;let index=0;
  this.controls.update();this.debug.visible=this.boxesVisible&&!this.libraryMode;
  for(const a of [e.player,e.bot]){a.rig.helper.visible=this.bonesVisible&&!this.libraryMode;if(this.boxesVisible&&!this.libraryMode){for(const v of volumes(a))this.volume(v.a,v.b,v.r,'#69edac',index++);this.volume(new T.Vector3(a.x,.35,a.z),new T.Vector3(a.x,1.25,a.z),.34,'#4caaff',index++);}}
  for(const v of e.boxes)if(this.boxesVisible&&!this.libraryMode)this.volume(v.a,v.b,v.r,'#ff294f',index++);
  for(let i=index;i<this.debugPool.length;i++)this.debugPool[i].visible=false;
  if(e.lastImpact&&!this.libraryMode){const hit=e.lastImpact;hit.age+=dt;this.spark.visible=hit.age<.25;this.spark.position.copy(hit.point);const hue=hit.type==='block'?'#5cbaff':hit.type==='counter'?'#ff643e':'#ffdc90';this.spark.children.forEach((p,i)=>{p.material.color.set(hue);const angle=i*Math.PI/6,d=.07+hit.age*1.8;p.position.set(Math.cos(angle)*d,Math.sin(angle)*d,0);p.rotation.z=-angle;p.scale.setScalar(Math.max(.1,1-hit.age*3));});}else this.spark.visible=false;
  if(this.libraryMixer)this.libraryMixer.update(dt);
  this.renderer.render(this.scene,this.camera);
 }
 async previewLibrary(){if(!this.library){const gltf=await new GLTFLoader().loadAsync('../dojo-resources/generic-rig.gltf');this.library=gltf.scene;this.libraryClips=gltf.animations;const bounds=new T.Box3().setFromObject(this.library),height=bounds.max.y-bounds.min.y,scale=1.95/height;this.library.scale.setScalar(scale);this.library.position.y=-bounds.min.y*scale;this.scene.add(this.library);this.libraryMixer=new T.AnimationMixer(this.library);}
  this.libraryMode=true;this.library.visible=true;for(const a of [this.engine.player,this.engine.bot])a.rig.group.visible=false;this.engine.paused=true;this.resetCamera();this.camera.position.set(0,2.6,5.8);this.playLibrary(this.libraryClips.find(c=>c.name==='Idle_Loop')?.name||this.libraryClips[0].name);return this.libraryClips.map(c=>c.name);
 }
 playLibrary(name){this.libraryMixer.stopAllAction();const clip=this.libraryClips.find(c=>c.name===name);if(clip)this.libraryMixer.clipAction(clip).play();}
 closeLibrary(){this.libraryMode=false;if(this.library)this.library.visible=false;this.libraryMixer?.stopAllAction();for(const a of [this.engine.player,this.engine.bot])a.rig.group.visible=true;this.engine.paused=false;this.resetCamera();}
}
