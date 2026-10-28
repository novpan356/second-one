/* Verify the owner before loading editor scripts, collection or media. */
(() => {
 'use strict';
 const assetVersion=new URL(document.currentScript.src).search;
 const owner='novpan356',repo='second-one',gate=document.querySelector('#owner-gate'),studio=document.querySelector('#studio-root'),form=document.querySelector('#owner-login-form'),status=document.querySelector('#github-auth-status'),submit=document.querySelector('#connect-github');
 let token='',connected=false,loaded=false,loading=false;
 const requireLogin=message=>{token='';connected=false;studio.hidden=true;gate.hidden=false;document.querySelector('#github-token').value='';if(message)status.textContent=message;};
 async function api(path,options={}){if(!token)throw Error('请先通过站主验证');const r=await fetch('https://api.github.com'+path,{...options,cache:'no-store',headers:{Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28',Authorization:'Bearer '+token,...options.headers}});let data;try{data=await r.json();}catch{throw Error('GitHub 响应异常，请稍后重试');}if(!r.ok){if(r.status===401){requireLogin('授权无效或已过期，请重新验证');throw Error('GitHub 授权已失效');}if(r.status===403)throw Error('GitHub 权限不足或请求被限流，请确认仓库 Contents 读写权限');if(r.status===422)throw Error('远端已有新更新或提交未被接受，请刷新后重试；可先保存项目备份');throw Error(`GitHub 操作失败（${r.status}）：${data.message||'请稍后重试'}`);}return data;}
 window.GitHubOwnerAuth=Object.freeze({request:api,isConnected:()=>connected,requireLogin:()=>requireLogin('请重新验证站主身份'),logout:()=>{requireLogin('已退出管理');location.reload();}});
 document.querySelector('#token-help').href=`https://github.com/settings/personal-access-tokens/new?name=RAY%20PAN%20Portfolio&target_name=${owner}&contents=write&expires_in=30`;
 async function loadStudio(){
  studio.replaceChildren(document.querySelector('#studio-template').content.cloneNode(true));
  document.querySelector('.local-badge').textContent='● 站主已验证';document.querySelector('header small').textContent='作品管理工作室';document.querySelector('.side-note b').textContent='已通过 GitHub 站主验证';document.querySelector('.side-note p').textContent='点击保存并发布到网站后，由 GitHub 构建上线。退出管理或刷新页面后需要重新验证。';
  const fetchText=async name=>{const r=await fetch('../'+name,{cache:'no-store'});if(!r.ok)throw Error('加载失败：'+name);return r.text();};
  status.textContent='验证通过，正在载入工作室与作品…';const raw=await fetchText('portfolio.js'),profile=JSON.parse(raw.replace(/^\s*window\.PORTFOLIO\s*=\s*/,'').replace(/;\s*$/,'')),files={};await Promise.all(['styles.css','color.js','ink.js','intro.js','app.js'].map(async n=>files[n]=await fetchText(n)));const html=await fetchText('index.html');
  const embed=async path=>{if(!path)return '';if(!/^media\/[a-zA-Z0-9_.-]+$/.test(path))throw Error('素材路径无效');status.textContent='正在载入素材：'+path;const r=await fetch('../'+path);if(!r.ok)throw Error('素材读取失败：'+path);const blob=await r.blob();return new Promise((resolve,reject)=>{const f=new FileReader();f.onload=()=>resolve(f.result);f.onerror=()=>reject(Error('无法读取素材'));f.readAsDataURL(blob);});};
  for(const key of ['atlas','demoVideo','inkTexture'])profile[key]=await embed(profile[key]);for(const p of profile.projects){p.demo=!(p.cover||p.video);for(const key of ['cover','video'])if(p[key])p[key]=await embed(p[key]);}
  window.EDITOR_BUNDLE={html,files,profile};window.PUBLISH_TARGET={owner,repo,branch:'main',prefix:'portfolio'};
  const load=name=>new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=name;s.onload=resolve;s.onerror=()=>reject(Error('工作室组件加载失败，请刷新'));document.body.append(s);});await load('editor.js'+assetVersion);await load('publish.js'+assetVersion);loaded=true;
  document.querySelector('#status').textContent='站主验证通过。修改完成后可直接保存并发布。';
 }
 form.addEventListener('submit',async e=>{e.preventDefault();if(loading)return;token=document.querySelector('#github-token').value.trim();document.querySelector('#github-token').value='';if(!token){status.textContent='请输入 GitHub 发布令牌';return;}loading=true;submit.disabled=true;status.textContent='正在验证 GitHub 账号与仓库权限…';try{const user=await api('/user');if(user.login.toLowerCase()!==owner.toLowerCase())throw Error('仅允许站主 novpan356 进入工作室');const info=await api(`/repos/${owner}/${repo}`);if(!info.permissions?.push)throw Error('此账号没有仓库写入权限');connected=true;if(!loaded)await loadStudio();gate.hidden=true;studio.hidden=false;document.title='作品管理 · RAY PAN';}catch(e){requireLogin(e.message);}finally{loading=false;submit.disabled=false;}});
 window.addEventListener('pagehide',()=>{token='';connected=false;studio.hidden=true;gate.hidden=false;});
})();
