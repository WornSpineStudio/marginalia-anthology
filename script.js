const canvas=document.getElementById('dust');
const ctx=canvas.getContext('2d');
let motes=[],mouse={x:innerWidth/2,y:innerHeight/2};

function resize(){
  canvas.width=innerWidth*devicePixelRatio;
  canvas.height=innerHeight*devicePixelRatio;
  canvas.style.width=innerWidth+'px';
  canvas.style.height=innerHeight+'px';
  ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
  motes=Array.from({length:Math.min(150,Math.floor(innerWidth/8))},()=>({
    x:Math.random()*innerWidth,
    y:Math.random()*innerHeight,
    r:Math.random()*1.5+.25,
    vx:(Math.random()-.5)*.08,
    vy:-Math.random()*.18-.02,
    a:Math.random()*.35+.08
  }));
}
addEventListener('resize',resize);
addEventListener('mousemove',e=>{mouse={x:e.clientX,y:e.clientY}});
function draw(){
  ctx.clearRect(0,0,innerWidth,innerHeight);
  for(const p of motes){
    p.x+=p.vx+(mouse.x-innerWidth/2)*0.00001;
    p.y+=p.vy;
    if(p.y<-5){p.y=innerHeight+5;p.x=Math.random()*innerWidth}
    if(p.x<-5)p.x=innerWidth+5;
    if(p.x>innerWidth+5)p.x=-5;
    ctx.beginPath();
    ctx.fillStyle=`rgba(221,180,123,${p.a})`;
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fill();
  }
  requestAnimationFrame(draw);
}
resize();draw();

document.querySelectorAll('[data-parallax]').forEach(el=>{
  addEventListener('mousemove',e=>{
    const strength=Number(el.dataset.parallax||0.02);
    const x=(e.clientX-innerWidth/2)*strength;
    const y=(e.clientY-innerHeight/2)*strength;
    el.style.transform=`scale(1.05) translate(${x}px,${y}px)`;
  });
});

const obs=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting)entry.target.classList.add('visible')});
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));

document.querySelectorAll('.book-card').forEach(card=>{
  card.addEventListener('mouseenter',()=>{
    document.querySelectorAll('.book-card').forEach(c=>c.classList.remove('active'));
    card.classList.add('active');
  });
  card.addEventListener('click',()=>{
    if(card.dataset.book==='lust') document.querySelector('#my-muse').scrollIntoView({behavior:'smooth'});
  });
});

const thumbs=document.querySelector('.thumbs');
document.querySelectorAll('.gallery-nav').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const dir=Number(btn.dataset.dir);
    const items=[...thumbs.children];
    if(dir>0) thumbs.append(items[0]);
    else thumbs.prepend(items[items.length-1]);
  });
});
