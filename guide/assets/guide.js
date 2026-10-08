(function(){
  // Overview vs full: slides with data-hidden are skipped unless the guide is opened with ?full=1
  const FULL=document.documentElement.classList.contains('full');
  if(FULL) document.querySelectorAll('[data-part-full]').forEach(e=>{e.dataset.part=e.dataset.partFull;});
  const S=[...document.querySelectorAll('section.s')].filter(s=>FULL||!s.hasAttribute('data-hidden'));
  const total=S.length, pad=n=>String(n).padStart(2,'0');
  // footers
  S.forEach((s,i)=>{
    if(s.dataset.noft!==undefined) return;
    const f=s.querySelector('.f'); if(!f) return;
    const d=document.createElement('div'); d.className='ft';
    d.innerHTML='<span>Harrington · '+(s.dataset.part||'Brand guide proposal')+'</span><span>Hvesmar Studio · '+pad(i+1)+' / '+pad(total)+'</span>';
    f.appendChild(d);
  });
  // pseudo QR codes (decorative)
  document.querySelectorAll('.qr').forEach((q,k)=>{
    let seed=(q.dataset.seed|0)||7+k; const r=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
    let h='';
    for(let y=0;y<21;y++)for(let x=0;x<21;x++){
      const fin=(a,b)=>x>=a&&x<a+7&&y>=b&&y<b+7;
      let on;
      const F=[[0,0],[14,0],[0,14]].find(([a,b])=>fin(a,b));
      if(F){const lx=x-F[0],ly=y-F[1];on=(lx==0||ly==0||lx==6||ly==6)||(lx>=2&&lx<=4&&ly>=2&&ly<=4);}
      else on=r()>.52;
      h+='<i class="'+(on?'':'o')+'"></i>';
    }
    q.innerHTML=h;
  });
  // TOC
  const toc=document.getElementById('toc'), list=document.getElementById('toclist');
  if(list){let cur=null,h='';
    S.forEach((s,i)=>{const p=s.dataset.part||'Intro';if(p!==cur){h+='<h4>'+p+'</h4>';cur=p;}
      h+='<a href="#s'+(i+1)+'" data-i="'+i+'"><i>'+pad(i+1)+'</i><span>'+(s.dataset.title||'')+'</span></a>';});
    list.innerHTML=h;
    list.addEventListener('click',e=>{const a=e.target.closest('a');if(a){toc.classList.remove('open');}});
  }
  S.forEach((s,i)=>{ if(!s.id) s.id='s'+(i+1); else { const a=document.createElement('a'); a.id='s'+(i+1); s.prepend(a);} });
  // Part links (top bar + contents cards) jump to the first visible slide of their part
  document.querySelectorAll('a[data-part]').forEach(a=>{const t=S.find(s=>s.dataset.part===a.dataset.part); if(t) a.setAttribute('href','#'+t.id);});
  // Overview: contents cards list the visible slides of each part with their numbers
  if(!FULL) document.querySelectorAll('ul[data-toc-part]').forEach(ul=>{
    const items=S.map((s,i)=>[s,i]).filter(([s])=>s.dataset.part===ul.dataset.tocPart&&!/^part\d/.test(s.id)&&s.dataset.noft===undefined);
    ul.classList.add('toc-gen');
    ul.innerHTML=items.map(([s,i])=>'<li><span class="toc-n">'+pad(i+1)+'</span>'+s.dataset.title.replace(/&/g,'&amp;')+'</li>').join('');
  });
  const btn=document.getElementById('tocbtn');
  if(btn){btn.onclick=()=>toc.classList.toggle('open'); toc.addEventListener('click',e=>{if(e.target===toc||e.target.classList.contains('x'))toc.classList.remove('open')});}
  // current tracking
  const count=document.getElementById('count'), prog=document.getElementById('progress');
  const partLinks=[...document.querySelectorAll('.nav .parts a')];
  let idx=0;
  function current(){const y=window.scrollY+window.innerHeight*0.4;let k=0;S.forEach((s,i)=>{if(s.offsetTop<=y)k=i});return k;}
  function update(){idx=current();if(count)count.textContent=pad(idx+1)+' / '+pad(total);
    if(prog)prog.style.width=((idx)/(total-1)*100)+'%';
    const p=S[idx].dataset.part||'';partLinks.forEach(a=>a.classList.toggle('on',p&&p===a.dataset.part));}
  window.addEventListener('scroll',()=>requestAnimationFrame(update),{passive:true});update();
  function go(i){i=Math.max(0,Math.min(total-1,i));S[i].scrollIntoView({behavior:'smooth',block:'start'});}
  document.addEventListener('keydown',e=>{
    if(e.target.closest&&e.target.closest('input,textarea'))return;
    if(e.key==='Escape'){toc&&toc.classList.remove('open');return;}
    if(toc&&toc.classList.contains('open'))return;
    const n=['ArrowDown','ArrowRight','PageDown',' '], p=['ArrowUp','ArrowLeft','PageUp'];
    if(n.includes(e.key)&&!e.shiftKey){e.preventDefault();go(current()+1);}
    else if(p.includes(e.key)||(e.key===' '&&e.shiftKey)){e.preventDefault();go(current()-1);}
    else if(e.key==='Home'){e.preventDefault();go(0);} else if(e.key==='End'){e.preventDefault();go(total-1);}
    else if(e.key==='c'||e.key==='C'){toc&&toc.classList.toggle('open');}
  });
})();
