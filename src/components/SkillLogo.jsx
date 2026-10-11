import {Terminal,Workflow} from 'lucide-react';
const logos={AWS:'amazonwebservices',Azure:'azure',Docker:'docker',Kubernetes:'kubernetes',Terraform:'terraform',Git:'git',Prometheus:'prometheus',Grafana:'grafana'};
export default function SkillLogo({name}){
 const logo=logos[name];
 if(logo)return <span className="skill-logo"><img src={`/assets/brands/${logo}.svg`} alt="" aria-hidden="true" width="40" height="40"/></span>;
 const Icon=name==='CI/CD'?Workflow:Terminal;
 return <span className="skill-logo" aria-hidden="true"><Icon size={35} strokeWidth={1.7}/></span>;
}
