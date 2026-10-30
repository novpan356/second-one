/* Burn a repeated watermark into video pixels before upload. No original is published. */
(() => {
 'use strict';
 // The watermark itself is unchanged: existing marked videos must not be stamped again.
 const TEXT='RAY PAN',VERSION='ray-pan-diagonal-30-v1',MAX_FILE=100*1024*1024;
 function plan(inputBytes,duration){
  if(!Number.isSafeInteger(inputBytes)||inputBytes<1||!Number.isFinite(duration)||duration<=0)throw Error('视频大小或时长无效');
  const sourceRate=inputBytes*8/duration,targetRate=sourceRate*1.03;
  const audioBitsPerSecond=targetRate>=512000?128000:targetRate>=128000?64000:16000;
  const videoBitsPerSecond=Math.round(Math.max(16000,Math.min(24000000,targetRate-audioBitsPerSecond)));
  // A small container allowance applies only to tiny clips. A 10 MB input is capped at 12.5 MB.
  const maxBytes=Math.min(MAX_FILE,Math.ceil(Math.max(inputBytes*1.25,inputBytes+65536)));
  return {videoBitsPerSecond,audioBitsPerSecond,maxBytes};
 }
 function layer(width,height){
  const c=document.createElement('canvas');c.width=width;c.height=height;
  const x=c.getContext('2d'),s=Math.min(width,height)/1080,reach=Math.hypot(width,height);
  x.translate(width/2,height/2);x.rotate(-Math.PI/6);
  x.font=`600 ${Math.max(14,36*s)}px Arial, sans-serif`;x.textAlign='center';x.textBaseline='middle';
  x.fillStyle='#fff';x.strokeStyle='#161616';x.lineWidth=Math.max(.6,1.2*s);
  const dx=Math.max(120,300*s),dy=Math.max(80,180*s);
  for(let row=-Math.ceil(reach/dy);row<=Math.ceil(reach/dy);row++)for(let col=-Math.ceil(reach/dx);col<=Math.ceil(reach/dx);col++){
   const px=col*dx+(row%2)*dx/2,py=row*dy;x.strokeText(TEXT,px,py);x.fillText(TEXT,px,py);
  }
  const out=document.createElement('canvas');out.width=width;out.height=height;const ox=out.getContext('2d');ox.globalAlpha=.3;ox.drawImage(c,0,0);return out;
 }
 async function apply(file,progress=()=>{}){
  if(!window.MediaRecorder||!HTMLCanvasElement.prototype.captureStream)throw Error('当前浏览器不支持视频水印写入，请使用最新版 Chrome / Edge / Safari');
  const types=['video/mp4;codecs=avc1,mp4a.40.2','video/mp4;codecs=avc1,opus','video/mp4'];
  const mimeType=types.find(t=>MediaRecorder.isTypeSupported(t));if(!mimeType)throw Error('当前浏览器无法编码 MP4，请使用最新版 Chrome / Edge / Safari 后重新上传');
  if(document.hidden)throw Error('请保持编辑页面在前台，再添加视频');
  const AC=window.AudioContext||window.webkitAudioContext;if(!AC)throw Error('当前浏览器无法保留视频音轨，请换用最新版浏览器');
  const audio=new AC(),resume=audio.resume(),v=document.createElement('video'),url=URL.createObjectURL(file);
  let fail,aborted=false,destination;
  const foreground=()=>{if(document.hidden){aborted=true;fail?.(Error('水印处理已停止：请保持此页面在前台，重新添加视频；原作品未被替换'));}};
  document.addEventListener('visibilitychange',foreground);
  try{
   await new Promise((resolve,reject)=>{const t=setTimeout(()=>reject(Error('浏览器未允许音频处理，请点击选择文件后重新上传')),5000);resume.then(()=>{clearTimeout(t);resolve();},e=>{clearTimeout(t);reject(e);});});if(audio.state!=='running')throw Error('浏览器尚未允许音频处理，请点击选择视频后重试');
   v.muted=false;v.playsInline=true;v.preload='auto';v.src=url;
   await new Promise((resolve,reject)=>{const timeout=setTimeout(()=>reject(Error('视频载入超时，请换成可播放的 MP4')),20000);v.onloadeddata=()=>{clearTimeout(timeout);resolve();};v.onerror=()=>{clearTimeout(timeout);reject(Error('无法读取此视频，请换成 H.264 MP4'));};});
   if(aborted)throw Error('请保持此页面在前台，再添加视频');
   if(!v.videoWidth||!Number.isFinite(v.duration)||v.duration<=0)throw Error('视频尺寸或时长无效');
   const settings=plan(file.size,v.duration),c=document.createElement('canvas');c.width=v.videoWidth;c.height=v.videoHeight;
   const x=c.getContext('2d',{alpha:false}),mark=layer(c.width,c.height);
   const source=audio.createMediaElementSource(v);destination=audio.createMediaStreamDestination();source.connect(destination);
   async function rewind(){
    v.pause();if(v.currentTime<.001)return;
    await new Promise((resolve,reject)=>{const t=setTimeout(()=>{v.onseeked=null;reject(Error('视频重试定位失败，请重新选择原片'));},10000);v.onseeked=()=>{clearTimeout(t);v.onseeked=null;resolve();};v.currentTime=0;});
   }
   async function encode(videoBitsPerSecond,attempt){
    await rewind();if(aborted)throw Error('请保持此页面在前台，再添加视频');
    let stream,recorder,timer,frame,raf;
    try{
     const draw=()=>{x.drawImage(v,0,0,c.width,c.height);x.drawImage(mark,0,0);progress(Math.min(99,Math.floor(v.currentTime/v.duration*100)),{attempt});};draw();
     stream=c.captureStream(30);destination.stream.getAudioTracks().forEach(t=>stream.addTrack(t.clone()));
     recorder=new MediaRecorder(stream,{mimeType,videoBitsPerSecond,audioBitsPerSecond:settings.audioBitsPerSecond});
     const chunks=[];let size=0;
     return await new Promise((resolve,reject)=>{
      let settled=false;const rejectAttempt=e=>{if(settled)return;settled=true;reject(e);};fail=rejectAttempt;
      recorder.ondataavailable=e=>{if(settled||!e.data.size)return;size+=e.data.size;if(size>settings.maxBytes){const error=Error('浏览器编码输出超过体积上限');error.code='OUTPUT_TOO_LARGE';rejectAttempt(error);return;}chunks.push(e.data);};
      recorder.onerror=()=>rejectAttempt(Error('视频编码失败，请使用最新版浏览器重试'));
      recorder.onstop=()=>{if(!settled){settled=true;resolve(new Blob(chunks,{type:'video/mp4'}));}};
      v.onerror=()=>rejectAttempt(Error('视频播放中断，原作品未被替换'));
      v.onended=()=>{draw();recorder.stop();};
      const tick=()=>{if(v.ended||settled)return;draw();if(v.requestVideoFrameCallback)frame=v.requestVideoFrameCallback(tick);else raf=requestAnimationFrame(tick);};
      timer=setTimeout(()=>rejectAttempt(Error('处理超时，请保持页面在前台并重新上传')),Math.max(45000,v.duration*1500+20000));
      recorder.start(1000);tick();v.play().catch(()=>rejectAttempt(Error('浏览器阻止了视频处理，请点击选择文件后重试')));
     });
    }finally{
     fail=undefined;clearTimeout(timer);v.pause();v.onended=null;v.onerror=null;
     if(frame!==undefined)v.cancelVideoFrameCallback?.(frame);if(raf)cancelAnimationFrame(raf);
     if(recorder&&recorder.state!=='inactive')recorder.stop();if(recorder){recorder.ondataavailable=null;recorder.onerror=null;recorder.onstop=null;}stream?.getTracks().forEach(t=>t.stop());
    }
   }
   let output;
   for(let attempt=1;attempt<=3;attempt++){
    try{output=await encode(Math.max(16000,Math.round(settings.videoBitsPerSecond*.6**(attempt-1))),attempt);break;}
    catch(e){if(aborted||e.code!=='OUTPUT_TOO_LARGE')throw e;if(attempt===3)throw Error('浏览器未能控制视频体积，已停止导入；当前作品未被替换，请换用最新版 Chrome / Edge 后重新选择原片');}
   }
   if(!output||output.size<1000||output.size>settings.maxBytes)throw Error('视频水印编码结果无效，原作品未被替换，请重试');
   progress(100);return new File([output],file.name.replace(/\.[^.]+$/,'')+'-watermarked.mp4',{type:'video/mp4'});
  }finally{
   document.removeEventListener('visibilitychange',foreground);v.pause();v.removeAttribute('src');v.load();destination?.stream.getTracks().forEach(t=>t.stop());URL.revokeObjectURL(url);await audio.close().catch(()=>{});
  }
 }
 window.VideoWatermark=Object.freeze({apply,layer,plan,version:VERSION});
})();
