/* Local colour analysis. Pixels stay in the browser; cross-origin failures use the
   project's configured fallback, never bypass canvas security or upload media. */
(() => {
 const cache=new Map(),images=new Map();
 const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
 const mix=(a,b,t)=>a.map((n,i)=>Math.round(n*(1-t)+b[i]*t));
 const css=a=>`rgb(${a.map(Math.round).join(',')})`;
 const fallback=p=>{const h=(p.color||'#8c9484').replace('#','');return h.length===6?[0,2,4].map(i=>parseInt(h.slice(i,i+2),16)):[140,148,132];};
 function load(url){if(images.has(url))return images.get(url);const promise=new Promise((resolve,reject)=>{const image=new Image();if(/^https?:/.test(url)&&new URL(url,location.href).origin!==location.origin)image.crossOrigin='anonymous';const timer=setTimeout(()=>reject(new Error('Image colour timeout')),4500);image.onload=()=>{clearTimeout(timer);resolve(image)};image.onerror=()=>{clearTimeout(timer);reject(new Error('Image unavailable'))};image.src=url;});images.set(url,promise);return promise;}
 function pixels(source,crop){const canvas=document.createElement('canvas');canvas.width=canvas.height=48;const c=canvas.getContext('2d',{willReadFrequently:true});if(!c)throw new Error('Canvas unavailable');if(crop)c.drawImage(source,...crop,0,0,48,48);else c.drawImage(source,0,0,48,48);return c.getImageData(0,0,48,48).data;}
 function dominant(data){
  const bins=new Map();let total=[0,0,0],count=0,allSum=[0,0,0],allCount=0;
  for(let i=0;i<data.length;i+=4){if(data[i+3]<180)continue;const rgb=[data[i],data[i+1],data[i+2]];rgb.forEach((v,k)=>allSum[k]+=v);allCount++;const max=Math.max(...rgb),min=Math.min(...rgb),l=(max+min)/510,sat=max?1-min/max:0;if(l<.1||l>.94)continue;const key=rgb.map(v=>v>>5).join('-'),weight=.45+sat*.9;const b=bins.get(key)||{sum:[0,0,0],weight:0};rgb.forEach((v,k)=>{b.sum[k]+=v*weight;total[k]+=v});b.weight+=weight;bins.set(key,b);count++;}
  if(allCount&&count<allCount*.08)return allSum.map(v=>Math.round(v/allCount));if(!count)throw new Error('No visible palette');const sorted=[...bins.values()].sort((a,b)=>b.weight-a.weight);return sorted[0].sum.map(v=>Math.round(v/sorted[0].weight));
 }
 function hsl(rgb){const [r,g,b]=rgb.map(v=>v/255),max=Math.max(r,g,b),min=Math.min(r,g,b),d=max-min,l=(max+min)/2;let h=0,s=0;if(d){s=d/(1-Math.abs(2*l-1));h=max===r?((g-b)/d)%6:max===g?(b-r)/d+2:(r-g)/d+4;h*=60;if(h<0)h+=360;}return[h,s,l];}
 function fromHsl(h,s,l){const c=(1-Math.abs(2*l-1))*s,x=c*(1-Math.abs((h/60)%2-1)),m=l-c/2;const a=h<60?[c,x,0]:h<120?[x,c,0]:h<180?[0,c,x]:h<240?[0,x,c]:h<300?[x,0,c]:[c,0,x];return a.map(v=>Math.round((v+m)*255));}
 function theme(rgb,source){const [h,s]=hsl(rgb),paper=[245,244,240],main=mix(paper,rgb,.22),soft=mix(paper,rgb,.065),near=mix(paper,fromHsl((h+24)%360,clamp(s,.12,.55),.7),.23);return{dominant:rgb,main,soft,near,source,background:`radial-gradient(ellipse at 86% 42%, ${css(main)} 0%, transparent 66%),linear-gradient(135deg,${css(soft)},${css(near)})`};}
 async function project(p,profile){if(cache.has(p.id))return cache.get(p.id);const promise=(async()=>{try{const image=await load(p.cover||profile.atlas);const crop=p.cover?null:[p.cell[0]*image.naturalWidth/3,p.cell[1]*image.naturalHeight/2,image.naturalWidth/3,image.naturalHeight/2];return theme(dominant(pixels(image,crop)),'image-pixels');}catch{return theme(fallback(p),'configured-fallback');}})();cache.set(p.id,promise);return promise;}
 function video(element){try{if(element.readyState<2)throw new Error('No frame');return theme(dominant(pixels(element)),'video-frame');}catch{return null;}}
 function luminance(rgb){const v=rgb.map(c=>{c/=255;return c<=.04045?c/12.92:((c+.055)/1.055)**2.4});return v[0]*.2126+v[1]*.7152+v[2]*.0722;}
 window.PortfolioColor={project,video,theme,dominant,luminance,fallback,cache};
})();
