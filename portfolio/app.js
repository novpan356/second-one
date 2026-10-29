'use strict';
const profile=window.PORTFOLIO, projects=profile.projects;
function localBlob(value){
 if(typeof value!=='string'||!value.startsWith('data:'))return value;
 const comma=value.indexOf(','),meta=value.slice(5,comma),bytes=atob(value.slice(comma+1));
 const data=new Uint8Array(bytes.length);for(let i=0;i<bytes.length;i++)data[i]=bytes.charCodeAt(i);
 return URL.createObjectURL(new Blob([data],{type:meta.split(';')[0]}));
}
profile.atlas=localBlob(profile.atlas);profile.demoVideo=localBlob(profile.demoVideo);
for(const p of projects){if(p.cover)p.cover=localBlob(p.cover);if(p.preview)p.preview=localBlob(p.preview);if(p.video)p.video=localBlob(p.video);}
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const $=s=>document.querySelector(s), escapeHTML=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const type=p=>p.kind==='video'?'影像':'摄影';
const find=id=>projects.find(p=>p.id===id);
function cover(p,extra='',full=false){
 if(!p)return '<span class="cover" aria-hidden="true"></span>';
 const label=escapeHTML(p.title+' · '+type(p));
 if(!full&&p.preview)return `<span class="cover ${extra}"><img src="${escapeHTML(p.preview)}" alt="${label}" decoding="async" loading="${extra==='gallery'?'eager':'lazy'}" fetchpriority="low" draggable="false"></span>`;
 if(p.cover)return `<span class="cover ${extra}"${full&&p.preview?' style="background-image:url('+escapeHTML(p.preview)+');background-size:cover;background-position:center"':''}><img src="${escapeHTML(p.cover)}" alt="${label}" decoding="async" loading="${full?'eager':'lazy'}" draggable="false"></span>`;
 const [x,y]=p.cell;
 return `<span class="cover ${extra}"><svg viewBox="${x} ${y} 1 1" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${label}"><image href="${escapeHTML(profile.atlas)}" x="0" y="0" width="3" height="2" preserveAspectRatio="none"/></svg></span>`;
}
let filter='all',view='grid',query='',currentProject=null,modalSource=null,viewerScroll=0,zoomed=false,sharedAnimation=null,closing=false;
const stage=$('#gallery-stage'),world=$('#gallery-world');
let entranceProgress=document.documentElement.classList.contains('intro-pending')?0:1;
window.addEventListener('portfolio-enter-progress',e=>{entranceProgress=e.detail;requestFrame();});
let drift=.075,driftTarget=.075,hoveredCard=-1,focusedCard=-1;
let offset=innerWidth<=650?0:.5,target=offset,velocity=0,dragging=false,hovering=false,focused=false,userPaused=false,dragDistance=0,lastPointer=0,ignoreClickUntil=0;
let vw=innerWidth,vh=innerHeight,heroH=0,storyH=0,galleryTop=0,scrollPos=scrollY,lastTime=performance.now(),frame=null,documentVisible=true,galleryInteractive=true;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),lerp=(a,b,t)=>a+(b-a)*t,smooth=t=>t*t*(3-2*t);
const galleryProjects=[...projects,...projects];
world.innerHTML=galleryProjects.map((p,i)=>`<button class="gallery-card" data-project="${p.id}" data-gallery-index="${i}" aria-label="查看${type(p)}：${escapeHTML(p.title)}">${cover(p,'gallery')}<span class="gallery-badge"><span>${p.kind==='video'?'▷':'↗'}</span><b>${escapeHTML(p.english)}</b></span></button>`).join('');
const cards=[...world.children],hoverStates=cards.map(()=>({rx:0,ry:0,tx:0,ty:0,lift:0,scale:1}));
function measure(){vw=innerWidth;vh=innerHeight;heroH=$('.hero').offsetHeight;galleryTop=$('.hero').getBoundingClientRect().top+scrollY;storyH=$('.story-track').offsetHeight;requestFrame();}
function draw(now){
 frame=null;if(!documentVisible)return;
 const dt=Math.min((now-lastTime)/1000||.016,.08);lastTime=now;
 const galleryScroll=scrollPos-galleryTop,introScale=profile.character?.scrollScale||1,revealDistance=vh*.88*introScale,galleryReveal=galleryTop>0?smooth(clamp((galleryScroll+revealDistance)/revealDistance,0,1)):1;
 const mobile=vw<=650,begin=heroH*.4,progress=smooth(clamp((galleryScroll-begin)/(heroH*1.04),0,1)),expand=smooth(clamp((galleryScroll-heroH*1.45)/(heroH*.85),0,1));
 const finish=heroH+storyH,exit=clamp((galleryScroll-(finish-vh*.85))/(vh*.7),0,1);
 const inGallery=galleryScroll> -vh*.9*introScale&&galleryScroll<finish-vh*.1;galleryInteractive=progress<.8&&galleryReveal>.95;
 const paused=!inGallery||galleryReveal<.95||entranceProgress<1||userPaused||hovering||focused||dragging||!!currentProject||reduced.matches||progress>.03;
 drift=lerp(drift,driftTarget,Math.min(1,dt*3));if(!paused)target+=dt*drift;
 if(!dragging&&!reduced.matches){target+=velocity*dt;velocity*=Math.exp(-5*dt);}
 offset=reduced.matches?target:lerp(offset,target,Math.min(1,dt*9));
 if(galleryProjects.length&&Math.abs(target)>10000){const k=Math.floor(target/galleryProjects.length)*galleryProjects.length;target-=k;offset-=k;}
 stage.style.visibility=inGallery?'visible':'hidden';stage.style.opacity=String((1-exit)*entranceProgress*galleryReveal);stage.inert=!inGallery||entranceProgress<1||galleryReveal<.95;
 const radius=mobile?vw*.85+230:Math.max(760,vw*.66),arcWidth=mobile?188:252.5,arcHeight=arcWidth*1.37,baseZ=mobile?-360:-430,step=mobile?.46:.24;
 let hoverAnimating=false;const floating=entranceProgress===1&&!userPaused&&!reduced.matches&&inGallery&&!currentProject&&progress<.8;
 for(const [i,card]of cards.entries()){
  const repeated=mobile&&i>=projects.length;card.setAttribute('aria-hidden',String(repeated));if(repeated){card.style.visibility='hidden';card.style.opacity='0';card.style.pointerEvents='none';card.tabIndex=-1;continue;}
  const total=mobile?projects.length:galleryProjects.length;
  const relative=((i-offset+total*100+total/2)%total)-total/2;
  const angle=relative*step,arcX=vw/2+Math.sin(angle)*radius,arcY=vh*(mobile?.59:.61)+(1-Math.cos(angle))*12,arcZ=baseZ+radius*(1-Math.cos(angle));
  const stackW=mobile?192:270,stackH=stackW*1.3,stackX=vw*(mobile?.56:.67)-i*(mobile?8:12),stackY=vh*(mobile?.68:.52)+Math.sin(i*.7)*8,stackZ=45-i*24;
  let width=lerp(arcWidth,stackW,progress),height=lerp(arcHeight,stackH,progress),x=lerp(arcX,stackX,progress),y=lerp(arcY,stackY,progress),z=lerp(arcZ,stackZ,progress);
  let ry=lerp(-angle*180/Math.PI,0,progress),rz=lerp(0,6-i*3,progress);
  if(expand>0){const w=mobile?vw*.77:Math.min(vw*.38,530),h=mobile?vw*.77:Math.min(vh*.64,560);width=lerp(width,i===0?w:stackW*.85,expand);height=lerp(height,i===0?h:stackH*.85,expand);x=lerp(x,vw*(mobile?.53:.68)-i*7,expand);y=lerp(y,vh*(mobile?.68:.52),expand);z=lerp(z,i===0?0:-160-i*10,expand);ry=lerp(ry,0,expand);rz=lerp(rz,0,expand);}
  const h=hoverStates[i],over=galleryInteractive&&(hoveredCard===i||focusedCard===i),ease=reduced.matches?1:Math.min(1,dt*10),desiredLift=over&&!reduced.matches?17:0,desiredScale=over&&!reduced.matches?1.065:1;
  h.lift=lerp(h.lift,desiredLift,ease);h.scale=lerp(h.scale,desiredScale,ease);h.rx=lerp(h.rx,over&&!reduced.matches?h.tx:0,ease);h.ry=lerp(h.ry,over&&!reduced.matches?h.ty:0,ease);
  if(Math.abs(h.lift-desiredLift)>.02||Math.abs(h.scale-desiredScale)>.001||Math.abs(h.rx-(over&&!reduced.matches?h.tx:0))>.02||Math.abs(h.ry-(over&&!reduced.matches?h.ty:0))>.02)hoverAnimating=true;
  const bob=floating&&!over?Math.sin(now*.00072+i*1.71)*5.5*(1-progress):0;
  const cardReveal=entranceProgress*smooth(clamp(galleryReveal*1.5-(i%projects.length)*.055,0,1));if(cardReveal<1){const side=relative<0?-1:1;x=lerp(vw/2+side*vw*.7,x,cardReveal);y=lerp(vh*1.04,y,cardReveal);z=lerp(-850,z,cardReveal);ry-=side*40*(1-cardReveal);rz+=side*12*(1-cardReveal);}
  card.style.width=width+'px';card.style.height=height+'px';card.style.transform=`translate3d(${x-width/2}px,${y-height/2-h.lift+bob}px,${z+h.lift*2}px) rotateX(${h.rx}deg) rotateY(${ry+h.ry}deg) rotateZ(${rz}deg) scale(${h.scale})`;card.classList.toggle('is-hovered',over);
  const arcAlpha=mobile?1-smooth(clamp((Math.abs(relative)-1)/.45,0,1)):1;const alpha=(i===0?1:1-expand)*lerp(arcAlpha,1,progress)*cardReveal;card.style.opacity=String(alpha);card.style.visibility=alpha<.01?'hidden':'visible';card.setAttribute('aria-hidden',String(alpha<.05));card.style.pointerEvents=alpha<.05||!inGallery||exit>.5?'none':'auto';card.tabIndex=alpha<.05||!inGallery||exit>.5?-1:0;card.style.cursor=galleryInteractive?'grab':'pointer';
 }
 const introFade=1-clamp(galleryScroll/(heroH*.45),0,1);$('.hero-heading').style.opacity=introFade;$('.hero-heading').style.transform=`translateY(${-Math.min(Math.max(0,galleryScroll)*.13,50)}px)`;
 const header=document.querySelector('body>header');const navReveal=entranceProgress*galleryReveal*(1-clamp((galleryScroll-heroH*.55)/(heroH*.45),0,1));header.style.opacity=String(navReveal);header.style.transform=`translateY(${(1-navReveal)*-28}px)`;header.inert=navReveal<.8;
 const first=$('.story-first'),second=$('.story-second'),firstOn=expand<.42;
 first.style.opacity=String(1-smooth(clamp((expand-.1)/.5,0,1)));first.style.transform=`translateY(${-expand*30}px)`;first.inert=!firstOn;first.setAttribute('aria-hidden',String(!firstOn));
 second.style.opacity=String(smooth(clamp((expand-.25)/.5,0,1)));second.style.transform=`translateY(${(1-expand)*25}px)`;second.inert=firstOn;second.setAttribute('aria-hidden',String(firstOn));second.style.pointerEvents=firstOn?'none':'auto';
 const active=projects.length?((Math.round(offset)%projects.length)+projects.length)%projects.length:-1;$('#gallery-index').textContent=String(active+1).padStart(2,'0')+' / '+String(projects.length).padStart(2,'0');
 if(floating||hoverAnimating||(!reduced.matches&&inGallery&&!paused)||Math.abs(offset-target)>.001||(!reduced.matches&&Math.abs(velocity)>.001))requestFrame();
}
function requestFrame(){if(!frame&&documentVisible)frame=requestAnimationFrame(draw);}
window.addEventListener('scroll',()=>{scrollPos=scrollY;requestFrame();},{passive:true});window.addEventListener('resize',measure);window.addEventListener('load',measure);
for(const [index,card] of cards.entries()){
 let touchStart=null;
 card.addEventListener('pointerdown',e=>{if(!galleryInteractive)return;if(e.pointerType==='touch'){touchStart={x:e.clientX,y:e.clientY};dragDistance=0;lastPointer=e.clientX;velocity=0;return;}dragging=true;dragDistance=0;lastPointer=e.clientX;velocity=0;card.setPointerCapture(e.pointerId);requestFrame();});
 card.addEventListener('pointermove',e=>{if(e.pointerType==='touch'&&touchStart&&!dragging){const dx=e.clientX-touchStart.x,dy=e.clientY-touchStart.y;if(Math.abs(dy)>Math.abs(dx)&&Math.abs(dy)>7){touchStart=null;return;}if(Math.abs(dx)<9)return;dragging=true;card.setPointerCapture(e.pointerId);}if(e.pointerType==='touch'&&!dragging)return;if(!dragging){const r=card.getBoundingClientRect(),h=hoverStates[index];h.tx=clamp((.5-(e.clientY-r.top)/r.height)*11,-6,6);h.ty=clamp(((e.clientX-r.left)/r.width-.5)*13,-7,7);card.style.setProperty('--glint-x',((e.clientX-r.left)/r.width*100)+'%');requestFrame();return;}const dx=e.clientX-lastPointer;dragDistance+=Math.abs(dx);target-=dx/(vw<=650?125:170);velocity=-dx*.18;lastPointer=e.clientX;requestFrame();});
 const end=()=>{touchStart=null;if(dragging&&dragDistance>6)ignoreClickUntil=performance.now()+250;dragging=false;requestFrame();};
 card.addEventListener('pointerup',end);card.addEventListener('pointercancel',end);
 card.addEventListener('mouseenter',()=>{hovering=true;hoveredCard=index;requestFrame();});card.addEventListener('mouseleave',()=>{hovering=false;hoveredCard=-1;requestFrame();});
 card.addEventListener('keydown',e=>{if(!galleryInteractive)return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();target+=e.key==='ArrowRight'?1:-1;requestFrame();}});
}
world.addEventListener('focusin',e=>{focused=true;focusedCard=Number(e.target.closest('[data-gallery-index]')?.dataset.galleryIndex??-1);requestFrame();});world.addEventListener('focusout',()=>{focused=false;focusedCard=-1;requestFrame();});
world.addEventListener('wheel',e=>{if(Math.abs(e.deltaX)>Math.abs(e.deltaY)&&e.cancelable){e.preventDefault();target+=e.deltaX/220;requestFrame();}},{passive:false});
$('#gallery-prev').addEventListener('click',()=>{target-=1;requestFrame();});$('#gallery-next').addEventListener('click',()=>{target+=1;requestFrame();});
$('#gallery-pause').addEventListener('click',()=>{userPaused=!userPaused;if(userPaused){velocity=0;target=offset;}$('#gallery-pause').setAttribute('aria-pressed',String(userPaused));$('#gallery-pause').setAttribute('aria-label',userPaused?'继续画廊自动转动':'暂停画廊自动转动');$('#gallery-pause').textContent=userPaused?'▷':'Ⅱ';requestFrame();});
reduced.addEventListener('change',()=>{velocity=0;requestFrame();});document.addEventListener('visibilitychange',()=>{documentVisible=!document.hidden;if(!documentVisible){cancelAnimationFrame(frame);frame=null;}else{lastTime=performance.now();requestFrame();}});
window.addEventListener('blur',()=>{dragging=false;velocity=0;});
window.addEventListener('pointermove',e=>{if(e.pointerType==='touch'||scrollPos-galleryTop>heroH*.45||scrollPos<galleryTop-vh*.2||currentProject||e.target.closest('button,a,input,.gallery-card'))return;const x=e.clientX/vw-.5;driftTarget=Math.abs(x)<.06?(driftTarget<0?-.035:.035):clamp(x*.4,-.2,.2);requestFrame();},{passive:true});
function filtered(){return projects.filter(p=>(filter==='all'||p.kind===filter)&&`${p.title} ${p.english} ${p.description} ${p.year} ${p.role}`.toLowerCase().includes(query.toLowerCase()));}
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target);}}),{threshold:.06});
function renderProjects(){
 const list=filtered(),holder=$('#projects');observer.disconnect();holder.className='project-grid'+(view==='list'?' list-view':'');
 holder.innerHTML=list.map(p=>`<article class="project-card ${reduced.matches||view==='list'?'':'reveal'}"><button class="project-image-button" data-project="${p.id}" data-grid-project="${p.id}" aria-label="查看${type(p)}：${escapeHTML(p.title)}"><div class="project-thumb">${cover(p)}<span class="media-badge">${p.kind==='video'?'▷ 影像':'摄影'}${p.duration?' · '+escapeHTML(p.duration):''}</span><span class="thumb-arrow" aria-hidden="true">↗</span></div></button><div class="project-caption"><div><h3><a href="#project-${p.id}" data-project="${p.id}">${escapeHTML(p.title)}</a></h3><p>${escapeHTML(p.english)} / ${type(p)}</p></div><span>${escapeHTML(p.year)}</span></div></article>`).join('');
 holder.querySelectorAll('.reveal').forEach(el=>observer.observe(el));$('#empty').hidden=list.length>0;$('#shown-count').textContent=String(list.length).padStart(2,'0')+' SELECTED PROJECTS';$('#result-status').textContent=`显示 ${list.length} 件作品`;
 document.querySelectorAll('[data-filter]').forEach(b=>{const active=b.dataset.filter===filter;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===view)));
}
function announce(text){$('#announcement').textContent=text;}
let activeThemeLayer=0,themeGeneration=0;
function applyTheme(theme){
 const layers=[...document.querySelectorAll('#detail-background .theme-layer')];activeThemeLayer=1-activeThemeLayer;const next=layers[activeThemeLayer],old=layers[1-activeThemeLayer];next.style.background=theme.background;next.classList.add('active');old.classList.remove('active');
 $('#ambient-background').style.background=theme.background;if(currentProject&&!closing)$('#ambient-background').classList.add('visible');
 $('#project-dialog').dataset.palette=theme.dominant.join(',');$('#project-dialog').dataset.paletteSource=theme.source;
}
async function updateProjectTheme(p){
 const generation=++themeGeneration;applyTheme(PortfolioColor.theme(PortfolioColor.fallback(p),'configured-fallback'));
 const theme=await PortfolioColor.project(p,profile);if(generation===themeGeneration&&currentProject?.id===p.id&&!closing)applyTheme(theme);
}
function fillDetail(p){
 currentProject=p;zoomed=false;$('#zoom-image').setAttribute('aria-pressed','false');$('#zoom-image').textContent='放大图片 ＋';$('#zoom-image').hidden=p.kind==='video';
 $('#detail-number').textContent=String(projects.indexOf(p)+1).padStart(2,'0')+' / '+String(projects.length).padStart(2,'0');$('#detail-type').textContent=type(p)+' / SELECTED PROJECT';$('#detail-title').textContent=p.title;$('#detail-english').textContent=p.english;$('#detail-description').textContent=p.description;
 $('#detail-meta').innerHTML=`<dt>年份</dt><dd>${escapeHTML(p.year)}</dd><dt>类别</dt><dd>${type(p)}</dd><dt>参与角色</dt><dd>${escapeHTML(p.role)}</dd>`;$('#detail-note').textContent=p.note||'';
 updateProjectTheme(p);const visual=$('#detail-visual');visual.classList.remove('zoomed');visual.innerHTML=cover(p,'',true)+(p.kind==='video'?'<button class="video-play" aria-label="播放短片"><span>▷</span><small>播放短片</small></button>':'');
 $('#detail-caption').textContent=p.kind==='video'?'FILM / '+(p.duration||'VIDEO'):'PHOTOGRAPH / '+p.year;
}
async function animateShared(p,source,opening=true){
 if(reduced.matches)return;
 const targetVisual=$('#detail-visual'),from=source?.getBoundingClientRect(),to=targetVisual.getBoundingClientRect();if(!from||from.width<5||from.bottom<0||from.top>innerHeight)return;
 const clone=document.createElement('div');clone.className='shared-cover';clone.innerHTML=cover(p);clone.style.width=to.width+'px';clone.style.height=to.height+'px';$('#project-dialog').append(clone);targetVisual.style.opacity='0';
 const a={transform:`translate(${from.left}px,${from.top}px) scale(${from.width/to.width},${from.height/to.height})`,borderRadius:'5px'},b={transform:`translate(${to.left}px,${to.top}px) scale(1,1)`,borderRadius:'4px'};
 sharedAnimation=clone.animate(opening?[a,b]:[b,a],{duration:opening?650:420,easing:opening?'cubic-bezier(.18,.72,.15,1)':'cubic-bezier(.4,0,.7,.2)',fill:'both'});
 try{await sharedAnimation.finished;}catch{}clone.remove();targetVisual.style.opacity='';sharedAnimation=null;
}
async function openProject(p,trigger){
 if(!p||currentProject||performance.now()<ignoreClickUntil)return;
 viewerScroll=scrollY;target=offset;velocity=0;dragging=false;modalSource=trigger?.querySelector('.project-thumb,.cover')||trigger;fillDetail(p);const dialog=$('#project-dialog');dialog.classList.remove('is-closing','theme-visible');dialog.showModal();document.body.classList.remove('viewer-closing');document.body.classList.add('viewer-open');requestAnimationFrame(()=>dialog.classList.add('theme-visible'));dialog.scrollTop=0;requestFrame();
 if(!reduced.matches)$('.detail-copy').animate([{opacity:0,transform:'translateY(15px)'},{opacity:1,transform:'none'}],{duration:650,easing:'ease-out'});
 await animateShared(p,modalSource,true);$('#close-project').focus({preventScroll:true});
}
async function closeProject(){
 if(!currentProject||closing)return;closing=true;document.body.classList.add('viewer-closing');$('#project-dialog').classList.add('is-closing');$('#project-dialog').classList.remove('theme-visible');$('#ambient-background').classList.remove('visible');sharedAnimation?.cancel();const p=currentProject;const video=$('#detail-visual video');video?.pause();
 const source=modalSource;await animateShared(p,source,false);$('#project-dialog').close();closing=false;
}
$('#project-dialog').addEventListener('close',()=>{sharedAnimation?.cancel();$('#detail-visual video')?.pause();$('#detail-visual').innerHTML='';currentProject=null;document.body.classList.remove('viewer-open','viewer-closing');$('#project-dialog').classList.remove('is-closing','theme-visible');$('#ambient-background').classList.remove('visible');window.scrollTo({top:viewerScroll,behavior:'instant'});scrollPos=viewerScroll;requestFrame();if(modalSource?.isConnected)modalSource.closest('button,a')?.focus({preventScroll:true});});
$('#project-dialog').addEventListener('cancel',e=>{e.preventDefault();closeProject();});$('#close-project').addEventListener('click',closeProject);$('#detail-home').addEventListener('click',e=>{e.preventDefault();closeProject();});
function cycleProject(step){if(!currentProject||closing)return;sharedAnimation?.cancel();$('#detail-visual video')?.pause();const list=filtered().length?filtered():projects;let index=list.findIndex(p=>p.id===currentProject.id);const next=list[(index+step+list.length)%list.length];fillDetail(next);modalSource=document.querySelector(`[data-grid-project="${next.id}"] .project-thumb`);if(!reduced.matches)$('#detail-visual').animate([{opacity:.1,transform:`translateX(${step*15}px)`},{opacity:1,transform:'none'}],{duration:400,easing:'ease-out'});announce(next.title);}
$('#previous-project').addEventListener('click',()=>cycleProject(-1));$('#next-project').addEventListener('click',()=>cycleProject(1));
$('#zoom-image').addEventListener('click',()=>{if(!currentProject||currentProject.kind!=='image')return;zoomed=!zoomed;$('#detail-visual').classList.toggle('zoomed',zoomed);$('#zoom-image').setAttribute('aria-pressed',String(zoomed));$('#zoom-image').textContent=zoomed?'还原图片 －':'放大图片 ＋';if(!zoomed)$('#detail-visual .cover').style.transformOrigin='50% 50%';});
$('#detail-visual').addEventListener('pointermove',e=>{if(!zoomed)return;const r=e.currentTarget.getBoundingClientRect();const image=$('#detail-visual .cover');image.style.transformOrigin=`${clamp((e.clientX-r.left)/r.width*100,0,100)}% ${clamp((e.clientY-r.top)/r.height*100,0,100)}%`;});
async function playVideo(){if(!currentProject||currentProject.kind!=='video')return;const holder=$('#detail-visual');holder.innerHTML='<video controls controlslist="nodownload" playsinline preload="metadata" aria-label="作品视频播放器"></video>';const video=holder.querySelector('video');video.addEventListener('contextmenu',e=>e.preventDefault());video.src=currentProject.video||profile.demoVideo;let lastTheme=-10;const sample=()=>{if(!currentProject||holder.querySelector('video')!==video)return;const theme=PortfolioColor.video(video);if(theme)applyTheme(theme);};video.addEventListener('loadeddata',sample,{once:true});video.addEventListener('seeked',sample);video.addEventListener('timeupdate',()=>{if(Math.abs(video.currentTime-lastTheme)>2.5){lastTheme=video.currentTime;sample();}});video.addEventListener('error',()=>{if(holder.querySelector('video')!==video)return;holder.innerHTML='<div class="media-error"><span>这段视频暂时无法播放。</span><button class="retry-video">重新加载 ↗</button></div>';});try{await video.play();}catch{if(video.error)return;video.setAttribute('controls','');}}
function showContact(){const email=profile.email?.trim();$('#contact-description').textContent=email?'摄影、短片，或一个还没有成形的想法。期待听到你的故事。':'感谢你的关注。联系方式暂未公开。';$('#contact-email').textContent=email||'';if(email)$('#contact-email').href='mailto:'+email;else $('#contact-email').removeAttribute('href');$('#copy-email').hidden=!email;$('#contact-dialog').showModal();}
$('#copy-email').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(profile.email);$('#copy-email').textContent='已复制 ✓';announce('邮箱已复制');}catch{$('#copy-email').textContent='请选中邮箱手动复制';}});
document.addEventListener('click',e=>{const b=e.target.closest('button,a');if(!b)return;if(b.dataset.project){e.preventDefault();openProject(find(b.dataset.project),b);}else if(b.hasAttribute('data-filter')){filter=b.dataset.filter;renderProjects();}else if(b.hasAttribute('data-view')){view=b.dataset.view;renderProjects();}else if(b.hasAttribute('data-contact'))showContact();else if(b.hasAttribute('data-close-contact'))$('#contact-dialog').close();else if(b.matches('.video-play,.retry-video'))playVideo();});
document.addEventListener('keydown',e=>{if(!currentProject||e.target.matches('input,textarea,video'))return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();cycleProject(e.key==='ArrowRight'?1:-1);}});
$('#search').addEventListener('input',e=>{query=e.target.value.trim().slice(0,100);renderProjects();});$('#clear-search').addEventListener('click',()=>{filter='all';query='';$('#search').value='';renderProjects();});
$('#contact-dialog').addEventListener('click',e=>{if(e.target!==e.currentTarget)return;const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close();});
for(const brand of document.querySelectorAll('.brand')){const node=[...brand.childNodes].find(n=>n.nodeType===Node.TEXT_NODE);if(node)node.nodeValue=profile.name;}
$('.hero-heading .eyebrow').textContent='PHOTOGRAPHY / FILM / VISUAL STORIES';$('#hero-name').textContent=profile.name;$('.about-signature>span').textContent=profile.name;$('.about-signature small').textContent=profile.role;if($('#footer-name'))$('#footer-name').textContent=profile.name;document.title=profile.name+' — 摄影与影像作品集';
$('#bio').textContent=profile.bio;$('#year').textContent=new Date().getFullYear();$('#about-image').innerHTML=cover(projects.find(p=>p.id==='whisper')||projects.find(p=>p.kind==='image')||projects[0]);
$('#total-count').textContent=String(projects.length).padStart(2,'0');document.querySelector('nav a span').textContent=String(projects.length).padStart(2,'0');
for(const b of document.querySelectorAll('[data-filter]'))b.querySelector('sup').textContent=String(b.dataset.filter==='all'?projects.length:projects.filter(p=>p.kind===b.dataset.filter).length).padStart(2,'0');
const featured=projects[0],featuredButton=$('.story-second [data-project]');
if(featured){featuredButton.dataset.project=featured.id;$('.story-second h2').textContent=featured.title+'。';$('.story-second .eyebrow').textContent=featured.kind==='video'?'02 / FEATURED FILM':'02 / FEATURED PHOTOGRAPH';$('.story-second>p:not(.eyebrow)').textContent=featured.description;featuredButton.firstChild.nodeValue=featured.kind==='video'?'查看短片 ':'查看图片 ';$('.story-meta').textContent=featured.year+' / '+type(featured)+(profile.isDemo?' / DEMO':'');}
else{featuredButton.disabled=true;$('.story-second h2').textContent='等待下一段故事。';}
const nameButton=$('.name-reveal'),heading=$('.hero-heading');let namePinned=false,nameInside=false;
function revealName(open){heading.classList.toggle('is-revealed',open);nameButton.setAttribute('aria-expanded',String(open));$('#title-subtitle').setAttribute('aria-hidden',String(!open));}
nameButton.addEventListener('pointerenter',e=>{if(e.pointerType!=='touch'){nameInside=true;revealName(true);}});nameButton.addEventListener('pointerleave',()=>{nameInside=false;if(!namePinned)revealName(false);});
nameButton.addEventListener('focus',()=>revealName(true));nameButton.addEventListener('blur',()=>{namePinned=false;if(!nameInside)revealName(false);});
nameButton.addEventListener('click',e=>{if(matchMedia('(hover:none)').matches||e.detail===0){namePinned=!namePinned;revealName(namePinned||nameInside);}});
// Analyse original artwork colours only when its detail view is opened.
renderProjects();measure();

for(const [key,selector] of Object.entries({tagline:'.hero-heading .eyebrow',collection:'.title-subtitle em',heroNote:'#hero-note',storyTitle:'.story-copy h2',storyText:'.story-copy>p:not(.eyebrow)',aboutTitle:'.about-copy h2'})){if(typeof profile[key]==='string')document.querySelector(selector).textContent=profile[key];}

if(profile.bio)document.querySelector('meta[name="description"]').content=profile.bio;
if(!profile.isDemo){const note=document.querySelector('.demo-note');if(note)note.hidden=true;}
