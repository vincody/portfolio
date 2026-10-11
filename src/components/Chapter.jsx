import {useEffect,useRef,useState} from 'react';
import {motion,useReducedMotion,useScroll,useTransform} from 'motion/react';

export default function Chapter({children,className='',...props}){
 const ref=useRef(null),reduce=useReducedMotion(),[desktop,setDesktop]=useState(false);
 useEffect(()=>{const media=matchMedia('(min-width: 1024px)');const update=()=>setDesktop(media.matches);update();media.addEventListener('change',update);return ()=>media.removeEventListener('change',update);},[]);
 const {scrollYProgress}=useScroll({target:ref,offset:['start 95%','end 12%']});
 // A broad reading plateau keeps long sections fully visible while reading.
 const opacity=useTransform(scrollYProgress,[0,.16,.84,1],[.08,1,1,.08]);
 return <motion.section {...props} ref={ref} className={`chapter ${className}`} style={!reduce&&desktop?{opacity}:undefined}>{children}</motion.section>;
}

export function useActiveChapter(){
 const [active,setActive]=useState('home');
 useEffect(()=>{
  let frame=0;
  const measure=()=>{frame=0;const sections=[...document.querySelectorAll('main > section[id]')];const marker=innerHeight*.45;const current=sections.find(section=>{const box=section.getBoundingClientRect();return box.top<=marker&&box.bottom>marker;});if(current)setActive(current.id);};
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(measure);};
  schedule();addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);
  return ()=>{cancelAnimationFrame(frame);removeEventListener('scroll',schedule);removeEventListener('resize',schedule);};
 },[]);
 return active;
}
