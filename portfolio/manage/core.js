/* Shared local-only project validation and dependency-free ZIP export. */
(() => {
 'use strict';
 const MAX_FILE=100*1024*1024,MAX_TOTAL=350*1024*1024;
 const fields={name:'主页姓名',entryWord:'欢迎页英文（最多 16 个字符）',role:'身份说明',email:'联系邮箱',bio:'个人介绍',tagline:'主标题上方文字',collection:'作品合集文字',heroNote:'主页底部说明',storyTitle:'精选故事标题',storyText:'精选故事说明',aboutTitle:'关于我标题'};
 const defaults={entryWord:'CREATIVITY',tagline:'PHOTOGRAPHY / FILM / VISUAL STORIES',collection:'作品合集',heroNote:'精选影像与摄影作品',storyTitle:'把转瞬，留成永恒。',storyText:'关于光、时间，和那些不经意的心动。',aboutTitle:'在光影里，发现另一种日常。'};
 const mediaPattern=/^data:(image\/(?:png|jpeg|webp)|video\/(?:mp4|webm));base64,([A-Za-z0-9+/]*={0,2})$/;
 const text=(v,max=3000)=>{if(typeof v!=='string'||v.length>max)throw Error('项目文字格式或长度无效');return v;};
 function media(v,kind){if(!v)return '';if(typeof v!=='string')throw Error('素材格式无效');const m=mediaPattern.exec(v);if(!m||!m[1].startsWith(kind+'/')||m[2].length%4)throw Error('备份中的素材不是受支持的内嵌图片或视频');if(m[2].length*.75>MAX_FILE+2)throw Error('单个素材超过 100 MB');return v;}
 function validate(raw,{publish=false}={}){
  if(!raw||typeof raw!=='object'||!Array.isArray(raw.projects)||raw.projects.length>200)throw Error('这不是有效的作品集项目');const p={};
  for(const k in fields)p[k]=text(raw[k]??defaults[k]??'');p.location=text(raw.location??'');
  if(!/^[A-Za-z0-9 !?.-]{1,16}$/.test(p.entryWord))throw Error('欢迎页文字请使用 1–16 个英文字母、数字或空格');
  if(p.email&&!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(p.email))throw Error('请填写有效的联系邮箱，或留空');
  p.inkTexture=media(raw.inkTexture,'image');p.atlas=media(raw.atlas,'image');p.demoVideo=media(raw.demoVideo,'video');const ids=new Set();
  p.projects=raw.projects.map(work=>{if(!work||typeof work!=='object')throw Error('作品数据无效');if(!/^[a-zA-Z0-9_-]{1,80}$/.test(work.id)||ids.has(work.id))throw Error('作品编号无效或重复');ids.add(work.id);if(!['image','video'].includes(work.kind))throw Error('作品类型无效');const out={id:work.id,kind:work.kind,demo:work.demo===true};for(const k of ['title','english','year','role','description','note','duration'])out[k]=text(work[k]??'',5000);out.cover=media(work.cover,'image');out.video=media(work.video,'video');out.color=/^#[a-f0-9]{6}$/i.test(work.color)?work.color:'#858585';if(work.cell){if(!Array.isArray(work.cell)||work.cell.length!==2||!work.cell.every(Number.isInteger)||work.cell[0]<0||work.cell[0]>2||work.cell[1]<0||work.cell[1]>1)throw Error('演示封面信息无效');out.cell=[...work.cell];}if(publish){if(!out.title.trim())throw Error('请为每件作品填写名称');if(!out.cover&&!(out.cell&&p.atlas))throw Error(`“${out.title}”还没有封面图片`);if(out.kind==='video'&&!out.video&&!(out.demo&&p.demoVideo))throw Error(`“${out.title}”还没有视频文件`);}return out;});
  p.isDemo=p.projects.some(w=>w.demo);if(publish&&(!p.projects.length||!p.name.trim()))throw Error('请填写主页姓名，并至少添加一件作品');if(mediaBytes(p)>MAX_TOTAL)throw Error('项目素材总量超过 350 MB，请压缩视频或拆分作品集');return p;
 }
 function mediaBytes(p){return [p.inkTexture,p.atlas,p.demoVideo,...p.projects.flatMap(w=>[w.cover,w.video])].reduce((n,v)=>n+(v?Math.floor((v.length-v.indexOf(',')-1)*.75):0),0);}
 function bytes(data){const b64=data.slice(data.indexOf(',')+1),bin=atob(b64),out=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)out[i]=bin.charCodeAt(i);return out;}
 const encode=s=>new TextEncoder().encode(s),safeJSON=value=>JSON.stringify(value).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
 function siteFiles(raw,bundle){const p=validate(raw,{publish:true}),files=[];
  const add=(data,name)=>{if(!data)return '';const type=data.slice(5,data.indexOf(';')),ext=({ 'image/png':'png','image/jpeg':'jpg','image/webp':'webp','video/mp4':'mp4','video/webm':'webm'})[type];const path=`media/${name}.${ext}`;files.push({name:path,data:bytes(data)});return path;};
  p.inkTexture=add(p.inkTexture,'ink-smoke');
  p.atlas=p.projects.some(w=>!w.cover&&w.cell)?add(p.atlas,'demo-atlas'):'';p.demoVideo=p.projects.some(w=>w.kind==='video'&&!w.video&&w.demo)?add(p.demoVideo,'demo-film'):'';
  for(const w of p.projects){w.cover=add(w.cover,w.id+'-cover');w.video=w.kind==='video'?add(w.video,w.id+'-video'):'';delete w.demo;}
  files.push({name:'index.html',data:encode(bundle.html)},{name:'portfolio.js',data:encode('window.PORTFOLIO='+safeJSON(p)+';')});for(const [name,s] of Object.entries(bundle.files))files.push({name,data:encode(s)});return files;
 }
 function previewHTML(raw,bundle){const p=validate(raw,{publish:true});let html=bundle.html.replace('<link rel="stylesheet" href="styles.css">',`<style>${bundle.files['styles.css']}</style>`);html=html.replace(/<script src="(?:portfolio|color|ink|intro|app)\.js(?:\?[^"]*)?" defer><\/script>/g,'');const script=s=>'<script>'+s.replace(/<\/script/gi,'<\\/script')+'</script>';return html.replace('</body>',script('window.PORTFOLIO='+safeJSON(p)+';')+['color.js','ink.js','intro.js','app.js'].map(n=>script(bundle.files[n])).join('')+'</body>');}
 const crcTable=Uint32Array.from({length:256},(_,n)=>{for(let k=0;k<8;k++)n=n&1?0xedb88320^(n>>>1):n>>>1;return n>>>0;});
 function crc(data){let n=0xffffffff;for(const b of data)n=crcTable[(n^b)&255]^(n>>>8);return (n^0xffffffff)>>>0;}
 function zip(files){const chunks=[],central=[];let offset=0,centralSize=0;for(const f of files){const name=encode(f.name),data=f.data,c=crc(data),head=new Uint8Array(30+name.length),v=new DataView(head.buffer);v.setUint32(0,0x04034b50,true);v.setUint16(4,20,true);v.setUint16(6,0x800,true);v.setUint16(12,0x21,true);v.setUint32(14,c,true);v.setUint32(18,data.length,true);v.setUint32(22,data.length,true);v.setUint16(26,name.length,true);head.set(name,30);chunks.push(head,data);const entry=new Uint8Array(46+name.length),e=new DataView(entry.buffer);e.setUint32(0,0x02014b50,true);e.setUint16(4,20,true);e.setUint16(6,20,true);e.setUint16(8,0x800,true);e.setUint16(14,0x21,true);e.setUint32(16,c,true);e.setUint32(20,data.length,true);e.setUint32(24,data.length,true);e.setUint16(28,name.length,true);e.setUint32(42,offset,true);entry.set(name,46);central.push(entry);centralSize+=entry.length;offset+=head.length+data.length;}const end=new Uint8Array(22),v=new DataView(end.buffer);v.setUint32(0,0x06054b50,true);v.setUint16(8,files.length,true);v.setUint16(10,files.length,true);v.setUint32(12,centralSize,true);v.setUint32(16,offset,true);return new Blob([...chunks,...central,end],{type:'application/zip'});}
 window.EditorCore={fields,defaults,validate,mediaBytes,siteFiles,previewHTML,zip,MAX_FILE};
})();
