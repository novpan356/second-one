/* Burn a repeated watermark into video pixels before upload. No original is published. */
(() => {
 'use strict';
 const TEXT='RAY PAN',VERSION='ray-pan-diagonal-30-v1';
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
  let stream,recorder,timer,frame,raf,fail,aborted=false;
  const foreground=()=>{if(document.hidden){aborted=true;fail?.(Error('水印处理已停止：请保持此页面在前台，重新添加视频；原作品未被替换'));}};
  document.addEventListener('visibilitychange',foreground);
  try{
   await new Promise((resolve,reject)=>{const t=setTimeout(()=>reject(Error('浏览器未允许音频处理，请点击选择文件后重新上传')),5000);resume.then(()=>{clearTimeout(t);resolve();},e=>{clearTimeout(t);reject(e);});});if(audio.state!=='running')throw Error('浏览器尚未允许音频处理，请点击选择视频后重试');
   // Route sound only into the recording destination; muting the element would also mute its source node.
   v.muted=false;v.playsInline=true;v.preload='auto';v.src=url;
   await new Promise((resolve,reject)=>{const timeout=setTimeout(()=>reject(Error('视频载入超时，请换成可播放的 MP4')),20000);v.onloadeddata=()=>{clearTimeout(timeout);resolve();};v.onerror=()=>{clearTimeout(timeout);reject(Error('无法读取此视频，请换成 H.264 MP4'));};});
   if(aborted)throw Error('请保持此页面在前台，再添加视频');
   if(!v.videoWidth||!Number.isFinite(v.duration)||v.duration<=0)throw Error('视频尺寸或时长无效');
   const c=document.createElement('canvas');c.width=v.videoWidth;c.height=v.videoHeight;
   const x=c.getContext('2d',{alpha:false}),mark=layer(c.width,c.height);
   const draw=()=>{x.drawImage(v,0,0,c.width,c.height);x.drawImage(mark,0,0);progress(Math.min(99,Math.floor(v.currentTime/v.duration*100)));};draw();
   stream=c.captureStream(30);const source=audio.createMediaElementSource(v),destination=audio.createMediaStreamDestination();source.connect(destination);destination.stream.getAudioTracks().forEach(t=>stream.addTrack(t));
   recorder=new MediaRecorder(stream,{mimeType,videoBitsPerSecond:Math.max(4000000,Math.min(24000000,c.width*c.height*6)),audioBitsPerSecond:192000});
   const chunks=[];let size=0;
   const output=await new Promise((resolve,reject)=>{
    let settled=false;fail=e=>{if(settled)return;settled=true;reject(e);};
    recorder.ondataavailable=e=>{if(e.data.size){chunks.push(e.data);size+=e.data.size;if(size>100*1024*1024)fail(Error('加水印后的视频超过 100 MB，请先压缩或缩短原视频'));}};
    recorder.onerror=()=>fail(Error('视频编码失败，请使用最新版浏览器重试'));
    recorder.onstop=()=>{if(!settled){settled=true;resolve(new Blob(chunks,{type:'video/mp4'}));}};
    v.onerror=()=>fail(Error('视频播放中断，原作品未被替换'));
    v.onended=()=>{draw();recorder.stop();};
    const tick=()=>{if(v.ended||settled)return;draw();if(v.requestVideoFrameCallback)frame=v.requestVideoFrameCallback(tick);else raf=requestAnimationFrame(tick);};
    timer=setTimeout(()=>fail(Error('处理超时，请保持页面在前台并重新上传')),Math.max(45000,v.duration*1500+20000));
    recorder.start(1000);tick();v.play().catch(()=>fail(Error('浏览器阻止了视频处理，请点击选择文件后重试')));
   });
   if(output.size<1000)throw Error('视频水印编码结果无效，请重试');progress(100);
   return new File([output],file.name.replace(/\.[^.]+$/,'')+'-watermarked.mp4',{type:'video/mp4'});
  }finally{
   clearTimeout(timer);document.removeEventListener('visibilitychange',foreground);v.pause();if(frame!==undefined)v.cancelVideoFrameCallback?.(frame);if(raf)cancelAnimationFrame(raf);
   if(recorder&&recorder.state!=='inactive')recorder.stop();stream?.getTracks().forEach(t=>t.stop());v.removeAttribute('src');v.load();URL.revokeObjectURL(url);await audio.close().catch(()=>{});
  }
 }
 window.VideoWatermark=Object.freeze({apply,layer,version:VERSION});
})();
