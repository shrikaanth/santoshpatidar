
gsap.registerPlugin(ScrollTrigger);

document.querySelectorAll('.reveal-up').forEach(el=>{
  gsap.from(el,{y:30,opacity:0,duration:.8,ease:'power2.out',
    scrollTrigger:{trigger:el,start:'top 85%'}})
});

document.querySelectorAll('.sec-heading').forEach(el=>{
  gsap.from(el,{y:40,opacity:0,duration:.7,ease:'power3.out',
    scrollTrigger:{trigger:el,start:'top 80%'}})
});

document.querySelectorAll('.pill').forEach((el,i)=>{
  gsap.from(el,{y:20,opacity:0,duration:.6,delay:i*0.05,
    scrollTrigger:{trigger:el,start:'top 90%'}})
});
