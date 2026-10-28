/* Load the live collection into the same visual editor. No private keys in source. */
(async()=>{
 const status=document.querySelector('#status');
 try{
  document.querySelector('.local-badge').textContent='● GitHub 授权发布';document.querySelector('header small').textContent='作品管理工作室';document.querySelector('.side-note b').textContent='由你的 GitHub 权限保护';document.querySelector('.side-note p').textContent='先连接站主 GitHub 权限，再点击“保存并发布到网站”。访客没有仓库写入权限，无法修改作品。';
  const fetchText=async name=>{const r=await fetch('../'+name,{cache:'no-store'});if(!r.ok)throw Error('加载失败：'+name);return r.text();};
  status.textContent='正在载入当前作品…';const raw=await fetchText('portfolio.js'),json=raw.replace(/^\s*window\.PORTFOLIO\s*=\s*/,'').replace(/;\s*$/,'');const profile=JSON.parse(json),files={};await Promise.all(['styles.css','color.js','ink.js','intro.js','app.js'].map(async n=>files[n]=await fetchText(n)));const html=await fetchText('index.html');
  const embed=async path=>{if(!path)return '';if(!/^media\/[a-zA-Z0-9_.-]+$/.test(path))throw Error('素材路径无效');status.textContent='正在载入素材：'+path;const r=await fetch('../'+path);if(!r.ok)throw Error('素材读取失败：'+path);const blob=await r.blob();return new Promise((resolve,reject)=>{const f=new FileReader();f.onload=()=>resolve(f.result);f.onerror=()=>reject(Error('无法读取素材'));f.readAsDataURL(blob);});};
  for(const key of ['atlas','demoVideo','inkTexture'])profile[key]=await embed(profile[key]);for(const p of profile.projects){p.demo=!(p.cover||p.video);for(const key of ['cover','video'])if(p[key])p[key]=await embed(p[key]);}
  window.EDITOR_BUNDLE={html,files,profile};window.PUBLISH_TARGET={owner:'novpan356',repo:'second-one',branch:'main',prefix:'portfolio'};
  const load=name=>new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=name;s.onload=resolve;s.onerror=()=>reject(Error('工作室组件加载失败'));document.body.append(s);});await load('editor.js');await load('publish.js');
  document.querySelector('#status').textContent='当前作品已载入。编辑后连接 GitHub，保存并发布到网站。';
 }catch(e){status.textContent=e.message+'。请刷新后重试。';}
})();
