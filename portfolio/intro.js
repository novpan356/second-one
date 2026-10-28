(() => {
 const root=document.documentElement,screen=document.querySelector('#entry-screen');
 if(!root.classList.contains('intro-pending')){screen.remove();return;}
 const word=window.PORTFOLIO?.entryWord;if(word){const lettering=document.querySelector('#entry-lettering');lettering.replaceChildren(...[...word].map(char=>{const span=document.createElement('span');span.className='entry-letter';span.textContent=char;span.setAttribute('aria-hidden','true');return span;}));document.querySelector('#enter-portfolio').setAttribute('aria-label',word+'，点击进入作品集');}
 const button=document.querySelector('#enter-portfolio'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const background=[...document.querySelectorAll('body > header, body > main, body > footer, #gallery-stage, .skip-link')];
 background.forEach(el=>el.inert=true);
 let opening=false,raf=0,started=0,finished=false;
 const clamp=n=>Math.max(0,Math.min(1,n));
 function send(n){root.style.setProperty('--entry-progress',n);window.dispatchEvent(new CustomEvent('portfolio-enter-progress',{detail:n}));}
 function finish(){if(finished)return;finished=true;cancelAnimationFrame(raf);send(1);root.classList.remove('intro-pending','intro-opening');screen.remove();background.forEach(el=>el.inert=false);try{sessionStorage.setItem('ray-pan-creativity-entered-v2','1');}catch(e){}document.querySelector('.name-reveal')?.focus({preventScroll:true});}
 function tick(now){
  const t=clamp((now-started)/1100),ease=1-Math.pow(1-t,3),reveal=clamp((t-.16)/.84),phase=1-Math.pow(1-reveal,3);
  send(phase);button.style.transform=`translateY(${-48*ease}px) scale(${1-.12*ease})`;
  button.style.opacity=String(1-clamp(t/.58));screen.style.opacity=String(1-ease);
  if(t<1)raf=requestAnimationFrame(tick);else finish();
 }
 button.addEventListener('click',()=>{if(opening)return;opening=true;button.disabled=true;root.classList.add('intro-opening');if(reduced.matches){finish();return;}started=performance.now();raf=requestAnimationFrame(tick);});
 reduced.addEventListener('change',()=>{if(reduced.matches&&opening)finish();});
 const letters=[...button.querySelectorAll('.entry-letter')];
 function settle(){for(const letter of letters)letter.style.transform='none';}
 screen.addEventListener('pointermove',e=>{if(opening||reduced.matches||e.pointerType==='touch')return;for(const letter of letters){const r=letter.getBoundingClientRect(),dx=r.left+r.width/2-e.clientX,dy=r.top+r.height/2-e.clientY,weight=Math.max(0,1-Math.hypot(dx,dy)/150);letter.style.transform=`translateY(${Math.max(-4,Math.min(4,dy*.045))*weight}px) rotate(${Math.max(-1,Math.min(1,dx*.012))*weight}deg) scale(${1+.018*weight})`;}});
 screen.addEventListener('pointerleave',settle);button.addEventListener('click',settle);
 window.addEventListener('hashchange',()=>{if(location.hash)finish();});
 window.addEventListener('pageshow',e=>{if(e.persisted&&opening)finish();});
})();
