/* Scroll-controlled MG wardrobe sequence. No autoplay, audio or seek latency. */
(() => {
 'use strict';
 const config=window.PORTFOLIO?.character,section=document.querySelector('#character-story'),scene=document.querySelector('#character-scene');
 if(!section||!config?.atlases?.length){if(section)section.hidden=true;document.documentElement.classList.remove('has-character-intro');window.PortfolioCharacter={getState:()=>({enabled:false})};return;}
 const profile=window.PORTFOLIO,canvas=document.querySelector('#character-canvas'),ctx=canvas.getContext('2d',{alpha:true}),poster=document.querySelector('#character-poster'),figure=document.querySelector('.portrait-figure'),left=document.querySelector('.portrait-copy-left'),right=document.querySelector('.portrait-copy-right'),meter=document.querySelector('.portrait-progress i'),count=document.querySelector('#portrait-step');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),clamp=v=>Math.max(0,Math.min(1,v)),ease=v=>{v=clamp(v);return v*v*(3-2*v);};
 let mobile=innerWidth<=650,cache=new Map(),pending=new Set(),raf=0,top=0,range=1,progress=0,frame=0,lastDrawn=-1,lastChapter=-1,firstPaint=false,loaded=0,failed=false;
 const chapters=[
  [profile.introTitle1||'把想法，\n变成画面。',profile.introText1||profile.bio,'PHOTOGRAPHY / DIRECTION / FILMMAKING'],
  [profile.introTitle2||'观察光，\n也观察人。',profile.introText2||'摄影 / 色彩。关注人与空间，让细节参与叙事。','LIGHT / PEOPLE / COLOUR'],
  [profile.introTitle3||'让故事，\n有自己的节奏。',profile.introText3||profile.projects?.[0]?.description||profile.bio,'CONCEPT / FILM / EDITING'],
  [profile.introTitle4||'换一种视角，\n继续创作。',profile.introText4||'用作品介绍自己。继续向下，进入影像与摄影作品合集。','SELECTED WORK / RAY PAN']
 ];
 document.querySelector('#portrait-name').textContent=profile.name;document.querySelector('#portrait-role').textContent=profile.introFocus||profile.role;poster.src=config.poster||'';
 function sources(){return mobile&&config.mobileAtlases?.length?config.mobileAtlases:config.atlases;}
 function load(index){const paths=sources();if(index<0||index>=paths.length||cache.has(index)||pending.has(index))return;pending.add(index);const image=new Image();image.decoding='async';image.fetchPriority=index===0?'high':'low';image.onload=()=>{pending.delete(index);cache.set(index,image);loaded++;request();};image.onerror=()=>{pending.delete(index);failed=true;};image.src=paths[index];}
 function paint(){const per=config.columns*config.rows,index=Math.floor(frame/per);load(index);load(index+1);load(index-1);let image=cache.get(index),slot=frame%per;if(!image){if(!firstPaint)return;return;}if(lastDrawn===frame&&firstPaint)return;const fw=image.naturalWidth/config.columns,fh=image.naturalHeight/config.rows;ctx.clearRect(0,0,canvas.width,canvas.height);ctx.drawImage(image,(slot%config.columns)*fw,Math.floor(slot/config.columns)*fh,fw,fh,0,0,canvas.width,canvas.height);poster.hidden=true;canvas.hidden=false;lastDrawn=frame;firstPaint=true;}
 function draw(){raf=0;progress=clamp((scrollY-top)/range);frame=Math.round(clamp(progress/.79)*(config.frames-1));paint();const chapter=Math.min(3,Math.floor(clamp((progress-.035)/.82)*4)),t=clamp((progress-.035-chapter*.205)/.205),alpha=ease(t/.18)*(1-ease((t-.82)/.18))*(1-ease((progress-.82)/.07));
  if(chapter!==lastChapter){document.querySelector('#portrait-chapter-title').textContent=chapters[chapter][0];document.querySelector('#portrait-chapter-text').textContent=chapters[chapter][1];document.querySelector('#portrait-chapter-skill').textContent=chapters[chapter][2];count.textContent=String(chapter+1).padStart(2,'0')+' / 04';lastChapter=chapter;}
  left.style.opacity=right.style.opacity=String(alpha);left.style.transform=`translate3d(0,${reduced.matches?0:42-t*84}px,0)`;right.style.transform=`translate3d(0,${reduced.matches?0:30-t*60}px,0)`;
  const exit=ease((progress-.86)/.14);figure.style.opacity=String(1-exit);figure.style.transform=`translate3d(-50%,0,0) scale(${1-exit*.12})`;scene.style.setProperty('--portrait-progress',progress);meter.style.transform=`scaleX(${progress})`;scene.classList.toggle('portrait-complete',progress>.9);
 }
 function request(){if(!raf&&!document.hidden)raf=requestAnimationFrame(draw);}
 function measure(){const nextMobile=innerWidth<=650;if(nextMobile!==mobile){mobile=nextMobile;cache=new Map();pending=new Set();firstPaint=false;lastDrawn=-1;poster.hidden=false;canvas.hidden=true;}top=section.getBoundingClientRect().top+scrollY;range=Math.max(1,section.offsetHeight-innerHeight);canvas.width=mobile?Math.min(config.frameWidth,Math.ceil(innerWidth*1.2)):config.frameWidth;canvas.height=Math.round(canvas.width*config.frameHeight/config.frameWidth);lastDrawn=-1;request();}
 window.addEventListener('scroll',request,{passive:true});window.addEventListener('resize',measure);window.addEventListener('load',measure);window.addEventListener('portfolio-enter-progress',request);document.addEventListener('visibilitychange',request);
 window.PortfolioCharacter={getState:()=>({enabled:true,progress,frame,chapter:lastChapter,loaded,failed,mobile,firstPaint})};measure();load(0);
})();
