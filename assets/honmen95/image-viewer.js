(()=>{
 const css=`
 .sourceimg,.scenarioimg,#lessonPanel img[data-study-image],#lessonPanel img{cursor:zoom-in;transition:transform .15s ease;image-rendering:auto}
 .sourceimg:active,.scenarioimg:active,#lessonPanel img:active{transform:scale(.99)}
 .imageZoomHint{text-align:center;margin:7px 0 0;color:#826f51;font-size:13px;font-weight:850}
 .imageViewer{position:fixed;inset:0;z-index:9999;background:rgba(35,27,16,.96);display:none;align-items:center;justify-content:center;padding:12px}
 .imageViewer.show{display:flex}
 .imageViewer img{display:block;max-width:98vw;max-height:92dvh;width:auto;height:auto;object-fit:contain;background:#fff;border-radius:12px;box-shadow:0 18px 60px #0008}
 .imageViewer button{position:fixed;right:14px;top:14px;width:46px;height:46px;border:0;border-radius:50%;background:#fff;color:#45361f;font-size:28px;font-weight:900;box-shadow:0 4px 16px #0005}
 `;
 const style=document.createElement('style');style.textContent=css;document.head.appendChild(style);
 const viewer=document.createElement('div');viewer.className='imageViewer';viewer.innerHTML='<button aria-label="Đóng ảnh">×</button><img alt="Ảnh phóng to">';document.body.appendChild(viewer);
 const close=()=>viewer.classList.remove('show');
 const prepare=()=>{
   document.querySelectorAll('img').forEach(img=>{
     const src=img.getAttribute('src');
     if(!src||src==='undefined'){
       const box=img.closest('#lessonPanel > div, .sourceImageBox');
       if(box) box.remove(); else img.remove();
       return;
     }
     if(img.matches('.sourceimg,.scenarioimg,#lessonPanel img')&&!img.dataset.zoomReady){
       img.dataset.zoomReady='1';
       img.setAttribute('loading','eager');
       img.setAttribute('decoding','async');
       const hint=document.createElement('div');hint.className='imageZoomHint';hint.textContent='🔍 Chạm vào ảnh để xem toàn màn hình';img.insertAdjacentElement('afterend',hint);
     }
   });
 };
 new MutationObserver(prepare).observe(document.body,{childList:true,subtree:true});
 prepare();
 document.addEventListener('click',e=>{
   const img=e.target.closest('.sourceimg,.scenarioimg,#lessonPanel img');
   if(img){viewer.querySelector('img').src=img.currentSrc||img.src;viewer.classList.add('show');return}
   if(e.target===viewer||e.target===viewer.querySelector('button'))close();
 });
 document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
})();
