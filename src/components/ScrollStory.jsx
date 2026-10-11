import {useEffect,useRef,useState} from 'react';
import {motion,useReducedMotion,useScroll,useSpring,useTransform} from 'motion/react';
import {ArrowDown} from 'lucide-react';
import {Reveal} from './Motion';

export function HeroFlow({children}){
 const ref=useRef(null),reduce=useReducedMotion();
 const {scrollYProgress}=useScroll({target:ref,offset:['start start','end start']});
 const scale=useTransform(scrollYProgress,[0,1],[1,.96]);
 const opacity=useTransform(scrollYProgress,[0,.8,1],[1,.35,.08]);
 return <section ref={ref} id="home" className="container hero-shell"><motion.div className="hero" style={reduce?undefined:{scale,opacity}}>{children}</motion.div></section>;
}

export function Timeline({children}){
 const ref=useRef(null),reduce=useReducedMotion();
 const {scrollYProgress}=useScroll({target:ref,offset:['start 75%','end 60%']});
 const fill=useSpring(scrollYProgress,{stiffness:140,damping:30});
 return <div ref={ref} className="experience-timeline"><div aria-hidden="true" className="timeline-rail"><motion.div className="timeline-fill" style={{scaleY:reduce?1:fill}}/></div><div className="experience-list">{children}</div></div>;
}

export function ProjectStory({children,projects,language,t}){
 const ref=useRef(null),[active,setActive]=useState(0),reduce=useReducedMotion();
 const {scrollYProgress}=useScroll({target:ref,offset:['start 30%','end 70%']});
 const fill=useSpring(scrollYProgress,{stiffness:140,damping:30});
 useEffect(()=>{
  const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting)setActive(Number(entry.target.dataset.index));}},{rootMargin:'-25% 0px -45% 0px',threshold:0});
  ref.current.querySelectorAll('[data-index]').forEach(el=>observer.observe(el));
  return ()=>observer.disconnect();
 },[]);
 return <div ref={ref} className="project-story"><aside className="project-guide"><Reveal><span className="eyebrow">{language==='vi'?'TỪ CẤU HÌNH ĐẾN VẬN HÀNH':'FROM CONFIGURATION TO OPERATIONS'}</span><h2 className="section-title left">{t('Selected')} <strong>{t('Projects')}</strong><span className="project-title-dot">.</span></h2><p>{language==='vi'?'Các dự án về kiến trúc hạ tầng, quy trình triển khai và vận hành.':'Projects covering infrastructure architecture, delivery workflows, and operations.'}</p><nav className="project-index" aria-label={language==='vi'?'Danh sách dự án':'Project index'}>{projects.map((project,i)=><a key={project.image} href={`#project-${i+1}`} aria-current={active===i?'location':undefined}><span>0{i+1}</span><span>{t(project.title).split(' — ')[0]}</span><span className="index-dot"/></a>)}</nav><div className="story-track" aria-hidden="true"><motion.div style={{scaleX:reduce?1:fill}}/></div><div className="story-caption"><span>{String(active+1).padStart(2,'0')} / {String(projects.length).padStart(2,'0')}</span><ArrowDown size={16}/></div></Reveal></aside><div className="projects-list">{children}</div></div>;
}
