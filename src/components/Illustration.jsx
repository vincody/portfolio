import {useEffect,useRef,useState} from 'react';
import {motion,useReducedMotion,useMotionValue,useSpring,useScroll,useTransform,useInView} from 'motion/react';
import {translate} from '../i18n';
export default function Illustration({portrait=false,language='en'}) {
 const ref=useRef(null),reduce=useReducedMotion();
 const inView=useInView(ref,{amount:.15}),[pageVisible,setPageVisible]=useState(()=>!document.hidden),[blinking,setBlinking]=useState(false);
 const idle=inView&&pageVisible&&!reduce;
 useEffect(()=>{const update=()=>setPageVisible(!document.hidden);document.addEventListener('visibilitychange',update);return()=>document.removeEventListener('visibilitychange',update);},[]);
 useEffect(()=>{
  if(!idle){setBlinking(false);return;}
  let timer;
  const next=()=>{timer=setTimeout(()=>{setBlinking(true);timer=setTimeout(()=>{setBlinking(false);next();},140);},4000+Math.random()*3000);};
  next();return()=>clearTimeout(timer);
 },[idle]);
 const rx=useMotionValue(0),ry=useMotionValue(0);
 const rotateX=useSpring(rx,{stiffness:180,damping:24}),rotateY=useSpring(ry,{stiffness:180,damping:24});
 const {scrollYProgress}=useScroll({target:ref,offset:['start end','end start']});
 const scrollY=useTransform(scrollYProgress,[0,.5,1],[12,0,-12]);
 const y=useSpring(scrollY,{stiffness:100,damping:30});
 function reset(){rx.set(0);ry.set(0);}
 function move(e){if(reduce||e.pointerType!=='mouse'||!matchMedia('(hover: hover) and (pointer: fine)').matches)return;const b=e.currentTarget.getBoundingClientRect();rx.set(Math.max(-2,Math.min(2,((e.clientY-b.top)/b.height-.5)*-4)));ry.set(Math.max(-3,Math.min(3,((e.clientX-b.left)/b.width-.5)*6)));}
 const appear=(delay=0)=>({initial:reduce?false:{opacity:0,y:12},whileInView:{opacity:1,y:0},viewport:{once:true,amount:.2},transition:{duration:.85,delay,ease:[.22,1,.36,1]}});
 return <div ref={ref} className="character-scene" data-idle={idle?'active':'paused'} onPointerMove={move} onPointerLeave={reset} onPointerCancel={reset}><motion.div className="character-motion" style={{y:reduce?0:y,rotateX:reduce?0:rotateX,rotateY:reduce?0:rotateY}}><svg viewBox="0 0 620 490" role="img" aria-label={translate(portrait?'Illustration of a creative developer':'Illustration of a developer working on a laptop',language)} className="illustration">
 <g fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
 <motion.path initial={reduce?false:{pathLength:0,opacity:0}} whileInView={{pathLength:1,opacity:1}} viewport={{once:true}} transition={{duration:1,delay:.2}} stroke="#dedede" d="M42 418H580M465 85h52m-26-26v52M74 148h25m-12-12v25"/>
 {portrait&&<rect x="85" y="30" width="445" height="395" rx="8"/>}
 <motion.g className="character-body" {...appear(.1)}><g className="character-idle-body"><path fill="#0c0c0c" d="M242 217c-52 16-81 64-101 122l56 47 230-9 42-50c-23-78-58-107-98-114z"/>
 <path fill="white" d="M267 172l-5 59 45 40 48-48-17-65z"/>
 <path fill="white" d="M245 99c-13 66 5 113 48 121 42 7 68-34 65-91l-26-47z"/>
 <path fill="#0c0c0c" d="M241 132c-25-24-4-72 24-75 16-29 47-23 62-6 48-5 50 42 27 69-12-6-19-23-23-36-18 20-49 28-68 16l-6 40z"/>
 <g className={`character-eyes${blinking?' is-blinking':''}`} fill="currentColor" stroke="none"><ellipse cx="283.5" cy="138" rx="2.5" ry="2.4"/><ellipse cx="324.5" cy="136" rx="2.5" ry="2.4"/></g>
 <path d="M305 143l-3 22 10 2m-27 15q17 13 31-2"/>
 <path stroke="white" d="M226 246l-30 105m171-108 33 102m-168-64 28 11m105-23 36 16m-32 9 37 14"/>
 {portrait?<><path fill="white" d="M187 315q68-31 151 15l-4 26q-75-27-135 15z"/><path fill="white" d="M394 311q-49 33-133 45l-8-24q75-32 106-50z"/><path d="M302 330l32 10m-47-8 27 11"/><path fill="#0c0c0c" d="M145 341q2 62 85 91l172-20q61-10 40-76l-65 7-56 39-103-34z"/></>:<><path fill="white" d="M193 332q-79 22-65 66 8 32 107 24l99-9-21-65z"/><path fill="white" d="M358 329q115-8 126 56 8 53-142 37l-40-15 22-63z"/><path d="M239 350q-7 30 23 66m110-62q38 23 8 70"/><g className="character-hand character-hand-left"><path fill="white" d="M195 275l80 39-15 26-92-34z"/></g><g className="character-hand character-hand-right"><path fill="white" d="M404 284l-91 27 1 23 96-12z"/></g><motion.g className="character-laptop" {...appear(.35)}><path fill="#111" d="M99 235h161l47 108H142z"/><path fill="white" d="M146 248h101l34 78H177z"/><path fill="#111" d="M141 343h205v10H145z"/><circle cx="211" cy="289" r="8" fill="#111"/></motion.g></>}
 </g></motion.g><motion.path initial={reduce?false:{pathLength:0}} whileInView={{pathLength:1}} viewport={{once:true}} transition={{duration:.9,delay:.35}} d="M102 418h412"/><path stroke="#aaa" d="M447 172l18-12 18 12-18 12zM91 222l-13 9 13 9"/>
 </g></svg></motion.div></div>;
}
