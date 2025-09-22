
// Smooth scroll (Lenis)
const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1.1 });
function raf(t){ lenis.raf(t); requestAnimationFrame(raf) } requestAnimationFrame(raf);

// GSAP + ScrollTrigger setup
gsap.registerPlugin(ScrollTrigger);

// Enhanced Magnetic button with better performance
document.querySelectorAll('.btn').forEach((btn)=>{
  const strength = 28;
  let isHovering = false;
  
  btn.addEventListener('mousemove',(e)=>{
    if (!isHovering) return;
    const r = btn.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width/2);
    const y = e.clientY - (r.top + r.height/2);
    btn.style.transform = `translate(${x/8}px, ${y/8}px) scale(1.05)`;
  });
  
  btn.addEventListener('mouseenter',()=>{
    isHovering = true;
  });
  
  btn.addEventListener('mouseleave',()=>{
    isHovering = false;
    btn.style.transform = `translate(0,0) scale(1)`;
  });
});

// Add click ripple effect to buttons
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    this.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  });
});

// SplitText (basic, free alternative)
function splitLinesWords(el){
  const text = el.textContent.trim();
  el.textContent = '';
  const words = text.split(' ');
  words.forEach((w,i)=>{
    const ws = document.createElement('span');
    ws.className = 'word';
    ws.style.display = 'inline-block';
    ws.style.whiteSpace = 'pre';
    ws.textContent = (i? ' ':'') + w;
    el.appendChild(ws);
  });
  return el.querySelectorAll('.word');
}
function splitChars(el){
  const html = el.innerHTML;
  el.innerHTML = '';
  
  // Split by <br> tags first
  const parts = html.split('<br>');
  
  parts.forEach((part, partIndex) => {
    if(partIndex > 0) {
      // Add line break
      const br = document.createElement('br');
      el.appendChild(br);
    }
    
    // Split each part into characters
    part.split('').forEach(ch => {
      const c = document.createElement('span');
      c.className = 'char';
      c.style.display = 'inline-block';
      c.style.willChange = 'transform, opacity';
      c.textContent = ch;
      // Preserve spaces by adding proper spacing
      if(ch === ' '){
        c.style.width = '0.25em';
        c.style.display = 'inline';
      }
      el.appendChild(c);
    });
  });
  
  return el.querySelectorAll('.char');
}

// Hero animations
const h1 = document.querySelector('.h1');
const sub = document.querySelector('.sub');
const chars = splitChars(h1);
const words = splitLinesWords(sub);

// Hero animations - matching section heading style
gsap.set([chars, words], {opacity:0, y:28});
const tl = gsap.timeline({defaults:{duration:.7, ease:'power3.out'}});

tl.to(chars, {
  opacity:1, 
  y:0, 
  stagger:.06
}, 0)
  .to(words, {
    opacity:1, 
    y:0, 
    stagger:.06
  }, 0.3)
  .from('.hero-cta .btn', {
    y:20, 
    opacity:0, 
    stagger:.08
  }, 0.8);

// Scroll-triggered reveals
document.querySelectorAll('.reveal-up').forEach((el)=>{
  gsap.from(el, {
    y:30, opacity:0, duration:.8, ease:'power2.out',
    scrollTrigger:{ trigger:el, start:'top 85%' }
  });
});

// Section headings split lines
document.querySelectorAll('.sec-heading').forEach((el)=>{
  const w = splitLinesWords(el);
  gsap.set(w, {y:28, opacity:0});
  gsap.to(w, {y:0, opacity:1, stagger:.06, duration:.7, ease:'power3.out',
    scrollTrigger:{trigger:el, start:'top 80%'}
  });
});

// Program pills float-in
gsap.utils.toArray('.pill').forEach((el,i)=>{
  gsap.from(el, {y:24, opacity:0, duration:.6, delay: i*0.02,
    scrollTrigger:{trigger:el, start:'top 90%'}});
});

// Gallery subtle Ken Burns
document.querySelectorAll('.gallery .g img').forEach((img)=>{
  gsap.to(img, {scale:1.08, duration:12, ease:'none', repeat:-1, yoyo:true});
});

// Marquee hover speed control
const mq = document.querySelector('.marquee');
let marqSpeed = 1;
let marqX = 0;
function loop(){
  marqX -= marqSpeed;
  mq.style.transform = `translateX(${marqX}px)`;
  if(Math.abs(marqX) > mq.scrollWidth/2){ marqX = 0 }
  requestAnimationFrame(loop);
}
mq.addEventListener('mouseenter', ()=> marqSpeed = 0.2);
mq.addEventListener('mouseleave', ()=> marqSpeed = 1);
loop();

// Background Canvas Particles
const canvas = document.querySelector('#bgCanvas');
const ctx = canvas.getContext('2d');
let w, h, dpr;
const particles = [];
const COUNT = 80;
function resize(){
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  w = canvas.width = innerWidth * dpr;
  h = canvas.height = innerHeight * dpr;
  canvas.style.width = innerWidth + 'px';
  canvas.style.height = innerHeight + 'px';
}
window.addEventListener('resize', resize);
resize();
for(let i=0;i<COUNT;i++){
  particles.push({
    x: Math.random()*w, y: Math.random()*h,
    vx: (Math.random()-.5)*0.4, vy: (Math.random()-.5)*0.4,
    r: Math.random()*1.8+0.6
  });
}
let mouse = {x:w/2, y:h/2};
window.addEventListener('mousemove', e=>{
  const r = canvas.getBoundingClientRect();
  mouse.x = (e.clientX - r.left) * dpr;
  mouse.y = (e.clientY - r.top) * dpr;
});
function step(){
  ctx.clearRect(0,0,w,h);
  // glow
  const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 600*dpr);
  grad.addColorStop(0, 'rgba(242,210,75,0.15)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad; ctx.fillRect(0,0,w,h);

  particles.forEach(p=>{
    p.x += p.vx; p.y += p.vy;
    if(p.x<0||p.x>w) p.vx*=-1;
    if(p.y<0||p.y>h) p.vy*=-1;
    // mouse repulsion
    const dx = p.x - mouse.x, dy = p.y - mouse.y, dist = Math.hypot(dx,dy);
    if(dist<120*dpr){ p.vx += dx/dist*0.05; p.vy += dy/dist*0.05; }
  });
  // draw links
  for(let i=0;i<particles.length;i++){
    for(let j=i+1;j<particles.length;j++){
      const a = particles[i], b = particles[j];
      const dx = a.x-b.x, dy=a.y-b.y; const d = Math.hypot(dx,dy);
      if(d < 120*dpr){
        const alpha = 1 - d/(120*dpr);
        ctx.strokeStyle = `rgba(201,205,211,${alpha*0.25})`;
        ctx.lineWidth = .8*dpr;
        ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
      }
    }
  }
  // draw particles
  particles.forEach(p=>{
    ctx.fillStyle = 'rgba(255,255,255,.8)';
    ctx.beginPath(); ctx.arc(p.x,p.y,p.r*dpr,0,Math.PI*2); ctx.fill();
  });
  requestAnimationFrame(step);
}
step();
