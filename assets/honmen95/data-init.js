window.HONMEN_IMAGES=window.HONMEN_IMAGES||{};
// Không dùng các ảnh JPEG thử bị nén mờ nữa.
window.HONMEN_DATA={regular:window.HONMEN_REGULAR||[],scenarios:window.HONMEN_SCENARIOS||[],images:window.HONMEN_IMAGES};
[
  'assets/honmen95/images-s91-hq.js',
  'assets/honmen95/image-viewer.js'
].forEach(src=>{
  const s=document.createElement('script');
  s.src=src+'?v=20260804-2';
  s.async=false;
  document.head.appendChild(s);
});
