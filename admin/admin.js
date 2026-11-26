const cfg=window.PORTFOLIO_CONFIG||{};
let client=null,user=null,content=null,dirty=false;
const $=id=>document.getElementById(id);
const DEFAULTS={
 site:{name:"Md. Ashikuzzaman",title:"B.Sc. Candidate · EEE · JSTU",bio:"Aspiring Electrical and Electronic Engineering student passionate about technology, innovation, and problem-solving.",email:"ashikndc12210113@gmail.com",phone:"+8801905964481",location:"Jamalpur, Mymensingh, Bangladesh",photo:"../assets/profile-placeholder.svg"},
 sections:[],socials:{facebook:"https://www.facebook.com/share/1XEwha1N6o/",github:"https://github.com/ashikndc12210113-playmaker",instagram:"https://www.instagram.com/its_amar_ami_?knvt=bnFueWx1a2l4aGlh"}
};
function setDirty(){dirty=true;$("saveStatus").textContent="Unsaved changes"}
function message(el,msg){$(el).textContent=msg}
function safeFileName(name){return name.replace(/[^a-zA-Z0-9._-]/g,"-").slice(-100)}
async function init(){
 if(!cfg.supabaseUrl||cfg.supabaseUrl.includes("YOUR-PROJECT")||!cfg.supabaseAnonKey||!window.supabase){message("loginMessage","Add your Supabase URL and anon/publishable key in config.js, then reload.");$("loginForm").querySelector("button").disabled=true;return}
 client=window.supabase.createClient(cfg.supabaseUrl,cfg.supabaseAnonKey);
 const {data}=await client.auth.getSession();if(data.session)await enter(data.session.user);
}
async function enter(currentUser){
 user=currentUser;$("loginPanel").hidden=true;$("editorPanel").hidden=false;$("signedInAs").textContent="Signed in: "+user.email;
 const {data,error}=await client.from("portfolio").select("content").eq("owner_id",user.id).maybeSingle();
 if(error){alert("Could not load portfolio row: "+error.message);return}
 content=data?.content||structuredClone(DEFAULTS);
 fillForm();renderSectionList();$("contentJson").value=JSON.stringify(content,null,2);dirty=false;$("saveStatus").textContent="No unsaved changes";
}
function fillForm(){
 const s=content.site||{};for(const [id,key] of [["siteName","name"],["siteTitle","title"],["siteBio","bio"],["siteEmail","email"],["sitePhone","phone"],["siteLocation","location"],["heroBackground","heroBackground"]])$(id).value=s[key]||"";
}
function readForm(){
 content.site=content.site||{};
 for(const [id,key] of [["siteName","name"],["siteTitle","title"],["siteBio","bio"],["siteEmail","email"],["sitePhone","phone"],["siteLocation","location"],["heroBackground","heroBackground"]])content.site[key]=$(id).value;
}
function renderSectionList(){
 $("sectionList").innerHTML="";
 (content.sections||[]).forEach((s,i)=>{
  const row=document.createElement("div");row.className="section-row";
  const label=document.createElement("span");label.textContent=(i+1)+". "+s.title;
  const controls=document.createElement("span");
  const toggle=document.createElement("input");toggle.type="checkbox";toggle.checked=s.visible!==false;toggle.title="Visible";toggle.addEventListener("change",()=>{s.visible=toggle.checked;syncJson();setDirty()});
  const up=document.createElement("button");up.textContent="↑";up.type="button";up.addEventListener("click",()=>move(i,-1));
  const down=document.createElement("button");down.textContent="↓";down.type="button";down.addEventListener("click",()=>move(i,1));
  controls.append(toggle,up,down);row.append(label,controls);$("sectionList").append(row);
 });
}
function move(i,d){const j=i+d;if(j<0||j>=content.sections.length)return;[content.sections[i],content.sections[j]]=[content.sections[j],content.sections[i]];renderSectionList();syncJson();setDirty()}
function syncJson(){$("contentJson").value=JSON.stringify(content,null,2)}
async function save(){
 try{readForm();const parsed=JSON.parse($("contentJson").value);content=parsed;
  const {data:existing,error:readErr}=await client.from("portfolio").select("id").eq("owner_id",user.id).maybeSingle();if(readErr)throw readErr;
  let result;
  if(existing)result=await client.from("portfolio").update({content,updated_at:new Date().toISOString()}).eq("owner_id",user.id);
  else result=await client.from("portfolio").insert({owner_id:user.id,content});
  if(result.error)throw result.error;dirty=false;$("saveStatus").textContent="Published successfully";renderSectionList();syncJson();
 }catch(e){alert("Save failed: "+e.message)}
}
$("loginForm").addEventListener("submit",async e=>{e.preventDefault();const {data,error}=await client.auth.signInWithPassword({email:$("email").value,password:$("password").value});if(error)message("loginMessage",error.message);else await enter(data.user)});
$("logout").addEventListener("click",async()=>{if(dirty&&!confirm("You have unsaved changes. Sign out anyway?"))return;await client.auth.signOut();location.reload()});
document.querySelectorAll("[data-tab]").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".tab-content").forEach(x=>x.hidden=true);$("tab-"+b.dataset.tab).hidden=false}));
["siteName","siteTitle","siteBio","siteEmail","sitePhone","siteLocation","heroBackground","contentJson","primaryColor","accentColor"].forEach(id=>$(id).addEventListener("input",setDirty));
$("contentJson").addEventListener("change",()=>{try{content=JSON.parse($("contentJson").value);renderSectionList()}catch{}});
$("formatJson").addEventListener("click",()=>{try{content=JSON.parse($("contentJson").value);syncJson();renderSectionList()}catch(e){alert("Invalid JSON: "+e.message)}});
$("save").addEventListener("click",save);
$("exportJson").addEventListener("click",()=>{const blob=new Blob([JSON.stringify(content,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="portfolio-backup.json";a.click();URL.revokeObjectURL(a.href)});
$("importButton").addEventListener("click",async()=>{const f=$("importJson").files[0];if(!f)return alert("Choose a JSON file first.");try{content=JSON.parse(await f.text());fillForm();renderSectionList();syncJson();setDirty()}catch(e){alert("Invalid backup file: "+e.message)}});
$("uploadMedia").addEventListener("click",async()=>{
 const f=$("mediaFile").files[0];if(!f)return message("mediaResult","Choose a file first.");
 const type=$("mediaType").value;if(type==="cv"&&f.type!=="application/pdf")return message("mediaResult","CV upload accepts PDF files only.");
 const path=`${user.id}/${type}/${Date.now()}-${safeFileName(f.name)}`;
 const {error}=await client.storage.from("portfolio-media").upload(path,f,{upsert:false,contentType:f.type});if(error)return message("mediaResult",error.message);
 const {data}=client.storage.from("portfolio-media").getPublicUrl(path);message("mediaResult","Uploaded: "+data.publicUrl);
 if(type==="profile"){content.site.photo=data.publicUrl;setDirty();alert("Profile photo URL added to content. Click Save & Publish.")}else if(type==="project"){alert("Project image uploaded. Add its URL to the relevant project item in the Content JSON.")}else if(type==="cv"){alert("CV uploaded. Add this public URL to a CV link when you want to display it.")}else{content.site.heroBackground=`linear-gradient(rgba(0,0,0,.15),rgba(0,0,0,.15)),url("${data.publicUrl}") center/cover`;fillForm();setDirty()}
});
window.addEventListener("beforeunload",e=>{if(dirty){e.preventDefault();e.returnValue=""}});
init();
