import { useState, useEffect, useRef } from "react";

const C = { red: "#f18989", purple: "#8B6897", gray: "#e8e6e6", green: "#0a3200", blue: "#aFD2E9" };

/* ─── Scroll reveal ─────────────────────────────── */
function useReveal() {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, v];
}
function R({ children, className = "", delay = 0 }) {
  const [ref, v] = useReveal();
  return (<div ref={ref} className={`transition-all duration-700 ease-out ${v ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>);
}

/* ─── Icons ──────────────────────────────────────── */
const MapPin = ({ size = 20, color = "currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;
const Heart = ({ size = 20, color = "currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>;
const Building = ({ size = 20, color = "currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/></svg>;
const Shield = ({ size = 20, color = "currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>;
const StarIcon = ({ size = 20, color = "currentColor", filled = false }) => <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : "none"} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const Zap = ({ size = 20, color = "currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
const Arrow = ({ size = 14, color = "currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>;
const Users = ({ size = 14 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const Sparkle = ({ size = 14, color = "currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/></svg>;
const Clock = ({ size = 20, color = "currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const Coins = ({ size = 20, color = "currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/></svg>;
const ChevDown = ({ size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>;
const ChevUp = ({ size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>;
const Plus = ({ size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>;
const Send = ({ size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>;
const LogOut = ({ size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>;
const SearchIcon = ({ size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const XIcon = ({ size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;
const Lock = ({ size = 14 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const Eye = ({ size = 18 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>;
const EyeOff = ({ size = 18 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>;
const ArrowLeft = ({ size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>;

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  html { scroll-behavior: smooth; }
  ::selection { background:${C.blue}; color:${C.green}; }
  @keyframes float { 0%{transform:translateY(0) scale(1)} 100%{transform:translateY(-18px) scale(1.08)} }
  @keyframes gentleBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
  @keyframes fadeIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  @keyframes spin { to{transform:rotate(360deg)} }
  .anim-fade { animation: fadeIn 0.5s ease-out both; }
  input, textarea, button { font-family: inherit; }
  input:focus, textarea:focus { outline: none; }
`;

const MOCK_POSTS = [
  { id:"1", authorName:"Pilsen Community Center", authorRole:"Inner", content:"Looking for 3 volunteers to help sort donated winter coats this Saturday 🧤", tags:["volunteer","pilsen"], taskCapacity:3, taskFilled:2, waitlist:[], joinedUsers:[], hoursReward:2, isInnerOnly:false, postTime:"2m ago" },
  { id:"2", authorName:"Maria G.", authorRole:"Looper", content:"Does anyone know a good after-school tutoring program near Humboldt Park? My son needs help with math. Any recommendations appreciated! 🙏", tags:["tutoring","humboldtpark","education"], taskCapacity:null, taskFilled:null, waitlist:null, joinedUsers:null, hoursReward:null, isInnerOnly:false, postTime:"18m ago" },
  { id:"3", authorName:"Logan Square Food Pantry", authorRole:"Inner", content:"URGENT: We need 5 drivers to deliver meal kits to seniors in the 60647 zip code this Thursday morning. Each route takes about 1.5 hours.", tags:["delivery","logansquare","seniors","urgent"], taskCapacity:5, taskFilled:5, waitlist:["u1"], joinedUsers:["u2","u3","u4","u5","u6"], hoursReward:1.5, isInnerOnly:false, postTime:"1h ago" },
  { id:"4", authorName:"Darius W.", authorRole:"Looper", content:"Just finished 10 hours volunteering at the Garfield Park Conservatory cleanup! Feeling good about giving back to the neighborhood. If anyone wants to join next month, keep an eye on the feed 🌿", tags:["garfieldpark","cleanup","community"], taskCapacity:null, taskFilled:null, waitlist:null, joinedUsers:null, hoursReward:null, isInnerOnly:false, postTime:"3h ago" },
  { id:"5", authorName:"Bronzeville Arts Collective", authorRole:"Inner", content:"We have extra easels, paint supplies, and a projector available for community events this month. First come first served — DM us!", tags:["resources","bronzeville","arts"], taskCapacity:null, taskFilled:null, waitlist:null, joinedUsers:null, hoursReward:null, isInnerOnly:true, postTime:"5h ago" },
];

/* ════════════════════ LANDING PAGE ═══════════════════ */
function Dots() {
  const dots = [{c:C.red,x:"12%",y:"25%",s:10,d:"4s"},{c:C.purple,x:"28%",y:"50%",s:14,d:"5s"},{c:C.blue,x:"50%",y:"18%",s:16,d:"6s"},{c:C.red,x:"65%",y:"60%",s:10,d:"4.5s"},{c:C.purple,x:"80%",y:"35%",s:12,d:"5.5s"}];
  return (<div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>{dots.map((d,i)=>(<div key={i} style={{position:"absolute",left:d.x,top:d.y,width:d.s,height:d.s,borderRadius:"50%",background:d.c,opacity:0.2,animation:`float ${d.d} ease-in-out infinite alternate`,animationDelay:`${i*0.5}s`}}/>))}</div>);
}

function FeedCardMock() {
  return (
    <div style={{position:"relative",width:330}}>
      <div style={{position:"absolute",top:-16,left:-16,width:"100%",height:"100%",borderRadius:24,background:`linear-gradient(135deg,${C.blue}66,${C.purple}33)`,transform:"rotate(3deg)"}}/>
      <div style={{position:"absolute",top:-8,right:-12,width:"100%",height:"100%",borderRadius:24,background:`linear-gradient(135deg,${C.red}33,${C.blue}1a)`,transform:"rotate(-2deg)"}}/>
      <div style={{position:"relative",background:"rgba(255,255,255,0.92)",backdropFilter:"blur(8px)",borderRadius:24,boxShadow:`0 25px 50px ${C.green}15`,padding:28,border:"1px solid rgba(255,255,255,0.6)"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
          <div style={{width:44,height:44,borderRadius:"50%",background:`linear-gradient(135deg,${C.purple}4d,${C.purple}1a)`,display:"flex",alignItems:"center",justifyContent:"center"}}><Building size={18} color={C.purple}/></div>
          <div><p style={{fontWeight:600,fontSize:14}}>Pilsen Community Center</p><p style={{fontSize:11,opacity:0.4,display:"flex",alignItems:"center",gap:4}}><Shield size={10} color={C.purple}/>Inner · Verified</p></div>
        </div>
        <p style={{fontSize:14,lineHeight:1.6,opacity:0.8,marginBottom:16}}>Looking for 3 volunteers to help sort donated winter coats this Saturday 🧤</p>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
          {[["#volunteer",C.red],[" #pilsen",C.green],[ "+2 hrs",C.purple]].map(([t,c],i)=>(<span key={i} style={{padding:"6px 12px",borderRadius:50,background:`${c}1a`,color:c,fontSize:12,fontWeight:500}}>{t}</span>))}
        </div>
        <div style={{marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:12,opacity:0.5,marginBottom:6}}><span>2 of 3 spots filled</span><span style={{color:C.red,fontWeight:500,opacity:1}}>1 left!</span></div>
          <div style={{height:8,background:C.gray,borderRadius:50,overflow:"hidden"}}><div style={{height:"100%",width:"66%",background:`linear-gradient(90deg,${C.purple},${C.red})`,borderRadius:50}}/></div>
        </div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingTop:12,borderTop:`1px solid ${C.gray}`}}>
          <span style={{fontSize:12,opacity:0.4,display:"flex",alignItems:"center",gap:4}}><MapPin size={10}/>0.3 mi</span>
          <span style={{fontSize:12,fontWeight:700,color:C.purple,cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>Join Task <Arrow size={12} color={C.purple}/></span>
        </div>
      </div>
      <div style={{position:"absolute",bottom:-16,right:-16,background:`linear-gradient(135deg,${C.green},#065f00)`,color:"#fff",fontSize:12,fontWeight:700,padding:"8px 16px",borderRadius:50,boxShadow:"0 8px 20px rgba(10,50,0,0.3)",display:"flex",alignItems:"center",gap:6,animation:"gentleBounce 3s ease-in-out infinite"}}><Zap size={12} color="#fff"/>2× Waitlist</div>
      <div style={{position:"absolute",top:-12,right:32,background:"#fff",color:C.purple,fontSize:12,fontWeight:700,padding:"6px 12px",borderRadius:50,boxShadow:"0 4px 12px rgba(0,0,0,0.08)",display:"flex",alignItems:"center",gap:4}}><StarIcon size={11} color={C.purple} filled/>4.9</div>
    </div>
  );
}

function LandingPage({ onNavigate }) {
  const [scrolled, setScrolled] = useState(false);
  const [faqOpen, setFaqOpen] = useState(null);
  useEffect(() => { const fn = () => setScrolled(window.scrollY > 20); window.addEventListener("scroll", fn); return () => window.removeEventListener("scroll", fn); }, []);
  const faqs = [
    {q:"Is InnerLoop only for Chicago?",a:"We're launching in Chicago first — neighborhood by neighborhood."},
    {q:"How do I become a verified Inner?",a:"Organizations apply through our signup flow. We verify legal status, location, and community presence."},
    {q:"What can I spend Loop Credits on?",a:"Credits are redeemable at participating local businesses — discounts, event tickets, community perks."},
    {q:"How does the waitlist bonus work?",a:"If a task is full and you join the waitlist, then complete the task after a spot opens, your hours and credits are doubled."},
  ];

  const S = { nav:{position:"sticky",top:0,zIndex:50,transition:"all 0.3s",background:scrolled?"rgba(255,255,255,0.92)":"transparent",backdropFilter:scrolled?"blur(16px)":"none",boxShadow:scrolled?"0 1px 3px rgba(0,0,0,0.05)":"none"},
    section:{padding:"80px 24px"},sectionW:{padding:"80px 24px",background:"#fff"},sectionG:{padding:"80px 24px",background:C.green,color:"#fff"},
    h2:{fontFamily:"Outfit,sans-serif",fontSize:"clamp(28px,4vw,48px)",fontWeight:700},label:{fontSize:12,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",color:C.purple,marginBottom:12},
    gradText:(from,to)=>({background:`linear-gradient(135deg,${from},${to})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}) };

  return (
    <div>
      {/* NAV */}
      <nav style={S.nav}><div style={{maxWidth:1280,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 24px"}}>
        <span style={{fontFamily:"Outfit,sans-serif",fontSize:24,fontWeight:800,color:C.green}}>Inner<span style={S.gradText(C.purple,C.red)}>Loop</span></span>
        <div style={{display:"flex",alignItems:"center",gap:24,fontSize:14,fontWeight:500}}>
          {["Mission","How It Works","Rewards"].map(l=><a key={l} href={`#${l.toLowerCase().replace(/\s+/g,"-")}`} style={{color:C.green,opacity:0.6,textDecoration:"none"}}>{l}</a>)}
          <button onClick={()=>onNavigate("signup")} style={{display:"inline-flex",alignItems:"center",gap:8,padding:"10px 20px",borderRadius:50,background:C.green,color:"#fff",fontSize:12,fontWeight:600,border:"none",cursor:"pointer"}}>Join the Loop <Arrow size={13} color="#fff"/></button>
        </div>
      </div></nav>

      {/* HERO */}
      <section style={{position:"relative",minHeight:"100vh",display:"flex",alignItems:"center",padding:"112px 24px 80px",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-160,right:-160,width:500,height:500,borderRadius:"50%",background:`linear-gradient(135deg,${C.blue}66,${C.purple}33)`,filter:"blur(80px)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:0,left:-128,width:400,height:400,borderRadius:"50%",background:`linear-gradient(135deg,${C.red}40,${C.purple}1a)`,filter:"blur(80px)",pointerEvents:"none"}}/>
        <Dots/>
        <div style={{maxWidth:1280,margin:"0 auto",width:"100%",display:"grid",gridTemplateColumns:"1fr 1fr",gap:64,alignItems:"center",position:"relative",zIndex:10}}>
          <div>
            <R><div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"8px 16px",borderRadius:50,background:"rgba(255,255,255,0.7)",backdropFilter:"blur(8px)",border:`1px solid ${C.green}15`,fontSize:14,fontWeight:500,marginBottom:24,boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}}><MapPin size={14} color={C.red}/>Chicago's Neighborhood Network<Sparkle size={14} color={C.purple}/></div></R>
            <R delay={100}><h1 style={{fontFamily:"Outfit,sans-serif",fontSize:"clamp(48px,6vw,72px)",fontWeight:800,lineHeight:1.05,letterSpacing:"-0.03em",marginBottom:24}}>Helping the <span style={S.gradText(C.purple,"#a87bb5")}>Inner</span><br/>as a <span style={S.gradText(C.red,"#e66767")}>Looper</span></h1></R>
            <R delay={200}><p style={{fontSize:18,opacity:0.55,maxWidth:460,lineHeight:1.7,marginBottom:32}}>InnerLoop connects everyday people with trusted local organizations so neighborhoods thrive — one task, one hour, one connection at a time.</p></R>
            <R delay={300}><div style={{display:"flex",gap:16,flexWrap:"wrap",marginBottom:32}}>
              <button onClick={()=>onNavigate("signup")} style={{display:"inline-flex",alignItems:"center",gap:8,padding:"16px 32px",borderRadius:50,background:C.green,color:"#fff",fontWeight:600,fontSize:14,border:"none",cursor:"pointer",boxShadow:`0 8px 24px ${C.green}30`}}>Get Started <Arrow size={16} color="#fff"/></button>
              <a href="#how-it-works" style={{display:"inline-flex",alignItems:"center",gap:8,padding:"16px 32px",borderRadius:50,border:`2px solid ${C.green}33`,fontWeight:600,fontSize:14,textDecoration:"none",color:C.green}}>See How It Works</a>
            </div></R>
            <R delay={400}><div style={{display:"flex",gap:32,fontSize:13,opacity:0.45}}><span style={{display:"flex",alignItems:"center",gap:6}}><Users/>2,400+ waitlist</span><span style={{display:"flex",alignItems:"center",gap:6}}><MapPin size={14}/>38 neighborhoods</span><span style={{display:"flex",alignItems:"center",gap:6}}><StarIcon size={14}/>4.9 avg</span></div></R>
          </div>
          <R delay={350} className="flex justify-center"><FeedCardMock/></R>
        </div>
      </section>

      {/* MISSION */}
      <section id="mission" style={S.sectionW}>
        <div style={{maxWidth:960,margin:"0 auto",textAlign:"center"}}><R><p style={S.label}>Our Mission</p></R><R delay={100}><h2 style={S.h2}>Neighborhoods are strongest when <span style={S.gradText(C.red,C.purple)}>everyone</span> is in the loop.</h2></R><R delay={200}><p style={{fontSize:18,opacity:0.55,maxWidth:640,margin:"16px auto 0",lineHeight:1.7}}>InnerLoop bridges the gap between everyday people and the local organizations that serve them.</p></R></div>
        <div style={{maxWidth:1120,margin:"64px auto 0",display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:24}}>
          {[{icon:<MapPin size={22} color={C.red}/>,t:"Hyper-Local",b:"Every post is tagged by proximity. You see what matters within blocks.",g:`${C.red}1a`,gf:`${C.red}0d`,bd:`${C.red}1a`},{icon:<Shield size={22} color={C.purple}/>,t:"Trust Built-In",b:"Verified organizations (Inners) ensure tasks are legit, safe, and completed.",g:`${C.purple}1a`,gf:`${C.purple}0d`,bd:`${C.purple}1a`},{icon:<Coins size={22} color="#6ba8c7"/>,t:"Real Rewards",b:"Earn verified hours and Loop Credits for every task — doubled if you waited.",g:`${C.blue}26`,gf:`${C.blue}0d`,bd:`${C.blue}33`}].map((c,i)=>(
            <R key={c.t} delay={i*120}><div style={{padding:28,borderRadius:16,background:`linear-gradient(180deg,${c.g},${c.gf})`,border:`1px solid ${c.bd}`,cursor:"pointer",transition:"all 0.3s"}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 12px 32px rgba(0,0,0,0.08)"}} onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=""}}>
              <div style={{width:48,height:48,borderRadius:12,background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 8px rgba(0,0,0,0.04)",marginBottom:16}}>{c.icon}</div>
              <h3 style={{fontFamily:"Outfit,sans-serif",fontSize:18,fontWeight:700,marginBottom:8}}>{c.t}</h3><p style={{fontSize:14,opacity:0.55,lineHeight:1.7}}>{c.b}</p>
            </div></R>))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{...S.section,position:"relative",overflow:"hidden"}}>
        <div style={{maxWidth:960,margin:"0 auto 64px",textAlign:"center"}}><R><p style={S.label}>How It Works</p></R><R delay={100}><h2 style={S.h2}>Two roles. One <span style={S.gradText(C.purple,C.red)}>Loop</span>.</h2></R></div>
        <div style={{maxWidth:1120,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:32}}>
          {[{icon:<Heart size={26} color={C.red}/>,t:"Looper",s:"Personal Account",a:C.red,d:"An everyday person who can both <strong>give help</strong> and <strong>ask for help</strong>.",items:["Browse & claim tasks","Earn verified hours + Loop Credits","Build your Star Rating","Join waitlists — get 2× rewards"]},{icon:<Building size={26} color={C.purple}/>,t:"Inner",s:"Business / Org Account",a:C.purple,d:"A <strong>verified organization</strong> that posts tasks, manages capacity, and ensures completion.",items:["Post tasks & manage capacity","Verify hours and issue credits","Access the Inner Loop (B2B)","DM other Inners, share resources"]}].map((r,ri)=>(
            <R key={r.t} delay={ri*150}><div style={{borderRadius:24,background:"#fff",border:`1px solid ${r.a}26`,padding:32,transition:"all 0.5s"}} onMouseEnter={e=>{e.currentTarget.style.boxShadow=`0 20px 50px ${r.a}12`}} onMouseLeave={e=>{e.currentTarget.style.boxShadow=""}}>
              <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:24}}><div style={{width:56,height:56,borderRadius:16,background:`linear-gradient(135deg,${r.a}33,${r.a}0d)`,display:"flex",alignItems:"center",justifyContent:"center"}}>{r.icon}</div><div><h3 style={{fontFamily:"Outfit,sans-serif",fontSize:24,fontWeight:700}}>{r.t}</h3><p style={{fontSize:13,opacity:0.45}}>{r.s}</p></div></div>
              <p style={{opacity:0.6,lineHeight:1.7,marginBottom:24}} dangerouslySetInnerHTML={{__html:r.d}}/>
              <ul style={{listStyle:"none",padding:0}}>{r.items.map((it,i)=>(<li key={i} style={{display:"flex",alignItems:"center",gap:12,marginBottom:12,fontSize:14}}><span style={{width:24,height:24,borderRadius:"50%",background:`${r.a}1a`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Arrow size={12} color={r.a}/></span><span style={{opacity:0.65}}>{it}</span></li>))}</ul>
            </div></R>))}
        </div>
      </section>

      {/* REWARDS */}
      <section id="rewards" style={{...S.sectionG,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:0,right:0,width:384,height:384,borderRadius:"50%",background:`${C.purple}1a`,filter:"blur(80px)",pointerEvents:"none"}}/>
        <div style={{maxWidth:960,margin:"0 auto 64px",textAlign:"center",position:"relative",zIndex:1}}><R><p style={{...S.label,color:C.blue}}>Rewards System</p></R><R delay={100}><h2 style={S.h2}>Your time is <span style={S.gradText(C.red,"#f5b0b0")}>valued</span>.</h2></R></div>
        <div style={{maxWidth:960,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:24,position:"relative",zIndex:1}}>
          {[{icon:<StarIcon size={20} color={C.red}/>,l:"Star Rating",d:"1–5 stars reflect reliability."},{icon:<Clock size={20} color={C.blue}/>,l:"Verified Hours",d:"Proof of real community impact."},{icon:<Coins size={20} color={C.red}/>,l:"Loop Credits",d:"Redeemable at local businesses."}].map((r,i)=>(
            <R key={r.l} delay={i*120}><div style={{borderRadius:16,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.08)",padding:28}}>
              <div style={{width:48,height:48,borderRadius:12,background:"rgba(255,255,255,0.1)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:16}}>{r.icon}</div>
              <h3 style={{fontFamily:"Outfit,sans-serif",fontSize:18,fontWeight:700,marginBottom:8}}>{r.l}</h3><p style={{fontSize:14,opacity:0.4,lineHeight:1.7}}>{r.d}</p>
            </div></R>))}
        </div>
        <R><div style={{maxWidth:720,margin:"56px auto 0",borderRadius:16,background:`linear-gradient(90deg,${C.red}33,${C.purple}33)`,border:`1px solid ${C.red}33`,padding:32,textAlign:"center",position:"relative",zIndex:1}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,color:C.red,fontWeight:700,fontSize:18,marginBottom:12}}><Zap size={20} color={C.red}/>Waitlist Reward Multiplier</div>
          <p style={{opacity:0.6,lineHeight:1.7}}>When a task is full, join a <strong style={{opacity:1}}>waitlist</strong>. Complete it after a spot opens and your hours + credits are <strong style={{color:C.red}}>doubled (2×)</strong>.</p>
        </div></R>
      </section>

      {/* FAQ */}
      <section style={S.section}><div style={{maxWidth:720,margin:"0 auto"}}>
        <R><p style={{...S.label,textAlign:"center"}}>FAQ</p></R><R delay={100}><h2 style={{...S.h2,textAlign:"center",marginBottom:40}}>Common questions</h2></R>
        {faqs.map((f,i)=>(<R key={i} delay={i*80}><button onClick={()=>setFaqOpen(faqOpen===i?null:i)} style={{width:"100%",textAlign:"left",borderRadius:16,background:"#fff",border:`1px solid ${faqOpen===i?`${C.purple}33`:C.gray}`,padding:24,marginBottom:12,cursor:"pointer",transition:"all 0.3s",boxShadow:faqOpen===i?"0 8px 24px rgba(0,0,0,0.06)":"none"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}><span style={{fontWeight:600,fontSize:14,paddingRight:16}}>{f.q}</span><div style={{width:32,height:32,borderRadius:"50%",background:faqOpen===i?`${C.purple}1a`:C.gray,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{faqOpen===i?<ChevUp/>:<ChevDown/>}</div></div>
          <div style={{overflow:"hidden",maxHeight:faqOpen===i?160:0,transition:"max-height 0.3s",marginTop:faqOpen===i?16:0}}><p style={{fontSize:14,opacity:0.55,lineHeight:1.7}}>{f.a}</p></div>
        </button></R>))}
      </div></section>

      {/* CTA */}
      <section id="join" style={{padding:"80px 24px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:`linear-gradient(135deg,${C.purple},#6a4d7a,${C.purple})`}}/>
        <div style={{maxWidth:720,margin:"0 auto",textAlign:"center",position:"relative",zIndex:1,color:"#fff"}}>
          <R><h2 style={{...S.h2,marginBottom:16}}>Ready to join the Loop?</h2></R>
          <R delay={100}><p style={{opacity:0.6,maxWidth:480,margin:"0 auto 32px",lineHeight:1.7}}>Whether you're an everyday person or an organization — there's a place for you here.</p></R>
          <R delay={200}><div style={{display:"flex",justifyContent:"center",gap:16,flexWrap:"wrap"}}>
            <button onClick={()=>onNavigate("signup")} style={{display:"inline-flex",alignItems:"center",gap:8,padding:"16px 32px",borderRadius:50,background:"#fff",color:C.purple,fontWeight:700,fontSize:14,border:"none",cursor:"pointer",boxShadow:"0 8px 24px rgba(0,0,0,0.15)"}}><Heart size={16} color={C.purple}/>Sign Up as Looper</button>
            <button onClick={()=>onNavigate("signup")} style={{display:"inline-flex",alignItems:"center",gap:8,padding:"16px 32px",borderRadius:50,background:"transparent",color:"#fff",fontWeight:700,fontSize:14,border:"2px solid rgba(255,255,255,0.4)",cursor:"pointer"}}><Building size={16} color="#fff"/>Register as Inner</button>
          </div></R>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{background:C.green,color:"rgba(255,255,255,0.35)",fontSize:12,padding:"40px 24px"}}><div style={{maxWidth:1280,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:24}}>
        <p style={{fontFamily:"Outfit,sans-serif",fontSize:18,fontWeight:800,color:"#fff"}}>Inner<span style={S.gradText(C.purple,C.red)}>Loop</span></p>
        <p>© 2026 InnerLoop Chicago. All rights reserved.</p>
        <div style={{display:"flex",gap:24}}>{["Privacy","Terms","Contact"].map(l=><a key={l} href="#" style={{color:"inherit",textDecoration:"none"}}>{l}</a>)}</div>
      </div></footer>
    </div>
  );
}

/* ════════════════════ SIGNUP PAGE ═══════════════════ */
function SignUpPage({ onNavigate }) {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  const bg = {position:"absolute",borderRadius:"50%",filter:"blur(80px)",pointerEvents:"none"};

  return (
    <div style={{minHeight:"100vh",background:C.gray,display:"flex",alignItems:"center",justifyContent:"center",padding:"48px 24px",position:"relative",overflow:"hidden",fontFamily:"'DM Sans',sans-serif",color:C.green}}>
      <div style={{...bg,top:-128,right:-128,width:384,height:384,background:`linear-gradient(135deg,${C.blue}4d,${C.purple}26)`}}/>
      <div style={{...bg,bottom:-128,left:-128,width:320,height:320,background:`linear-gradient(135deg,${C.red}33,${C.purple}1a)`}}/>
      <div style={{width:"100%",maxWidth:448,position:"relative",zIndex:10}}>
        <div style={{textAlign:"center",marginBottom:32,cursor:"pointer"}} onClick={()=>onNavigate("landing")}>
          <span style={{fontFamily:"Outfit,sans-serif",fontSize:24,fontWeight:800,color:C.green}}>Inner<span style={{background:`linear-gradient(135deg,${C.purple},${C.red})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Loop</span></span>
        </div>
        {step === 1 ? (
          <div className="anim-fade" style={{display:"flex",flexDirection:"column",gap:24}}>
            <div style={{textAlign:"center"}}><h1 style={{fontFamily:"Outfit,sans-serif",fontSize:28,fontWeight:700,marginBottom:4}}>Join the Loop</h1><p style={{fontSize:14,opacity:0.5}}>Choose how you want to participate</p></div>
            {[{r:"Looper",icon:<Heart size={24} color={C.red}/>,sub:"Personal account — give & receive help",desc:"Browse tasks, earn verified hours & Loop Credits.",a:C.red},{r:"Inner",icon:<Building size={24} color={C.purple}/>,sub:"Organization account — post tasks & verify",desc:"Post tasks, manage capacity, access the Inner Loop.",a:C.purple}].map(o=>(
              <button key={o.r} onClick={()=>{setRole(o.r);setStep(2)}} style={{borderRadius:16,background:"#fff",border:"2px solid transparent",padding:24,textAlign:"left",cursor:"pointer",transition:"all 0.3s"}} onMouseEnter={e=>e.currentTarget.style.borderColor=`${o.a}4d`} onMouseLeave={e=>e.currentTarget.style.borderColor="transparent"}>
                <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:8}}><div style={{width:56,height:56,borderRadius:16,background:`linear-gradient(135deg,${o.a}33,${o.a}0d)`,display:"flex",alignItems:"center",justifyContent:"center"}}>{o.icon}</div><div><h3 style={{fontFamily:"Outfit,sans-serif",fontSize:18,fontWeight:700,display:"flex",alignItems:"center",gap:8}}>{o.r}<Arrow size={14} color={`${o.a}66`}/></h3><p style={{fontSize:13,opacity:0.5}}>{o.sub}</p></div></div>
                <p style={{fontSize:13,opacity:0.4}}>{o.desc}</p>
              </button>
            ))}
            <p style={{textAlign:"center",fontSize:14,opacity:0.4}}>Already have an account? <span onClick={()=>onNavigate("login")} style={{fontWeight:600,color:C.purple,cursor:"pointer"}}>Sign in</span></p>
          </div>
        ) : (
          <div className="anim-fade">
            <div style={{background:"#fff",borderRadius:24,boxShadow:"0 25px 50px rgba(0,0,0,0.08)",border:`1px solid ${C.gray}`,padding:32}}>
              <button onClick={()=>setStep(1)} style={{display:"flex",alignItems:"center",gap:4,fontSize:14,opacity:0.5,background:"none",border:"none",cursor:"pointer",marginBottom:24,color:C.green}}><ArrowLeft/>Back</button>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:32}}>
                <div style={{width:48,height:48,borderRadius:12,background:`linear-gradient(135deg,${role==="Inner"?C.purple:C.red}33,${role==="Inner"?C.purple:C.red}0d)`,display:"flex",alignItems:"center",justifyContent:"center"}}>{role==="Inner"?<Building size={20} color={C.purple}/>:<Heart size={20} color={C.red}/>}</div>
                <div><h2 style={{fontFamily:"Outfit,sans-serif",fontSize:20,fontWeight:700}}>Create {role} account</h2><p style={{fontSize:12,opacity:0.4}}>{role==="Inner"?"For organizations":"For community members"}</p></div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:20}}>
                <div><label style={{display:"block",fontSize:14,fontWeight:500,marginBottom:8}}>{role==="Inner"?"Organization Name":"Full Name"}</label><input value={name} onChange={e=>setName(e.target.value)} placeholder={role==="Inner"?"Pilsen Community Center":"Jane Doe"} style={{width:"100%",padding:"12px 16px",borderRadius:12,border:`1px solid ${C.gray}`,background:`${C.gray}4d`,fontSize:14}} /></div>
                <div><label style={{display:"block",fontSize:14,fontWeight:500,marginBottom:8}}>Email</label><input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="you@example.com" style={{width:"100%",padding:"12px 16px",borderRadius:12,border:`1px solid ${C.gray}`,background:`${C.gray}4d`,fontSize:14}} /></div>
                <div><label style={{display:"block",fontSize:14,fontWeight:500,marginBottom:8}}>Password</label><div style={{position:"relative"}}><input value={password} onChange={e=>setPassword(e.target.value)} type={showPw?"text":"password"} placeholder="At least 6 characters" style={{width:"100%",padding:"12px 16px",paddingRight:48,borderRadius:12,border:`1px solid ${C.gray}`,background:`${C.gray}4d`,fontSize:14}} /><button onClick={()=>setShowPw(!showPw)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",opacity:0.3}}>{showPw?<EyeOff/>:<Eye/>}</button></div></div>
                <button onClick={()=>{if(name&&email&&password)onNavigate("feed",{name,role})}} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"14px 24px",borderRadius:50,background:role==="Inner"?C.purple:C.green,color:"#fff",fontWeight:600,fontSize:14,border:"none",cursor:"pointer"}}>Create Account <Arrow size={16} color="#fff"/></button>
              </div>
              {role==="Inner"&&<div style={{marginTop:24,padding:16,borderRadius:12,background:`${C.purple}0d`,border:`1px solid ${C.purple}1a`}}><p style={{fontSize:12,opacity:0.5}}><strong style={{color:C.purple}}>Note:</strong> Inner accounts require verification after signup.</p></div>}
            </div>
            <p style={{textAlign:"center",fontSize:14,opacity:0.4,marginTop:24}}>Already have an account? <span onClick={()=>onNavigate("login")} style={{fontWeight:600,color:C.purple,cursor:"pointer"}}>Sign in</span></p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ════════════════════ LOGIN PAGE ═══════════════════ */
function LoginPage({ onNavigate }) {
  const [email,setEmail]=useState("");const [pw,setPw]=useState("");const [showPw,setShowPw]=useState(false);
  const bg={position:"absolute",borderRadius:"50%",filter:"blur(80px)",pointerEvents:"none"};
  return (
    <div style={{minHeight:"100vh",background:C.gray,display:"flex",alignItems:"center",justifyContent:"center",padding:"48px 24px",position:"relative",overflow:"hidden",fontFamily:"'DM Sans',sans-serif",color:C.green}}>
      <div style={{...bg,top:-128,left:-128,width:384,height:384,background:`linear-gradient(135deg,${C.purple}33,${C.blue}26)`}}/>
      <div style={{width:"100%",maxWidth:448,position:"relative",zIndex:10}}>
        <div style={{textAlign:"center",marginBottom:32,cursor:"pointer"}} onClick={()=>onNavigate("landing")}><span style={{fontFamily:"Outfit,sans-serif",fontSize:24,fontWeight:800,color:C.green}}>Inner<span style={{background:`linear-gradient(135deg,${C.purple},${C.red})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Loop</span></span></div>
        <div className="anim-fade" style={{background:"#fff",borderRadius:24,boxShadow:"0 25px 50px rgba(0,0,0,0.08)",border:`1px solid ${C.gray}`,padding:32}}>
          <div style={{textAlign:"center",marginBottom:32}}><h1 style={{fontFamily:"Outfit,sans-serif",fontSize:24,fontWeight:700,marginBottom:4}}>Welcome back</h1><p style={{fontSize:14,opacity:0.5}}>Sign in to your InnerLoop account</p></div>
          <div style={{display:"flex",flexDirection:"column",gap:20}}>
            <div><label style={{display:"block",fontSize:14,fontWeight:500,marginBottom:8}}>Email</label><input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="you@example.com" style={{width:"100%",padding:"12px 16px",borderRadius:12,border:`1px solid ${C.gray}`,background:`${C.gray}4d`,fontSize:14}}/></div>
            <div><label style={{display:"block",fontSize:14,fontWeight:500,marginBottom:8}}>Password</label><div style={{position:"relative"}}><input value={pw} onChange={e=>setPw(e.target.value)} type={showPw?"text":"password"} placeholder="Enter your password" style={{width:"100%",padding:"12px 16px",paddingRight:48,borderRadius:12,border:`1px solid ${C.gray}`,background:`${C.gray}4d`,fontSize:14}}/><button onClick={()=>setShowPw(!showPw)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",opacity:0.3}}>{showPw?<EyeOff/>:<Eye/>}</button></div></div>
            <button onClick={()=>onNavigate("feed",{name:"Demo User",role:"Looper"})} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"14px 24px",borderRadius:50,background:C.green,color:"#fff",fontWeight:600,fontSize:14,border:"none",cursor:"pointer"}}>Sign In <Arrow size={16} color="#fff"/></button>
          </div>
        </div>
        <p style={{textAlign:"center",fontSize:14,opacity:0.4,marginTop:24}}>Don't have an account? <span onClick={()=>onNavigate("signup")} style={{fontWeight:600,color:C.purple,cursor:"pointer"}}>Join the Loop</span></p>
      </div>
    </div>
  );
}

/* ════════════════════ FEED PAGE ═══════════════════ */
function PostCard({ post, onJoin }) {
  const isTask = post.taskCapacity != null;
  const isFull = isTask && (post.taskFilled||0) >= post.taskCapacity;
  const isInner = post.authorRole === "Inner";

  return (
    <div style={{background:"#fff",borderRadius:16,border:`1px solid ${C.gray}`,padding:24,transition:"box-shadow 0.3s"}} onMouseEnter={e=>e.currentTarget.style.boxShadow="0 8px 24px rgba(0,0,0,0.06)"} onMouseLeave={e=>e.currentTarget.style.boxShadow=""}>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
        <div style={{width:40,height:40,borderRadius:"50%",background:`linear-gradient(135deg,${isInner?C.purple:C.red}40,${isInner?C.purple:C.red}15)`,display:"flex",alignItems:"center",justifyContent:"center"}}>{isInner?<Building size={18} color={C.purple}/>:<Heart size={18} color={C.red}/>}</div>
        <div style={{flex:1}}><p style={{fontWeight:600,fontSize:14}}>{post.authorName}</p><p style={{fontSize:12,opacity:0.4,display:"flex",alignItems:"center",gap:4}}>{isInner&&<Shield size={10} color={C.purple}/>}{post.authorRole} · {post.postTime}</p></div>
        {post.isInnerOnly&&<span style={{padding:"4px 10px",borderRadius:50,background:`${C.purple}1a`,color:C.purple,fontSize:11,fontWeight:600,display:"flex",alignItems:"center",gap:4}}><Lock size={10}/>Inner Only</span>}
      </div>
      <p style={{fontSize:14,lineHeight:1.7,opacity:0.8,marginBottom:16,whiteSpace:"pre-wrap"}}>{post.content}</p>
      {post.tags?.length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:16}}>{post.tags.map(t=><span key={t} style={{padding:"4px 10px",borderRadius:50,fontSize:12,fontWeight:500,background:`${C.blue}26`,border:`1px solid ${C.blue}26`}}>#{t}</span>)}</div>}
      {isTask&&(
        <div style={{padding:16,borderRadius:12,background:`${C.gray}66`,marginBottom:12}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:8}}>
            <span style={{opacity:0.5,display:"flex",alignItems:"center",gap:4}}><Users size={12}/>{post.taskFilled||0} of {post.taskCapacity} spots</span>
            {isFull?<span style={{color:C.red,fontWeight:600,display:"flex",alignItems:"center",gap:4}}><Clock size={12} color={C.red}/>Full — waitlist open</span>:<span style={{opacity:0.6,fontWeight:500}}>{post.taskCapacity-(post.taskFilled||0)} left</span>}
          </div>
          <div style={{height:8,background:"#fff",borderRadius:50,overflow:"hidden",marginBottom:12}}>
            <div style={{height:"100%",borderRadius:50,background:isFull?C.red:`linear-gradient(90deg,${C.purple},${C.red})`,width:`${Math.min(100,((post.taskFilled||0)/post.taskCapacity)*100)}%`,transition:"width 0.5s"}}/>
          </div>
          {isFull&&post.waitlist?.length>0&&<p style={{fontSize:12,opacity:0.4,display:"flex",alignItems:"center",gap:4,marginBottom:12}}><Zap size={11} color={C.red}/>{post.waitlist.length} on waitlist — 2× rewards</p>}
          <button onClick={()=>onJoin&&onJoin(post.id)} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 20px",borderRadius:50,fontSize:13,fontWeight:600,color:"#fff",background:isFull?C.red:C.green,border:"none",cursor:"pointer",transition:"all 0.3s"}} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.05)"} onMouseLeave={e=>e.currentTarget.style.transform=""}>
            {isFull?<><Zap size={14} color="#fff"/>Join Waitlist (2×)</>:<><Arrow size={14} color="#fff"/>Join Task</>}
          </button>
        </div>
      )}
      {isTask&&post.hoursReward&&<div style={{display:"flex",justifyContent:"space-between",fontSize:12,opacity:0.4,paddingTop:8,borderTop:`1px solid ${C.gray}`}}><span style={{display:"flex",alignItems:"center",gap:4}}><Clock size={11}/>+{post.hoursReward} verified hours</span><span style={{display:"flex",alignItems:"center",gap:4}}><MapPin size={11}/>Nearby</span></div>}
    </div>
  );
}

function FeedPage({ user, onNavigate }) {
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [posts, setPosts] = useState(MOCK_POSTS.filter(p => !p.isInnerOnly));
  const [newContent, setNewContent] = useState("");
  const [newTags, setNewTags] = useState("");
  const isInner = user?.role === "Inner";

  const filtered = search.trim() ? posts.filter(p => p.tags?.some(t => t.includes(search.toLowerCase()))) : posts;

  function handleCreate() {
    if (!newContent.trim()) return;
    const post = { id: Date.now().toString(), authorName: user?.name || "You", authorRole: user?.role || "Looper", content: newContent.trim(), tags: newTags.split(",").map(t=>t.trim().replace(/^#/,"")).filter(Boolean), taskCapacity: null, taskFilled: null, waitlist: null, joinedUsers: null, hoursReward: null, isInnerOnly: false, postTime: "just now" };
    setPosts([post, ...posts]);
    setNewContent("");
    setNewTags("");
    setShowCreate(false);
  }

  return (
    <div style={{minHeight:"100vh",background:C.gray,fontFamily:"'DM Sans',sans-serif",color:C.green}}>
      {/* Nav */}
      <nav style={{position:"sticky",top:0,zIndex:40,background:"rgba(255,255,255,0.92)",backdropFilter:"blur(16px)",borderBottom:`1px solid ${C.gray}`}}>
        <div style={{maxWidth:640,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 16px"}}>
          <span style={{fontFamily:"Outfit,sans-serif",fontSize:20,fontWeight:800,color:C.green,cursor:"pointer"}} onClick={()=>onNavigate("landing")}>Inner<span style={{background:`linear-gradient(135deg,${C.purple},${C.red})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Loop</span></span>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:36,height:36,borderRadius:"50%",background:C.gray,display:"flex",alignItems:"center",justifyContent:"center"}}>{isInner?<Building size={16} color={C.purple}/>:<Heart size={16} color={C.red}/>}</div>
            <button onClick={()=>onNavigate("landing")} style={{width:36,height:36,borderRadius:"50%",background:C.gray,display:"flex",alignItems:"center",justifyContent:"center",border:"none",cursor:"pointer"}}><LogOut size={16}/></button>
          </div>
        </div>
      </nav>

      <div style={{maxWidth:640,margin:"0 auto",padding:"24px 16px"}}>
        {/* Header */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
          <div><h1 style={{fontFamily:"Outfit,sans-serif",fontSize:24,fontWeight:700,display:"flex",alignItems:"center",gap:8}}><MapPin size={20} color={C.red}/>Local Feed</h1><p style={{fontSize:13,opacity:0.4,marginTop:2}}>What's happening in your neighborhood</p></div>
          <button onClick={()=>setShowCreate(true)} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 20px",borderRadius:50,background:C.green,color:"#fff",fontSize:13,fontWeight:600,border:"none",cursor:"pointer",boxShadow:`0 4px 16px ${C.green}26`}}><Plus size={16}/>New Post</button>
        </div>

        {/* Search */}
        <div style={{position:"relative",marginBottom:24}}>
          <div style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",opacity:0.3}}><SearchIcon/></div>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by tag..." style={{width:"100%",paddingLeft:40,paddingRight:16,padding:"10px 16px 10px 40px",borderRadius:12,border:`1px solid ${C.gray}`,background:"#fff",fontSize:14}}/>
          {search&&<button onClick={()=>setSearch("")} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",opacity:0.3}}><XIcon/></button>}
        </div>

        {/* Posts */}
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          {filtered.map(p => <PostCard key={p.id} post={p} />)}
        </div>
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div style={{position:"fixed",inset:0,zIndex:50,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{position:"absolute",inset:0,background:`${C.green}66`,backdropFilter:"blur(8px)"}} onClick={()=>setShowCreate(false)}/>
          <div className="anim-fade" style={{position:"relative",width:"100%",maxWidth:480,background:"#fff",borderRadius:24,boxShadow:"0 25px 60px rgba(0,0,0,0.15)",maxHeight:"90vh",overflow:"auto"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"20px 24px",borderBottom:`1px solid ${C.gray}`}}>
              <h2 style={{fontFamily:"Outfit,sans-serif",fontSize:18,fontWeight:700}}>New Post</h2>
              <button onClick={()=>setShowCreate(false)} style={{width:32,height:32,borderRadius:"50%",background:C.gray,display:"flex",alignItems:"center",justifyContent:"center",border:"none",cursor:"pointer"}}><XIcon/></button>
            </div>
            <div style={{padding:24,display:"flex",flexDirection:"column",gap:20}}>
              <textarea value={newContent} onChange={e=>setNewContent(e.target.value)} placeholder="What's happening in your neighborhood?" rows={4} style={{width:"100%",padding:"12px 16px",borderRadius:12,border:`1px solid ${C.gray}`,background:`${C.gray}33`,fontSize:14,resize:"none",lineHeight:1.6}}/>
              <div><label style={{display:"flex",alignItems:"center",gap:4,fontSize:14,fontWeight:500,marginBottom:8,opacity:0.7}}><span style={{opacity:0.5}}>#</span> Tags <span style={{fontWeight:400,opacity:0.4}}>(comma separated)</span></label><input value={newTags} onChange={e=>setNewTags(e.target.value)} placeholder="volunteer, pilsen, urgent" style={{width:"100%",padding:"10px 16px",borderRadius:12,border:`1px solid ${C.gray}`,background:`${C.gray}33`,fontSize:14}}/></div>
              <button onClick={handleCreate} disabled={!newContent.trim()} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"14px 24px",borderRadius:50,background:C.green,color:"#fff",fontWeight:600,fontSize:14,border:"none",cursor:newContent.trim()?"pointer":"not-allowed",opacity:newContent.trim()?1:0.5}}><Send size={16}/>Post to Feed</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ════════════════════ MAIN APP ═══════════════════ */
export default function InnerLoopApp() {
  const [page, setPage] = useState("landing");
  const [user, setUser] = useState(null);

  function navigate(p, userData) {
    if (userData) setUser(userData);
    if (p === "landing") setUser(null);
    setPage(p);
    window.scrollTo(0, 0);
  }

  return (
    <div style={{fontFamily:"'DM Sans',sans-serif",background:C.gray,color:C.green,WebkitFontSmoothing:"antialiased",minHeight:"100vh"}}>
      <style>{css}</style>
      {page === "landing" && <LandingPage onNavigate={navigate} />}
      {page === "signup" && <SignUpPage onNavigate={navigate} />}
      {page === "login" && <LoginPage onNavigate={navigate} />}
      {page === "feed" && <FeedPage user={user} onNavigate={navigate} />}
    </div>
  );
}
