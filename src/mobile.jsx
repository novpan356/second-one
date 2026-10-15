import React, { useEffect, useState } from 'react';
import { Users, Swords, BookOpen, Globe, Bookmark, Download, WifiOff } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
export const isNativeApp = Capacitor.isNativePlatform();
export const websiteUrl = 'https://novpan356.github.io/second-one/';
export const apkUrl = `${websiteUrl}downloads/SYM-CREW-Android.apk`;
export const mobileCopy = {
  zh: {nav:'快捷导航',labels:['角色','实验室','剧情','在线','我的'],download:'下载安卓 App',sub:'竖屏优化 · 内置角色资料 · 离线查询',offline:'当前离线：内置资料可查，公共留言和在线服务需联网。',downloadTitle:'把战斗实验室装进口袋',version:'Android 7.0 及以上 · 直装预览版',step:'下载 APK 后打开文件，按手机提示允许本次安装。',signing:'预览包采用调试签名。正式发行前将配置专用签名；签名变更时可能需要先卸载旧版，请先保存本机收藏。',cloud:'公共留言和登录需要联网；本机游客收藏保存在此设备。',web:'继续使用网页版'},
  en: {nav:'Quick navigation',labels:['Fighters','Lab','Story','Online','Saved'],download:'Get Android app',sub:'Portrait layout · Bundled data · Offline lookup',offline:'Offline: bundled data is available. Public comments and online services require a connection.',downloadTitle:'Your pocket fight lab',version:'Android 7.0+ · Direct-install preview',step:'Download the APK, open it and follow your phone’s installation prompts.',signing:'This preview uses a debug signature. A dedicated release signature will be configured before a formal release; changing signatures may require uninstalling the old app. Save device-only favorites first.',cloud:'Public comments and sign-in require internet. Guest favorites stay on this device.',web:'Continue on the website'},
  ja: {nav:'クイックナビ',labels:['キャラ','ラボ','ストーリー','オンライン','保存'],download:'Android アプリ',sub:'縦画面対応 · データ内蔵 · オフライン検索',offline:'オフライン：内蔵データは閲覧できます。公開コメント・オンライン機能は接続が必要です。',downloadTitle:'ポケットにファイトラボを',version:'Android 7.0 以降 · プレビュー版',step:'APK をダウンロードして開き、端末の案内に従ってインストールしてください。',signing:'プレビュー版はデバッグ署名です。正式版は専用署名を設定予定です。署名変更時は旧版のアンインストールが必要な場合があります。端末内の保存情報を先に控えてください。',cloud:'公開コメントとログインには通信が必要です。ゲストのお気に入りはこの端末に保存されます。',web:'ウェブ版を使う'},
};
export function MobileNavigation({route,lang,navigate}) {
  const c = mobileCopy[lang], icons=[Users,Swords,BookOpen,Globe,Bookmark];
  const pages=['home','lab','story','online','account'], hashes=['roster','lab','story','online','account'];
  return <nav className="mobile-dock" aria-label={c.nav}>{pages.map((page,i)=>{
    const active=route.page===page || (i===0 && route.page==='fighter'), Icon=icons[i];
    return <button key={page} onClick={()=>navigate(hashes[i])} aria-current={active?'page':undefined}><Icon size={21}/><span>{c.labels[i]}</span></button>;
  })}</nav>;
}
export function OfflineNotice({lang}) {
  const [offline,setOffline]=useState(!navigator.onLine);
  useEffect(()=>{const sync=()=>setOffline(!navigator.onLine);window.addEventListener('online',sync);window.addEventListener('offline',sync);return()=>{window.removeEventListener('online',sync);window.removeEventListener('offline',sync);};},[]);
  return offline && <div className="offline-notice" role="status"><WifiOff size={17}/>{mobileCopy[lang].offline}</div>;
}
export function AppDownload({lang,full=false,navigate}) {
  if(isNativeApp) return null;
  const c=mobileCopy[lang];
  return <section className={'app-download '+(full?'download-page wrap standalone':'wrap download-strip')}>
    <img src={`${import.meta.env.BASE_URL}app/icon-192.png`} alt="SYM CREW" width="72" height="72"/>
    <div><span className="eyebrow">SYM CREW / ANDROID</span><h2>{full?c.downloadTitle:c.download}</h2><p>{full?c.version:c.sub}</p></div>
    {full?<a className="button dark-button apk-download" href={apkUrl}><Download size={20}/>{c.download} · APK</a>:<button className="button dark-button" onClick={()=>navigate('download')}><Download size={18}/>{c.download}</button>}
    {full && <div className="download-details"><p>{c.step}</p><p>{c.cloud}</p><p>{c.signing}</p><button className="button outline-button" onClick={()=>navigate('roster')}>{c.web}</button></div>}
  </section>;
}
export async function initializeNative() {
  if(!isNativeApp) return;
  document.documentElement.classList.add('native-app');
  const {App}=await import('@capacitor/app');
  await App.addListener('backButton',({canGoBack})=>{
    const dialogs=document.querySelectorAll('[role="dialog"]');
    if(dialogs.length) dialogs[dialogs.length-1].querySelector('.modal-heading button')?.click();
    else if(canGoBack) history.back();
    else if(location.hash && location.hash!=='#roster') location.hash='roster';
    else App.exitApp();
  });
  document.addEventListener('click',async event=>{
    const anchor=event.target.closest('a[href]');
    if(!anchor || event.defaultPrevented) return;
    const url=new URL(anchor.href,location.href);
    if(url.protocol==='https:' && url.origin!==location.origin) {
      event.preventDefault();
      const {Browser}=await import('@capacitor/browser');
      await Browser.open({url:url.href,toolbarColor:'#080d18'});
    }
  });
}
