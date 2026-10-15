import sharp from 'sharp';
import {mkdir,writeFile} from 'node:fs/promises';
const source = new URL('../assets/branding/sym-crew-source.png',import.meta.url);
const publicDir = new URL('../public/app/',import.meta.url);
await mkdir(publicDir,{recursive:true});
for(const size of [192,512]) await sharp(source.pathname).resize(size,size).png().toFile(new URL(`icon-${size}.png`,publicDir).pathname);
for(const [density,size,foreground] of [['mdpi',48,108],['hdpi',72,162],['xhdpi',96,216],['xxhdpi',144,324],['xxxhdpi',192,432]]) {
 const directory = new URL(`../android/app/src/main/res/mipmap-${density}/`,import.meta.url);
 await mkdir(directory,{recursive:true});
 const art=await sharp(source.pathname).resize(size,size).png().toBuffer();
 for(const name of ['ic_launcher.png','ic_launcher_round.png']) await writeFile(new URL(name,directory),art);
 // Android adaptive icons clip the outer foreground; keep all artwork in its safe area.
 const safe = Math.round(foreground*0.62);
 const logo=await sharp(source.pathname).resize(safe,safe).png().toBuffer();
 await sharp({create:{width:foreground,height:foreground,channels:4,background:'#080d18'}}).composite([{input:logo,gravity:'center'}]).png().toFile(new URL('ic_launcher_foreground.png',directory).pathname);
}
console.log('Generated web, legacy and adaptive Android icons.');
