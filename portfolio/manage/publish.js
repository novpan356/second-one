/* GitHub authorization stays in memory. GitHub, not this UI, enforces writes. */
(() => {
 'use strict';
 const {owner,repo,branch,prefix}=window.PUBLISH_TARGET;
 const $=s=>document.querySelector(s),say=t=>$('#status').textContent=t;
 let token='',publishing=false;
 const api=async(path,options={})=>{const r=await fetch('https://api.github.com'+path,{...options,headers:{Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28','Authorization':'Bearer '+token,...options.headers}});let data;try{data=await r.json();}catch{throw Error('GitHub 响应异常，请稍后重试');}if(!r.ok){if(r.status===401)throw Error('GitHub 授权无效或已过期，请重新连接');if(r.status===403)throw Error('GitHub 权限不足或请求被限流。请确认令牌仅授权 second-one 仓库，并开启 Contents 的 Read and write 权限');if(r.status===422)throw Error('远端已有新更新或提交未被接受，请刷新作品管理页后重试；本机备份可以保留修改');throw Error(`GitHub 操作失败（${r.status}）：${data.message||'请稍后重试'}`);}return data;};
 const post=(path,value)=>api(path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(value)});
 const root=`/repos/${owner}/${repo}`;
 const b64=bytes=>{let s='';for(let i=0;i<bytes.length;i+=16384)s+=String.fromCharCode(...bytes.subarray(i,i+16384));return btoa(s);};
 async function blobSha(bytes){const head=new TextEncoder().encode('blob '+bytes.length+'\0'),all=new Uint8Array(head.length+bytes.length);all.set(head);all.set(bytes,head.length);return [...new Uint8Array(await crypto.subtle.digest('SHA-1',all))].map(x=>x.toString(16).padStart(2,'0')).join('');}
 const connect=document.createElement('dialog');connect.className='github-auth';connect.innerHTML='<form method="dialog"><button class="auth-close" aria-label="关闭">×</button></form><p class="eyebrow">OWNER ACCESS</p><h2>连接你的 GitHub 发布权限</h2><p>只有拥有仓库写入权限的 GitHub 账号才能发布。令牌只保留在当前页面内存中，不写入网站、项目备份或浏览器存储。</p><ol><li>创建细粒度令牌，资源所有者选择 novpan356。</li><li>只选择 second-one 仓库，Repository permissions → Contents 设为 Read and write。</li><li>将令牌粘贴到下方。不要发送到聊天，也不要授予其他权限。</li></ol><a class="token-help" target="_blank" rel="noopener noreferrer">打开 GitHub 创建令牌 ↗</a><label>GitHub 发布令牌<input type="password" id="github-token" autocomplete="off" spellcheck="false" placeholder="仅在此处输入，不会保存"></label><button id="connect-github" class="primary">连接账号</button><p id="github-auth-status" role="status"></p>';
 document.body.append(connect);connect.querySelector('.token-help').href=`https://github.com/settings/personal-access-tokens/new?name=RAY%20PAN%20Portfolio&description=Publish%20portfolio%20only&target_name=${owner}&contents=write&expires_in=30`;
 const actions=$('.intro-actions'),button=document.createElement('button');button.className='primary';button.id='publish-github';button.textContent='保存并发布到网站 ↗';actions.append(button);
 const logout=document.createElement('button');logout.id='disconnect-github';logout.textContent='断开 GitHub';logout.hidden=true;actions.append(logout);
 function clearAuth(){token='';$('#github-token').value='';logout.hidden=true;}
 logout.onclick=()=>{if(publishing)return;clearAuth();say('已断开 GitHub。编辑内容仍在本机；发布需要重新授权。');};
 connect.addEventListener('close',()=>{$('#github-token').value='';});
 $('#connect-github').onclick=async()=>{const input=$('#github-token'),status=$('#github-auth-status');token=input.value.trim();input.value='';if(!token){status.textContent='请先输入你创建的 GitHub 发布令牌';return;}$('#connect-github').disabled=true;status.textContent='正在检查账号及仓库权限…';try{const user=await api('/user');if(user.login.toLowerCase()!==owner.toLowerCase())throw Error('这里只接受站主 novpan356 的 GitHub 授权');const info=await api(root);if(!info.permissions?.push)throw Error('该账号没有此仓库的写入权限');logout.hidden=false;connect.close();say('GitHub 已连接。编辑完成后点击“保存并发布到网站”。');}catch(e){clearAuth();status.textContent=e.message;}finally{$('#connect-github').disabled=false;}};
 button.onclick=async()=>{if(publishing||busy)return;if(!token){connect.showModal();return;}publishing=true;lock(true);button.disabled=true;logout.disabled=true;let committed=false;
  try{say('正在校验作品并连接 GitHub…');const files=EditorCore.siteFiles(model,EDITOR_BUNDLE);if(files.some(f=>f.data.length>100*1024*1024))throw Error('GitHub 发布要求单文件小于 100 MB，请先压缩视频');const ref=await api(root+'/git/ref/heads/'+branch),commit=await api(root+'/git/commits/'+ref.object.sha),tree=await api(root+'/git/trees/'+commit.tree.sha+'?recursive=1');if(tree.truncated)throw Error('仓库文件过多，请联系维护者调整发布方式');const existing=new Map(tree.tree.filter(x=>x.type==='blob').map(x=>[x.path,x.sha])),changes=[];
   for(let i=0;i<files.length;i++){const f=files[i],path=prefix+'/'+f.name,sha=await blobSha(f.data);if(existing.get(path)===sha)continue;say(`正在同步 ${i+1}/${files.length}：${f.name}`);const blob=await post(root+'/git/blobs',{content:b64(f.data),encoding:'base64'});changes.push({path,mode:'100644',type:'blob',sha:blob.sha});}
   if(!changes.length){say('作品内容与线上版本一致，无需重新发布。');return;}
   const version=crypto.randomUUID();const marker=await post(root+'/git/blobs',{content:JSON.stringify({version,updatedAt:new Date().toISOString()}),encoding:'utf-8'});changes.push({path:prefix+'/publish-version.json',mode:'100644',type:'blob',sha:marker.sha});
   const nextTree=await post(root+'/git/trees',{base_tree:commit.tree.sha,tree:changes}),next=await post(root+'/git/commits',{message:'Update RAY PAN portfolio from owner studio',tree:nextTree.sha,parents:[ref.object.sha]});await api(root+'/git/refs/heads/'+branch,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({sha:next.sha,force:false})});committed=true;
   say('更新已提交。GitHub 正在构建发布，通常需要数分钟；可以先保存项目备份。');
   for(let i=0;i<36;i++){await new Promise(r=>setTimeout(r,5000));try{const r=await fetch('../publish-version.json?t='+Date.now(),{cache:'no-store'});if(r.ok&&(await r.json()).version===version){say('发布完成。刷新作品集即可看到新作品与文字。');return;}}catch{}}
   say('代码已成功提交，GitHub 尚未完成发布。请稍后刷新网站；也可在仓库 Actions 查看进度。');
  }catch(e){say((committed?'代码已提交，但检查上线状态失败：':'尚未发布：')+e.message);}finally{publishing=false;lock(false);button.disabled=false;logout.disabled=false;}
 };
 window.addEventListener('pagehide',clearAuth);
})();
