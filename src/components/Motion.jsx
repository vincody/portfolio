import { Children, useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, useSpring } from 'motion/react';
// The hover/tap scale pattern follows Animate UI's Button primitive.
// https://animate-ui.com/docs/primitives/buttons/button
export function AnimatedButton({children,href,className='',...props}) {
 const reduce=useReducedMotion(); const Tag=href?motion.a:motion.button;
 return <Tag href={href} className={`button ${className}`} whileHover={reduce?undefined:{y:-3,scale:1.025}} whileTap={reduce?undefined:{scale:.97}} transition={{type:'spring',stiffness:400,damping:25}} {...props}>{children}</Tag>;
}
export function Reveal({children,className='',delay=0}) {
 const reduce=useReducedMotion();
 return <motion.div className={className} initial={reduce?false:{opacity:0,y:36}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.12,margin:'0px 0px -24px 0px'}} transition={{duration:.8,delay,ease:[.22,1,.36,1]}}>{children}</motion.div>;
}
// Decorative introduction, never intercepts clicks or keyboard focus.
export function PageIntro(){
 const reduce=useReducedMotion();
 if(reduce)return null;
 return <motion.div aria-hidden="true" className="page-intro" initial={{opacity:1}} animate={{opacity:0}} transition={{delay:.15,duration:.65,ease:[.22,1,.36,1]}}><motion.span initial={{opacity:0,y:10}} animate={{opacity:[0,1,0],y:[10,0,-10]}} transition={{duration:.7}} className="intro-mark">p.</motion.span></motion.div>;
}
export function Entrance({children,className=''}){
 const reduce=useReducedMotion();
 return <div className={className}>{Children.map(children,(child,i)=><motion.div initial={reduce?false:{opacity:0,y:22}} animate={{opacity:1,y:0}} transition={{delay:.3+i*.1,duration:.75,ease:[.22,1,.36,1]}}>{child}</motion.div>)}</div>;
}
export function StaggerGrid({children,className=''}){
 const reduce=useReducedMotion();
 return <motion.div className={className} initial={reduce?false:'hidden'} whileInView="visible" viewport={{once:true,amount:.12,margin:'0px 0px -24px 0px'}} variants={{hidden:{},visible:{transition:{staggerChildren:.055}}}}>{Children.map(children,child=><motion.div variants={{hidden:{opacity:0,y:24},visible:{opacity:1,y:0,transition:{duration:.65,ease:[.22,1,.36,1]}}}}>{child}</motion.div>)}</motion.div>;
}
// The stable outer box measures scroll; the inner layer moves without reflow.
export function ScrollFlow({children,className=''}){
 const ref=useRef(null),reduce=useReducedMotion();
 const {scrollYProgress}=useScroll({target:ref,offset:['start end','end start']});
 const travel=useTransform(scrollYProgress,[0,.5,1],[24,0,-24]);
 const y=useSpring(travel,{stiffness:120,damping:30});
 return <div ref={ref} className={className}><motion.div className="flow-layer" style={{y:reduce?0:y}}><Reveal>{children}</Reveal></motion.div></div>;
}
