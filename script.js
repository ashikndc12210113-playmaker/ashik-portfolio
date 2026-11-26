const DEFAULT_CONTENT = {
  site:{name:"Md. Ashikuzzaman",title:"B.Sc. Candidate · EEE · JSTU",bio:"Aspiring Electrical and Electronic Engineering student passionate about technology, innovation, and problem-solving. Interested in electronics, power systems, and embedded technologies, with a focus on developing practical engineering solutions and continuously expanding technical expertise.",email:"ashikndc12210113@gmail.com",phone:"+8801905964481",location:"Jamalpur, Mymensingh, Bangladesh",photo:"assets/profile-placeholder.svg",heroBackground:""},
  sections:[
    {id:"about",title:"About Me",visible:true,items:[{title:"Engineering mindset",description:"I am an aspiring Electrical and Electronic Engineering student interested in electronics, power systems, embedded technologies, and practical engineering solutions."}]},
    {id:"education",title:"Education",visible:true,items:[
      {title:"B.Sc. in Electrical and Electronic Engineering",subtitle:"Jamalpur Science and Technology University (JSTU)",description:"4th Year, 1st Semester · Currently running"},
      {title:"Higher Secondary Certificate (HSC)",subtitle:"Notre Dame College, Dhaka · 2022",description:"GPA 5.00"},
      {title:"Secondary School Certificate (SSC)",subtitle:"Kushtia Zilla School · 2020",description:"GPA 5.00"}
    ]},
    {id:"experience",title:"Experience & Leadership",visible:true,items:[
      {title:"Private Tutor",subtitle:"Mathematics, Science, Chemistry, English, Bangla and ICT",description:"Teaching experience through private tutoring."},
      {title:"Mentor",subtitle:"KZS Debating Society",description:"Mentoring and supporting student debaters."},
      {title:"Program Organizer",subtitle:"Kushtia Zilla School",description:"Helped organize art, music and debate competitions."},
      {title:"Club Activities",subtitle:"School and University",description:"Volunteer in school Mathematics, Science and Debating Clubs; involved with university Robotics, Debating and Cultural Clubs."}
    ]},
    {id:"projects",title:"Projects",visible:true,items:[
      {title:"Single-Axis Sun Tracking Solar Panel",description:"A solar panel project designed to track the sun along one axis.",status:"Status not specified",image:""},
      {title:"Single-Phase Step-Down Transformer (100W)",description:"A 100W single-phase step-down transformer project.",status:"Status not specified",image:""},
      {title:"High-Power Phased-Array Sonar with Tunable Discrete Receiver for M-Mode Acoustic Imaging",description:"Primary stage completed; advanced stage ongoing.",status:"Advanced stage ongoing",image:""},
      {title:"Smart Load Management and Demand Response System",description:"An intelligent load management and demand response project.",status:"Status not specified",image:""}
    ]},
    {id:"skills",title:"Technical Skills",visible:true,items:[
      {title:"Programming",description:"C · C++ · Python"},
      {title:"Web",description:"HTML"},
      {title:"Engineering Software",description:"MATLAB · Simulink · AutoCAD"},
      {title:"Hardware & Development",description:"Arduino IDE"}
    ]},
    {id:"certificates",title:"Certificates & Achievements",visible:true,items:[
      {title:"SSC Certificate"},{title:"HSC Certificate"},{title:"Debate Competition Certificate"},{title:"Essay Writing Competition Certificate"},{title:"Drawing Competition Certificate"},{title:"Singing Competition Certificate"}
    ]},
    {id:"hobbies",title:"Interests",visible:true,items:[
      {title:"Reading",description:"Story books and novels"},{title:"Entertainment",description:"Watching movies and playing video games"},{title:"Sports",description:"Indoor and outdoor games"},{title:"Exploration",description:"Travelling and exploring new cuisines"}
    ]},
    {id:"contact",title:"Contact",visible:true,items:[]}
  ],
  socials:{facebook:"https://www.facebook.com/share/1XEwha1N6o/",github:"https://github.com/ashikndc12210113-playmaker",instagram:"https://www.instagram.com/its_amar_ami_?knvt=bnFueWx1a2l4aGlh"}
};
const esc = v => String(v ?? "").replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function safeUrl(value){try{const u=new URL(value,location.href);return ["http:","https:","mailto:"].includes(u.protocol)?u.href:"#"}catch{return "#"}}
function fallbackImage(img){img.onerror=null;img.src="assets/profile-placeholder.svg"}
function render(data){
  const s=data.site||DEFAULT_CONTENT.site;
  document.title=`${s.name||"Portfolio"} | EEE Portfolio`;
  document.getElementById("brandName").textContent=(s.name||"MA.").split(" ").map(x=>x[0]).join("").slice(0,3)+".";
  document.querySelector(".hero h1").textContent=s.name||"";
  document.querySelector(".hero h2").textContent=s.title||"";
  document.querySelector(".hero-copy>p:not(.eyebrow)").textContent=s.bio||"";
  document.getElementById("profilePhoto").src=s.photo||"assets/profile-placeholder.svg";
  document.getElementById("profilePhoto").onerror=()=>fallbackImage(document.getElementById("profilePhoto"));
  if(s.heroBackground){document.querySelector(".hero").style.background=s.heroBackground}
  const sections=(data.sections||[]).filter(x=>x.visible!==false);
  const nav=document.getElementById("mainNav");nav.innerHTML=sections.map(x=>`<a href="#${esc(x.id)}">${esc(x.title)}</a>`).join("");
  document.getElementById("dynamicSections").innerHTML=sections.map(section=>{
    if(section.id==="contact"){
      const links=[["Email",`mailto:${s.email||""}`],["Phone",`tel:${s.phone||""}`],...Object.entries(data.socials||{}).map(([k,v])=>[k,v])].filter(x=>x[1]&&x[1]!=="#");
      return `<section class="section" id="${esc(section.id)}"><div class="section-head"><span class="section-kicker">LET'S CONNECT</span><h2>${esc(section.title)}</h2><p class="section-intro">${esc(s.location||"")}</p></div><div class="contact-links">${links.map(([k,v])=>`<a href="${safeUrl(v)}" target="_blank" rel="noopener noreferrer">${esc(k)}</a>`).join("")}</div></section>`;
    }
    const items=section.items||[];
    return `<section class="section" id="${esc(section.id)}"><div class="section-head"><span class="section-kicker">PORTFOLIO</span><h2>${esc(section.title)}</h2></div><div class="${section.id==="experience"?"timeline":"grid"}">${items.map(item=>`<article class="card">${item.image?`<img src="${safeUrl(item.image)}" alt="${esc(item.title||"Project image")}" onerror="this.style.display='none'">`:""}<h3>${esc(item.title||"")}</h3>${item.subtitle?`<p><strong>${esc(item.subtitle)}</strong></p>`:""}${item.description?`<p>${esc(item.description)}</p>`:""}${item.status?`<span class="tag">${esc(item.status)}</span>`:""}</article>`).join("")}</div></section>`;
  }).join("");
  document.getElementById("year").textContent=new Date().getFullYear();
}
async function loadContent(){
  const cfg=window.PORTFOLIO_CONFIG||{};
  if(!cfg.supabaseUrl||cfg.supabaseUrl.includes("YOUR-PROJECT")||!window.supabase){render(DEFAULT_CONTENT);return}
  try{
    const client=window.supabase.createClient(cfg.supabaseUrl,cfg.supabaseAnonKey);
    const {data,error}=await client.from("portfolio").select("content").limit(1).maybeSingle();
    if(error||!data?.content){render(DEFAULT_CONTENT);return}
    render(data.content);
  }catch(e){console.warn("Portfolio content could not be loaded:",e);render(DEFAULT_CONTENT)}
}
document.getElementById("themeToggle").addEventListener("click",()=>{document.body.classList.toggle("dark");document.getElementById("themeToggle").textContent=document.body.classList.contains("dark")?"☀":"☾"});
document.getElementById("menuToggle").addEventListener("click",()=>document.getElementById("mainNav").classList.toggle("open"));
document.addEventListener("click",e=>{if(e.target.matches("#mainNav a"))document.getElementById("mainNav").classList.remove("open")});
loadContent();
