const DATA=window.HONMEN_DATA;
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const KEY='honmen95.v1';
const defaults={wrong:[],bookmarks:[],history:[],seen:[],topicMistakes:{},completedModules:[]};
let store=loadStore();
let session=null,tick=null;
function loadStore(){try{return Object.assign({},defaults,JSON.parse(localStorage.getItem(KEY)||'{}'))}catch(e){return structuredClone(defaults)}}
function save(){localStorage.setItem(KEY,JSON.stringify(store));updateDashboard()}
function itemKey(q){return String(q.id)}
function byId(id){return id<=90?DATA.regular[id-1]:DATA.scenarios.find(x=>x.id===id)}
function showView(id){$$('.view').forEach(v=>v.classList.toggle('active',v.id===id));$$('.navbtn').forEach(b=>b.classList.toggle('active',b.dataset.view===id));$('#bottomnav').classList.toggle('hidden',['quiz','result'].includes(id));window.scrollTo(0,0);if(id==='wrong')renderWrong();if(id==='stats')renderStats();if(id==='learn'){renderCurriculum();renderTopics()}}
function days(){const now=new Date();const exam=new Date('2026-08-12T09:00:00+09:00');return Math.max(0,Math.ceil((exam-now)/86400000))}
function updateDashboard(){renderRoadmap();const best=store.history.length?Math.max(...store.history.map(x=>x.score)):null;$('#daysLeft').textContent=days()?`Còn ${days()} ngày đến kỳ thi`:'Đã đến ngày thi';$('#bestScore').textContent=best==null?'--':best+'/100';$('#bestMeter').style.width=(best||0)+'%';$('#attempts').textContent=store.history.length;$('#bookmarks').textContent=store.bookmarks.length;$('#wrongCountHome').textContent=store.wrong.length;$('#wrongSummary').textContent=`${store.wrong.length} câu sai · ${store.bookmarks.length} câu chưa chắc`;$('#wrongIntro').textContent=store.wrong.length?`${store.wrong.length} câu cần làm lại.`:'Chưa có câu sai.';$('#bookmarkIntro').textContent=store.bookmarks.length?`${store.bookmarks.length} câu đã đánh dấu.`:'Chưa có câu đánh dấu.'}
function shuffled(a){const x=[...a];for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]]}return x}
function startPractice(ids,label='Luyện tập'){if(!ids.length){alert('Chưa có câu nào trong mục này.');return}session={mode:'practice',label,ids:[...ids],index:0,answers:{},locked:{},started:Date.now(),seconds:0};showView('quiz');renderQuestion()}
function startDaily(){const wrong=shuffled(store.wrong),marks=shuffled(store.bookmarks.filter(x=>!wrong.includes(x))),fresh=shuffled(DATA.regular.map(x=>x.id).filter(x=>!store.seen.includes(x)));let ids=[...wrong,...marks,...fresh];if(ids.length<20)ids=[...ids,...shuffled(DATA.regular.map(x=>x.id).filter(x=>!ids.includes(x)))];startPractice(ids.slice(0,20),'Gói học hôm nay')}
function startExam(){if(!confirm('Bắt đầu đề Honmen 01? Bạn có 50 phút và cần đạt ít nhất 95/100.'))return;session={mode:'exam',label:'Đề Honmen 01',ids:[...DATA.regular.map(x=>x.id),...DATA.scenarios.map(x=>x.id)],index:0,answers:{},locked:{},marks:[],started:Date.now(),seconds:3000};showView('quiz');$('#timer').classList.remove('hidden');startTimer();renderQuestion()}
function startTimer(){clearInterval(tick);updateTimer();tick=setInterval(()=>{if(!session||session.mode!=='exam')return;session.seconds--;updateTimer();if(session.seconds<=0){clearInterval(tick);finishExam()}},1000)}
function updateTimer(){const m=Math.floor(session.seconds/60),s=session.seconds%60;$('#timer').textContent=`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`}