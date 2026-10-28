/* GitHub authorization stays in memory. GitHub, not this UI, enforces writes. */
(() => {
 'use strict';
 const {owner,repo,branch,prefix}=window.PUBLISH_TARGET;
 const $=s=>document.querySelector(s),say=t=>$('#status').textContent=t;
 let publishing=false;
 const api=window.GitHubOwnerAuth.request;
 const post=(path,value)=>api(path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(value)});
 const root=`/repos/${owner}/${repo}`;
 const b64=bytes=>{let s='';for(let i=0;i<bytes.length;i+=16384)s+=String.fromCharCode(...bytes.subarray(i,i+16384));return btoa(s);};
 async function blobSha(bytes){const head=new TextEncoder().encode('blob '+bytes.length+'\0'),all=new Uint8Array(head.length+bytes.length);all.set(head);all.set(bytes,head.length);return [...new Uint8Array(await crypto.subtle.digest('SHA-1',all))].map(x=>x.toString(16).padStart(2,'0')).join('');}
 const actions=$('.intro-actions'),button=document.createElement('button');button.className='primary';button.id='publish-github';button.textContent='保存并发布到网站 ↗';actions.append(button);
 const logout=document.createElement('button');logout.id='disconnect-github';logout.textContent='退出管理';actions.append(logout);
 logout.onclick=()=>{if(publishing)return;if(dirty&&!confirm('尚有未备份的修改，确定退出管理？'))return;dirty=false;window.GitHubOwnerAuth.logout();};
 button.onclick=async()=>{if(publishing||busy)return;if(!window.GitHubOwnerAuth.isConnected()){window.GitHubOwnerAuth.requireLogin();return;}publishing=true;lock(true);button.disabled=true;logout.disabled=true;let committed=false;
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

})();
