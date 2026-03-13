// UI utilities: DOM helpers, routing, toast, modal, animations

// DOM shortcuts
export const $=id=>document.getElementById(id);
export const qs=sel=>document.querySelector(sel);
export const qsa=sel=>document.querySelectorAll(sel);

// Array utilities
export function shuffleArray(arr){
  const a=[...arr];
  for(let i=a.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}
export function pickRandom(arr,n){return shuffleArray(arr).slice(0,n)}

// Tab switching
export function switchTab(tabId){
  qsa(".tab-btn").forEach(b=>b.classList.toggle("active",b.dataset.tab===tabId));
  qsa(".tab-content").forEach(c=>c.classList.toggle("active",c.id==="tab-"+tabId));
}

// Screen switching within a tab
export function showScreen(containerId,screenId){
  const container=$(containerId);
  if(!container) return;
  container.querySelectorAll("[data-screen]").forEach(s=>s.style.display="none");
  const screen=container.querySelector(`[data-screen="${screenId}"]`);
  if(screen) screen.style.display="block";
}

// Toast notification
export function showToast(msg,type="info",duration=2000){
  const toast=document.createElement("div");
  toast.className=`toast toast-${type}`;
  toast.textContent=msg;
  document.body.appendChild(toast);
  requestAnimationFrame(()=>toast.classList.add("show"));
  setTimeout(()=>{
    toast.classList.remove("show");
    setTimeout(()=>toast.remove(),300);
  },duration);
}

// Modal show/hide
export function showModal(id){const m=$(id);if(m)m.classList.add("show")}
export function hideModal(id){const m=$(id);if(m)m.classList.remove("show")}

// Confetti animation
export function confetti(){
  const colors=["#f59e0b","#7c3aed","#2563eb","#10b981","#ef4444","#ec4899"];
  for(let i=0;i<40;i++){
    const p=document.createElement("div");
    p.className="confetti-piece";
    p.style.background=colors[i%colors.length];
    p.style.left=Math.random()*100+"vw";
    p.style.animationDelay=Math.random()*0.5+"s";
    document.body.appendChild(p);
    setTimeout(()=>p.remove(),2500);
  }
}

// Badge popup
export function showBadgePopup(badge){
  const popup=$("badgePopup");
  if(!popup) return;
  popup.querySelector(".badge-popup-icon").textContent=badge.icon;
  popup.querySelector(".badge-popup-text").textContent=badge.name;
  popup.querySelector(".badge-popup-sub").textContent=badge.desc;
  popup.classList.add("show");
  setTimeout(()=>popup.classList.remove("show"),3000);
}

// XP float animation
export function showXPFloat(container,xp){
  const el=document.createElement("div");
  el.className="xp-float";
  el.textContent=`+${xp} XP`;
  container.appendChild(el);
  setTimeout(()=>el.remove(),800);
}

// Escape HTML
export function escapeHTML(str){
  const d=document.createElement("div");
  d.textContent=str;
  return d.innerHTML;
}
