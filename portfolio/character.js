/* Native-resolution, full-frame-rate scroll sequence with asynchronous decode and bounded caches. */
(() => {
 'use strict';
 const config=window.PORTFOLIO?.character,section=document.querySelector('#character-story'),scene=document.querySelector('#character-scene');
 if(!section||!config?.atlases?.length){if(section)section.hidden=true;document.documentElement.classList.remove('has-character-intro');window.PortfolioCharacter={getState:()=>({enabled:false})};return;}
 if(config.baked){initClean(config);return;}
 const profile=window.PORTFOLIO,canvas=document.querySelector('#character-canvas'),ctx=config.video?null:canvas.getContext('2d',{alpha:true,desynchronized:true}),poster=document.querySelector('#character-poster'),figure=document.querySelector('.portrait-figure'),left=document.querySelector('.portrait-copy-left'),right=document.querySelector('.portrait-copy-right'),meter=document.querySelector('.portrait-progress i'),count=document.querySelector('#portrait-step');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),clamp=v=>Math.max(0,Math.min(1,v)),ease=v=>{v=clamp(v);return v*v*(3-2*v);};
 const per=config.columns*config.rows,cacheLimit=3,encodedLimit=32*1024*1024;
 let mobile=innerWidth<=650,sourceMode='',epoch=0,cache=new Map(),pending=new Set(),encoded=new Map(),fetches=new Map(),fetched=new Set(),encodedBytes=0,prefetchQueue=[],background=0,wanted=new Set(),activeIndex=0,direction=1;
 let video=null,videoReady=false,desiredTime=0,previousDesired=0,lastMediaTime=0,lastVideoCallback=0,videoCallbacks=0,starting=false,visibleVideoFrame=0,scrollChangedAt=-1000000,transportRate=1;
 let videoView=null,maskIndex=-1;
 let decodeTime=0;
 const workerJobs=new Map();let workerID=0,workerCursor=0,workers=[];
 if(!config.video&&window.Worker&&window.createImageBitmap){try{const code="self.onmessage=async e=>{const {id,blob,width,height}=e.data;try{const image=await createImageBitmap(blob);self.postMessage({id,image},[image]);}catch(error){self.postMessage({id,error:error.message});}}";const url=URL.createObjectURL(new Blob([code],{type:'text/javascript'}));workers=Array.from({length:2},()=>{const w=new Worker(url);w.onmessage=e=>{const job=workerJobs.get(e.data.id);if(!job){dispose(e.data.image);return;}workerJobs.delete(e.data.id);if(e.data.error)job.reject(Error(e.data.error));else job.resolve(e.data.image);};w.onerror=()=>{for(const job of workerJobs.values())job.reject(Error('Worker unavailable'));workerJobs.clear();for(const w of workers)w.terminate();workers=[];};return w;});}catch{workers=[];}}
 function decodeInWorker(blob){return new Promise((resolve,reject)=>{const id=++workerID;workerJobs.set(id,{resolve,reject});workers[workerCursor++%workers.length].postMessage({id,blob,width:canvas.width*config.columns,height:canvas.height*config.rows});});}
 let raf=0,lastTime=0,top=0,range=1,progress=0,targetProgress=0,frame=0,lastDrawn=-1,lastChapter=-1,firstPaint=false,loaded=0,failed=false,draws=0,maxPaintMs=0;
 const chapters=[
  [profile.introTitle1||'把想法，\n变成画面。',profile.introText1||profile.bio,'PHOTOGRAPHY / DIRECTION / FILMMAKING'],
  [profile.introTitle2||'观察光，\n也观察人。',profile.introText2||'摄影 / 色彩。关注人与空间，让细节参与叙事。','LIGHT / PEOPLE / COLOUR'],
  [profile.introTitle3||'让故事，\n有自己的节奏。',profile.introText3||profile.projects?.[0]?.description||profile.bio,'CONCEPT / FILM / EDITING'],
  [profile.introTitle4||'换一种视角，\n继续创作。',profile.introText4||'用作品介绍自己。继续向下，进入影像与摄影作品合集。','SELECTED WORK / RAY PAN']
 ];
 document.querySelector('#portrait-name').textContent=profile.name;document.querySelector('#portrait-role').textContent=profile.introFocus||profile.role;poster.src=config.poster||'';
 const sources=()=>sourceMode==='mobile'&&config.mobileAtlases?.length?config.mobileAtlases:config.atlases;
 const valid=i=>i>=0&&i<sources().length;
 const dispose=image=>image?.close?.();
 function request(){if(!raf&&!document.hidden)raf=requestAnimationFrame(draw);}
 function remember(index,blob){
  if(encoded.has(index))encodedBytes-=encoded.get(index).size;encoded.delete(index);encoded.set(index,blob);encodedBytes+=blob.size;
  for(const [key,value]of encoded){if(encodedBytes<=encodedLimit)break;if(wanted.has(key))continue;encoded.delete(key);encodedBytes-=value.size;}
 }
 function bytes(index){
  if(encoded.has(index)){const b=encoded.get(index);encoded.delete(index);encoded.set(index,b);return Promise.resolve(b);}
  if(fetches.has(index))return fetches.get(index).promise;
  const generation=epoch,controller=new AbortController();
  const promise=fetch(sources()[index],{signal:controller.signal,priority:wanted.has(index)?'high':'low'}).then(r=>{if(!r.ok)throw Error('Frame unavailable');return r.blob();}).then(blob=>{if(generation!==epoch)throw new DOMException('Outdated frame','AbortError');fetched.add(index);remember(index,blob);return blob;}).finally(()=>{if(generation===epoch)fetches.delete(index);});
  fetches.set(index,{promise,controller});return promise;
 }
 async function decode(index){
  const path=sources()[index];if(video)return imageFrom(path,false);const fromFile=location.protocol==='file:'&&!path.startsWith('data:');
  if(!fromFile){const blob=await bytes(index);if(workers.length){try{return await decodeInWorker(blob);}catch{/* Fall back when a preview sandbox disallows workers. */}}if(window.createImageBitmap){try{return await createImageBitmap(blob);}catch{/* Image decoding also supports browsers without bitmap resizing. */}}
   return imageFrom(URL.createObjectURL(blob),true);
  }
  return imageFrom(path,false);
 }
 function imageFrom(path,revoke){return new Promise((resolve,reject)=>{const image=new Image();image.decoding='async';image.onload=async()=>{try{if(image.decode)await image.decode();resolve(image);}catch(e){reject(e);}finally{if(revoke)URL.revokeObjectURL(path);}};image.onerror=()=>{if(revoke)URL.revokeObjectURL(path);reject(Error('Frame decode failed'));};image.src=path;});}
 function load(index){
  if(!valid(index)||cache.has(index)||pending.has(index)||pending.size>=2)return;
  const generation=epoch,start=performance.now();pending.add(index);
  decode(index).then(image=>{if(generation!==epoch||!wanted.has(index)){dispose(image);return;}cache.set(index,image);decodeTime=Math.max(decodeTime,performance.now()-start);loaded++;request();}).catch(e=>{if(generation===epoch&&e.name!=='AbortError'){failed=true;}}).finally(()=>{if(generation===epoch){pending.delete(index);for(const key of wanted)load(key);}});
 }
 function pump(){
  if(document.hidden||location.protocol==='file:'||scrollY>top+range+innerHeight||scrollY+innerHeight<top)return;
  while(background<3&&prefetchQueue.length){const index=prefetchQueue.shift();if(!valid(index)||fetched.has(index)||encoded.has(index)||fetches.has(index))continue;
   const generation=epoch;background++;bytes(index).catch(()=>{}).finally(()=>{if(generation!==epoch)return;background--;pump();});
  }
 }
 function warm(index){
  wanted=new Set([index,index+direction,index+direction*2,...(video?[Math.floor(visibleVideoFrame/per)]:[])].filter(valid));
  for(const [key,image]of cache)if(!wanted.has(key)){dispose(image);cache.delete(key);}
  // Decode the visible sheet first; never decode the whole 4K sequence into memory.
  for(const key of wanted)load(key);
  const distance=document.documentElement.classList.contains('intro-pending')?5:16;
  prefetchQueue=[];for(let d=0;d<=distance;d++)prefetchQueue.push(index+d*direction);for(let d=1;d<=3;d++)prefetchQueue.push(index-d*direction);pump();
 }
 function paint(){
  if(video){const index=Math.floor(frame/per);if(index!==activeIndex||!firstPaint){activeIndex=index;warm(index);}if(videoReady&&(video.paused||!video.requestVideoFrameCallback||performance.now()-lastVideoCallback>150)&&!video.seeking)paintVideo(video.currentTime);return;}
  const index=Math.floor(frame/per);if(index!==activeIndex||!firstPaint){activeIndex=index;warm(index);}else if(!cache.has(index))load(index);
  const image=cache.get(index),slot=frame%per;if(!image||lastDrawn===frame&&firstPaint)return;
  const start=performance.now(),width=image.width||image.naturalWidth,height=image.height||image.naturalHeight,fw=width/config.columns,fh=height/config.rows;
  ctx.imageSmoothingEnabled=fw!==canvas.width||fh!==canvas.height;ctx.imageSmoothingQuality='high';ctx.clearRect(0,0,canvas.width,canvas.height);ctx.drawImage(image,(slot%config.columns)*fw,Math.floor(slot/config.columns)*fh,fw,fh,0,0,canvas.width,canvas.height);
  poster.hidden=true;canvas.hidden=false;lastDrawn=frame;firstPaint=true;draws++;maxPaintMs=Math.max(maxPaintMs,performance.now()-start);
 }
 function paintVideo(time){
  if(!videoReady||video.seeking)return;
  const current=Math.max(0,Math.min(config.frames-1,Math.round(time*(config.fps||60))));visibleVideoFrame=current;
  const index=Math.floor(current/per),image=cache.get(index);if(!image){warm(Math.floor(frame/per));load(index);return;}
  if(lastDrawn===current&&firstPaint)return;
  const start=performance.now(),slot=current%per;
  if(maskIndex!==index){const path=sources()[index];videoView.style.maskImage=videoView.style.webkitMaskImage='url('+JSON.stringify(path)+')';maskIndex=index;}
  const position=(config.columns>1?(slot%config.columns)/(config.columns-1)*100:0)+'% '+(config.rows>1?Math.floor(slot/config.columns)/(config.rows-1)*100:0)+'%';
  videoView.style.maskPosition=videoView.style.webkitMaskPosition=position;
  poster.hidden=true;canvas.hidden=true;videoView.hidden=false;lastDrawn=current;firstPaint=true;draws++;maxPaintMs=Math.max(maxPaintMs,performance.now()-start);
 }

 function syncVideo(dt,now){
  if(!videoReady)return;desiredTime=clamp(progress/.79)*(config.frames-1)/(config.fps||60);const velocity=(desiredTime-previousDesired)/dt;previousDesired=desiredTime;
  if(Math.abs(velocity)>.015)transportRate+=(velocity-transportRate)*(1-Math.exp(-dt*12));
  const diff=desiredTime-video.currentTime,moving=now-scrollChangedAt<110||Math.abs(targetProgress-progress)>.0003;
  if(reduced.matches||!moving||direction<0||progress>.81){
   video.pause();const actual=Math.floor(video.currentTime*(config.fps||60)+.001);if(!video.seeking&&actual!==frame)video.currentTime=Math.min(video.duration-.002,(frame+.1)/(config.fps||60));
  }else if(!video.seeking){
   if(Math.abs(diff)>.65){video.pause();video.currentTime=Math.min(video.duration-.002,(frame+.1)/(config.fps||60));}
   else{video.playbackRate=Math.max(.25,Math.min(3,Math.max(.1,transportRate)+diff*4));if(video.paused&&!starting){starting=true;video.play().catch(()=>{}).finally(()=>starting=false);}}
  }
 }
 function initializeVideo(){
  if(!config.video)return;video=document.createElement('video');video.muted=true;video.playsInline=true;video.preload='auto';video.setAttribute('aria-hidden','true');video.tabIndex=-1;video.style.cssText=`position:absolute;top:0;left:${-(config.cropX||0)/config.frameWidth*100}%;width:${(config.sourceWidth||config.frameWidth)/config.frameWidth*100}%;height:100%;max-width:none;pointer-events:none`;videoView=document.createElement('div');videoView.className='portrait-video-view';videoView.hidden=true;videoView.setAttribute('role','img');videoView.setAttribute('aria-label','随页面滚动换装的人物动画');videoView.style.cssText=`position:relative;width:100%;aspect-ratio:${config.frameWidth}/${config.frameHeight};overflow:hidden;pointer-events:none;mask-size:${config.columns*100}% ${config.rows*100}%;-webkit-mask-size:${config.columns*100}% ${config.rows*100}%;mask-repeat:no-repeat;-webkit-mask-repeat:no-repeat`;videoView.append(video);figure.insertBefore(videoView,canvas);
  video.addEventListener('contextmenu',e=>e.preventDefault());
  video.onloadeddata=()=>{videoReady=true;video.pause();paintVideo(0);request();};video.onseeked=()=>{paintVideo(video.currentTime);request();};video.onerror=()=>{failed=true;};
  if(video.requestVideoFrameCallback){const decoded=(now,meta)=>{lastVideoCallback=now;lastMediaTime=meta.mediaTime;videoCallbacks++;paintVideo(meta.mediaTime);video.requestVideoFrameCallback(decoded);};video.requestVideoFrameCallback(decoded);}
  if(config.video.startsWith('data:')){const comma=config.video.indexOf(','),raw=atob(config.video.slice(comma+1)),data=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)data[i]=raw.charCodeAt(i);video.src=URL.createObjectURL(new Blob([data],{type:'video/mp4'}));}else video.src=config.video;
 }
 function draw(now){
  raf=0;const dt=Math.min(.05,lastTime?(now-lastTime)/1000:1/60);lastTime=now;targetProgress=clamp((scrollY-top)/range);
  const old=progress;progress=reduced.matches?targetProgress:progress+(targetProgress-progress)*(1-Math.exp(-22*dt));
  if(Math.abs(targetProgress-progress)<1/(config.frames*16))progress=targetProgress;
  const next=Math.round(clamp(progress/.79)*(config.frames-1)),nextDirection=next===frame?direction:next>frame?1:-1;
  if(nextDirection!==direction){direction=nextDirection;warm(Math.floor(next/per));}frame=next;syncVideo(dt,now);paint();
  const chapter=Math.min(3,Math.floor(clamp((progress-.035)/.82)*4)),t=clamp((progress-.035-chapter*.205)/.205),alpha=ease(t/.18)*(1-ease((t-.82)/.18))*(1-ease((progress-.82)/.07));
  if(chapter!==lastChapter){document.querySelector('#portrait-chapter-title').textContent=chapters[chapter][0];document.querySelector('#portrait-chapter-text').textContent=chapters[chapter][1];document.querySelector('#portrait-chapter-skill').textContent=chapters[chapter][2];count.textContent=String(chapter+1).padStart(2,'0')+' / 04';lastChapter=chapter;}
  left.style.opacity=right.style.opacity=String(alpha);left.style.transform=`translate3d(0,${reduced.matches?0:42-t*84}px,0)`;right.style.transform=`translate3d(0,${reduced.matches?0:30-t*60}px,0)`;
  const exit=ease((progress-.86)/.14);figure.style.opacity=String(1-exit);figure.style.transform=`translate3d(-50%,0,0) scale(${1-exit*.12})`;scene.style.setProperty('--portrait-progress',progress);meter.style.transform=`scaleX(${progress})`;scene.classList.toggle('portrait-complete',progress>.9);
  if(progress!==targetProgress&&old!==progress||video&&!video.paused||video&&now-scrollChangedAt<130)request();
 }
 function measure(){
  mobile=innerWidth<=650;const dpr=Math.min(devicePixelRatio||1,3),desired=Math.min(config.frameWidth,Math.ceil(figure.offsetWidth*dpr));
  const lowMemory=mobile&&(navigator.deviceMemory||4)<=2;
  const mode=config.mobileAtlases?.length&&(config.video?figure.offsetWidth<=1100||lowMemory:desired<=(config.mobileFrameWidth||config.frameWidth)||lowMemory)?'mobile':'hd';
  const width=Math.max(1,Math.min(mode==='mobile'&&!video?(config.mobileFrameWidth||config.frameWidth):config.frameWidth,desired)),height=Math.round(width*config.frameHeight/config.frameWidth);
  if(mode!==sourceMode||canvas.width!==width||canvas.height!==height){
   epoch++;for(const image of cache.values())dispose(image);for(const job of fetches.values())job.controller.abort();cache=new Map();pending=new Set();encoded=new Map();fetches=new Map();fetched=new Set();encodedBytes=0;background=0;prefetchQueue=[];sourceMode=mode;canvas.width=width;canvas.height=height;firstPaint=false;lastDrawn=-1;poster.hidden=false;canvas.hidden=true;if(videoView)videoView.hidden=true;maskIndex=-1;
  }
  top=section.getBoundingClientRect().top+scrollY;range=Math.max(1,section.offsetHeight-scene.offsetHeight);lastTime=0;warm(Math.floor(frame/per));request();
 }
 window.addEventListener('scroll',()=>{scrollChangedAt=performance.now();request();},{passive:true});window.addEventListener('resize',measure);window.addEventListener('load',measure);window.addEventListener('portfolio-enter-progress',e=>{if(e.detail===1)queueMicrotask(measure);else request();});document.addEventListener('visibilitychange',()=>{lastTime=0;if(document.hidden)video?.pause();if(!document.hidden){pump();request();}});reduced.addEventListener('change',request);
 window.PortfolioCharacter={getState:()=>({enabled:true,progress,targetProgress,frame,drawnFrame:lastDrawn,chapter:lastChapter,loaded,failed,mobile,sourceMode,canvasWidth:canvas.width,canvasHeight:canvas.height,cachedSheets:cache.size,cacheLimit:video?4:cacheLimit,videoReady,videoTime:video?.currentTime||0,videoWidth:video?.videoWidth||0,videoHeight:video?.videoHeight||0,videoCallbacks,playbackQuality:video?.getVideoPlaybackQuality?{total:video.getVideoPlaybackQuality().totalVideoFrames,dropped:video.getVideoPlaybackQuality().droppedVideoFrames}:null,encodedBytes,pending:[...pending],cacheKeys:[...cache.keys()],wanted:[...wanted],fetching:[...fetches.keys()],firstPaint,frames:config.frames,fps:config.fps||0,sequenceVersion:config.sequenceVersion||'',scrollRange:range,scrollTop:top,renderer:video?'native-video':'2d',backgroundDecode:workers.length>0,decodeTime,draws,maxPaintMs,waiting:frame!==lastDrawn})};initializeVideo();measure(); function initClean(config){
  const profile=window.PORTFOLIO,section=document.querySelector('#character-story'),scene=document.querySelector('#character-scene'),figure=document.querySelector('.portrait-figure'),poster=document.querySelector('#character-poster'),canvas=document.querySelector('#character-canvas'),context=canvas.getContext('2d',{alpha:false,desynchronized:true}),left=document.querySelector('.portrait-copy-left'),right=document.querySelector('.portrait-copy-right');
  const reduce=matchMedia('(prefers-reduced-motion: reduce)'),clamp=n=>Math.max(0,Math.min(1,n)),ease=n=>{n=clamp(n);return n*n*(3-2*n);},fps=config.fps||60;
  let raf=0,top=0,range=1,progress=0,target=0,frame=0,drawn=-1,chapter=-1,ready=false,holding=false,failed=false,seeks=0,seekPending=false,seekTime=0,releaseID=0,lastTimestamp=0,quality=config.fastVideo?'fast':'4k',lastInteraction=performance.now(),upgradeStarted=false,hdController=null,frameDecoder=null,decoderActive=false,pictureRaf=0,pendingPicture=null;
  const chapters=[[profile.introTitle1,profile.introText1,'PHOTOGRAPHY / DIRECTION / FILMMAKING'],[profile.introTitle2,profile.introText2,'LIGHT / PEOPLE / COLOUR'],[profile.introTitle3,profile.introText3,'CONCEPT / FILM / EDITING'],[profile.introTitle4,profile.introText4,'SELECTED WORK / RAY PAN']];
  const video=document.createElement('video'),view=document.createElement('div');video.muted=video.defaultMuted=true;video.playsInline=true;video.preload='auto';video.setAttribute('aria-hidden','true');video.tabIndex=-1;
  view.className='portrait-video-view';view.hidden=false;poster.style.cssText='position:absolute;inset:0;width:100%;height:100%;z-index:2;filter:none';view.style.cssText=`position:relative;width:100%;aspect-ratio:${config.frameWidth}/${config.frameHeight};overflow:hidden;pointer-events:none`;
  video.style.cssText=`position:absolute;top:0;left:${-(config.cropX||0)/config.frameWidth*100}%;width:${config.sourceWidth/config.frameWidth*100}%;height:100%;max-width:none;pointer-events:none`;
  view.append(video);figure.insertBefore(view,canvas);figure.style.mixBlendMode='darken';figure.style.aspectRatio=`${config.frameWidth} / ${config.frameHeight}`;scene.classList.add('portrait-baked');
  canvas.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1;filter:none';canvas.hidden=true;poster.src=config.poster;
  document.querySelector('#portrait-name').textContent=profile.name;document.querySelector('#portrait-role').textContent=profile.introFocus||profile.role;
  function request(){if(!raf&&!document.hidden)raf=requestAnimationFrame(draw);}
  function freeze(){
   if(holding||!ready||video.readyState<2)return;
   // One snapshot per seek, not per animation frame. It stays visible until the replacement frame is ready.
   context.drawImage(video,(config.cropX||0)*video.videoWidth/config.sourceWidth,0,config.frameWidth*video.videoWidth/config.sourceWidth,video.videoHeight,0,0,canvas.width,canvas.height);holding=true;canvas.hidden=false;
  }
  function present(time){if(!ready||video.seeking||seekPending&&Math.abs(time-seekTime)>.7/fps)return;drawn=Math.max(0,Math.min(config.frames-1,Math.floor(time*fps+.05)));seekPending=false;holding=false;canvas.hidden=true;poster.hidden=true;view.hidden=false;request();}
  function seek(){
   if(decoderActive){frameDecoder?.seek(frame);return;}
   // A decoded seek must reach the screen before the next target can replace it.
   // `video.seeking` clears before presentation; using it alone starves continuous scrolling.
   if(!ready||seekPending||video.seeking||frame===drawn)return;
   // The baked native video retains its last presented texture during a seek.
   // Avoid copying a 4K frame to canvas on every scroll update.
   seeks++;seekPending=true;seekTime=Math.min(video.duration-.002,(frame+.1)/fps);video.currentTime=seekTime;
  }
  function draw(now){
   raf=0;const dt=lastTimestamp?Math.min(.04,(now-lastTimestamp)/1000):1/60;lastTimestamp=now;target=clamp((scrollY-top)/range);
   progress=reduce.matches?target:progress+(target-progress)*(1-Math.exp(-26*dt));if(Math.abs(progress-target)<.00015)progress=target;
   frame=Math.round(clamp(progress/.79)*(config.frames-1));seek();
   const c=Math.min(3,Math.floor(clamp((progress-.035)/.82)*4)),t=clamp((progress-.035-c*.205)/.205),alpha=ease(t/.18)*(1-ease((t-.82)/.18))*(1-ease((progress-.82)/.07));
   if(c!==chapter){document.querySelector('#portrait-chapter-title').textContent=chapters[c][0]||'';document.querySelector('#portrait-chapter-text').textContent=chapters[c][1]||'';document.querySelector('#portrait-chapter-skill').textContent=chapters[c][2];document.querySelector('#portrait-step').textContent=String(c+1).padStart(2,'0')+' / 04';chapter=c;}
   left.style.opacity=right.style.opacity=String(alpha);left.style.transform=`translate3d(0,${reduce.matches?0:42-t*84}px,0)`;right.style.transform=`translate3d(0,${reduce.matches?0:30-t*60}px,0)`;
   const exit=ease((progress-.86)/.14);figure.style.opacity=String(1-exit);figure.style.transform=`translate3d(-50%,0,0) scale(${1-exit*.12})`;document.querySelector('.portrait-progress i').style.transform=`scaleX(${progress})`;scene.classList.toggle('portrait-complete',progress>.9);
   if(progress!==target)request();
  }
  function measure(){top=section.getBoundingClientRect().top+scrollY;range=Math.max(1,section.offsetHeight-scene.offsetHeight);const width=Math.min(config.frameWidth,Math.ceil(figure.offsetWidth*Math.min(devicePixelRatio||1,3)));if(canvas.width!==width){let previous;if(drawn>=0&&!canvas.hidden){previous=document.createElement('canvas');previous.width=canvas.width;previous.height=canvas.height;previous.getContext('2d').drawImage(canvas,0,0);}canvas.width=width;canvas.height=Math.round(width*config.frameHeight/config.frameWidth);if(previous)context.drawImage(previous,0,0,canvas.width,canvas.height);}lastTimestamp=0;request();}
  video.addEventListener('contextmenu',e=>e.preventDefault());video.onerror=()=>{seekPending=false;if(quality==='upgrading'){quality='recovering';ready=false;video.src=fastSource;return;}failed=true;};
  video.onloadeddata=()=>{ready=true;if(quality==='upgrading'||quality==='recovering'){quality=video.videoWidth>=3840?'4k':'fast';seekPending=true;seekTime=Math.min(video.duration-.002,(frame+.1)/fps);video.currentTime=seekTime;}else present(0);};
  video.onseeked=()=>{const token=++releaseID;requestAnimationFrame(()=>{if(token===releaseID&&!video.seeking){present(video.currentTime);seek();}});};
  if(video.requestVideoFrameCallback){const presented=(now,meta)=>{if(!video.seeking){releaseID++;present(meta.mediaTime);seek();}video.requestVideoFrameCallback(presented);};video.requestVideoFrameCallback(presented);}
  function sourceURL(value){if(!value.startsWith('data:'))return value;const raw=atob(value.split(',')[1]),bytes=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);return URL.createObjectURL(new Blob([bytes],{type:'video/mp4'}));}
  const fastSource=sourceURL(config.fastVideo||config.video);
  if(config.frameDecoder&&window.VideoDecoder&&window.Worker){
   decoderActive=true;
   frameDecoder=createFrameDecoder(fastSource,config,canvas,(index,picture)=>{pendingPicture?.picture.close();pendingPicture={index,picture};if(!pictureRaf)pictureRaf=requestAnimationFrame(()=>{pictureRaf=0;const latest=pendingPicture;pendingPicture=null;context.drawImage(latest.picture,config.cropX||0,0,config.frameWidth,config.frameHeight,0,0,canvas.width,canvas.height);latest.picture.close();drawn=latest.index;ready=true;failed=false;canvas.hidden=false;poster.hidden=true;view.hidden=true;request();});},()=>{decoderActive=false;frameDecoder?.close();cancelAnimationFrame(pictureRaf);pictureRaf=0;pendingPicture?.picture.close();pendingPicture=null;quality='recovering';holding=drawn>=0;video.src=fastSource;});
  }else video.src=fastSource;
  const upgradeTimer=setInterval(async()=>{
   const connection=navigator.connection;
   if(!config.fastVideo||upgradeStarted||connection?.saveData||/^(slow-2g|2g|3g)$/.test(connection?.effectiveType||'')||connection?.downlink&&connection.downlink<8)return;
   if(document.hidden||!ready||video.seeking||holding||performance.now()-lastInteraction<1500||figure.offsetWidth*(devicePixelRatio||1)<=1320||scrollY>top+range)return;
   if(!video.buffered.length||video.buffered.end(video.buffered.length-1)<video.duration-.05)return;
   upgradeStarted=true;clearInterval(upgradeTimer);
   try{hdController=new AbortController();const response=await fetch(config.video,{priority:'low',signal:hdController.signal});if(!response.ok)return;const blob=await response.blob();if(document.hidden||scrollY>top+range)return;freeze();quality='upgrading';ready=false;video.src=URL.createObjectURL(blob);}catch{/* The fast video remains available if HD cannot be fetched. */}
  },1500);
  window.addEventListener('scroll',()=>{lastInteraction=performance.now();if(scrollY>top+range)hdController?.abort();request();},{passive:true});window.addEventListener('resize',measure);window.addEventListener('portfolio-enter-progress',e=>{if(e.detail===1)queueMicrotask(measure);});window.addEventListener('load',measure);document.addEventListener('visibilitychange',()=>{if(document.hidden)hdController?.abort();else request();});reduce.addEventListener('change',request);
  window.PortfolioCharacter={getState:()=>({enabled:true,renderer:decoderActive?'worker-video':'baked-video',quality,upgradeStarted,progress,targetProgress:target,frame,drawnFrame:drawn,chapter,videoReady:ready,videoWidth:decoderActive?config.sourceWidth:video.videoWidth,videoHeight:decoderActive?config.sourceHeight:video.videoHeight,videoTime:decoderActive?Math.max(0,drawn)/fps:video.currentTime,frames:config.frames,fps,sequenceVersion:config.sequenceVersion,scrollRange:range,scrollTop:top,canvasWidth:canvas.width,canvasHeight:canvas.height,holding,seekPending,firstPaint:drawn>=0,failed,seeks,cachedSheets:0,maskSwaps:0})};measure();
 }

 // Fast-start, video-only AVC files from our offline compositor. Other containers
 // and unsupported browsers fall back to the native video without clearing the last frame.
 function createFrameDecoder(url,config,canvas,present,fallback){
  let workers=[],metadata,bytes=new Uint8Array(65536),length=0,wanted=0,shown=-1,closed=false,serial=0,presented=0,pending=new Set(),controller=new AbortController();
  const workerCode=()=>{let decoder,output,target;self.onmessage=async({data})=>{try{
   if(data.init){decoder=new VideoDecoder({output:frame=>{if(Math.abs(frame.timestamp-target)<2){output?.close();output=frame;}else frame.close();},error:error=>self.postMessage({error:error.message})});decoder.configure(data.init);return;}
   target=Math.round(data.index*1e6/data.fps);output=null;
   for(const sample of data.samples)decoder.decode(new EncodedVideoChunk({type:sample.key?'key':'delta',timestamp:Math.round(sample.index*1e6/data.fps),data:sample.data}));
   await decoder.flush();if(!output)throw Error('Decoded frame unavailable');
   const picture=output;output=null;self.postMessage({id:data.id,index:data.index,picture},[picture]);
  }catch(error){output?.close();self.postMessage({error:error.message});}};};
  function fail(){if(closed)return;close();fallback();}
  function close(){closed=true;controller.abort();for(const slot of workers)slot.worker.terminate();}
  const string=(data,start,n)=>String.fromCharCode(...data.subarray(start,start+n));
  function boxes(data,start,end){const out=[],view=new DataView(data.buffer);for(let at=start;at+8<=end;){const size=view.getUint32(at);if(size<8||at+size>end)throw Error('Unsupported MP4 box');out.push({start:at,end:at+size,type:string(data,at+4,4)});at+=size;}return out;}
  function parse(moov){
   const view=new DataView(bytes.buffer),children=box=>boxes(bytes,box.start+8,box.end),find=(box,type)=>children(box).find(x=>x.type===type);
   const trak=children(moov).find(t=>t.type==='trak'&&string(bytes,find(find(t,'mdia'),'hdlr').start+16,4)==='vide');
   const table=find(find(find(trak,'mdia'),'minf'),'stbl'),stsd=find(table,'stsd'),entry=boxes(bytes,stsd.start+16,stsd.end)[0];
   if(entry.type!=='avc1')throw Error('Unsupported video codec');
   const avcc=boxes(bytes,entry.start+86,entry.end).find(b=>b.type==='avcC'),description=bytes.slice(avcc.start+8,avcc.end);
   const stsz=find(table,'stsz'),count=view.getUint32(stsz.start+16),fixed=view.getUint32(stsz.start+12),sizes=Array.from({length:count},(_,i)=>fixed||view.getUint32(stsz.start+20+i*4));
   if(count!==config.frames)throw Error('Frame count mismatch');
   const stss=find(table,'stss'),sync=new Set(stss?Array.from({length:view.getUint32(stss.start+12)},(_,i)=>view.getUint32(stss.start+16+i*4)-1):sizes.map((_,i)=>i));
   const stsc=find(table,'stsc'),mapping=Array.from({length:view.getUint32(stsc.start+12)},(_,i)=>({chunk:view.getUint32(stsc.start+16+i*12),count:view.getUint32(stsc.start+20+i*12)}));
   const stco=find(table,'stco');if(!stco)throw Error('Unsupported chunk offsets');
   const offsets=[],chunkCount=view.getUint32(stco.start+12);let sample=0,row=0;
   for(let i=0;i<chunkCount;i++){while(row+1<mapping.length&&mapping[row+1].chunk<=i+1)row++;let at=view.getUint32(stco.start+16+i*4);for(let k=0;k<mapping[row].count;k++){offsets.push(at);at+=sizes[sample++];}}
   if(offsets.length!==count)throw Error('Invalid sample table');
   const codec='avc1.'+[description[1],description[2],description[3]].map(n=>n.toString(16).padStart(2,'0')).join('');
   for(const slot of workers)slot.worker.postMessage({init:{codec,description,codedWidth:config.sourceWidth,codedHeight:config.sourceHeight,optimizeForLatency:true}});
   return {offsets,sizes,sync};
  }
  function pump(){
   if(closed||!metadata||wanted===shown||pending.has(wanted))return;
   const slot=workers.find(s=>!s.busy);if(!slot)return;
   let key=wanted;while(key>0&&!metadata.sync.has(key))key--;
   if(metadata.offsets[wanted]+metadata.sizes[wanted]>length)return;
   const samples=[];for(let i=key;i<=wanted;i++)samples.push({index:i,key:metadata.sync.has(i),data:bytes.slice(metadata.offsets[i],metadata.offsets[i]+metadata.sizes[i]).buffer});
   slot.busy=true;pending.add(wanted);slot.worker.postMessage({id:++serial,index:wanted,fps:config.fps,samples},samples.map(s=>s.data));
  }
  try{
   const blobURL=URL.createObjectURL(new Blob(['('+workerCode.toString()+')()'],{type:'text/javascript'}));
   workers=Array.from({length:2},()=>{const slot={worker:new Worker(blobURL),busy:false};slot.worker.onerror=fail;slot.worker.onmessage=({data})=>{if(data.error){fail();return;}if(closed){data.picture?.close();return;}slot.busy=false;pending.delete(data.index);if(data.id>presented){presented=data.id;shown=data.index;present(data.index,data.picture);}else data.picture.close();pump();};return slot;});URL.revokeObjectURL(blobURL);
   (async()=>{const response=await fetch(url,{signal:controller.signal});if(!response.ok)throw Error('Video unavailable');const reader=response.body.getReader();while(!closed){const {done,value}=await reader.read();if(done)break;if(length+value.length>bytes.length){const next=new Uint8Array(Math.max(bytes.length*2,length+value.length));next.set(bytes);bytes=next;}bytes.set(value,length);length+=value.length;
    if(!metadata){let at=0;const view=new DataView(bytes.buffer);while(at+8<=length){const size=view.getUint32(at);if(size<8)throw Error('Unsupported MP4');if(at+size>length)break;if(string(bytes,at+4,4)==='moov'){metadata=parse({start:at,end:at+size});break;}at+=size;}}
    pump();
   }if(!metadata)throw Error('Missing fast-start metadata');pump();})().catch(()=>{if(!closed)fail();});
  }catch{queueMicrotask(fail);}
  return {seek:index=>{wanted=index;pump();},close};
 }

})();
