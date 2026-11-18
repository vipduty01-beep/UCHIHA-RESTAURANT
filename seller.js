import * as FB from "./firebase.js";
const $=s=>document.querySelector(s),money=n=>"$"+Number(n||0).toFixed(2);
let orders=[],filter="All",unsubscribe=null;
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2600)}
$("#login-form").addEventListener("submit",async e=>{
 e.preventDefault();if(!FB.configured)return toast("Add your Firebase project settings first (see README).");
 const f=new FormData(e.target),btn=e.target.querySelector("button");btn.disabled=true;btn.textContent="Signing in…";
 try{await FB.signInWithEmailAndPassword(FB.auth,f.get("email"),f.get("password"));$("#login-card").hidden=true;$("#dashboard-content").hidden=false;listen();}
 catch(err){toast("Sign-in failed. Check seller email and password.");console.error(err)}
 finally{btn.disabled=false;btn.textContent="Sign in"}
});
function listen(){
 if(unsubscribe)unsubscribe();
 const q=FB.query(FB.collection(FB.db,"orders"),FB.orderBy("createdAtMs","desc"));
 unsubscribe=FB.onSnapshot(q,snap=>{orders=snap.docs.map(d=>({id:d.id,...d.data()}));render();},err=>{console.error(err);toast("Could not load orders. Check Firestore rules.")});
}
function render(){
 const count=s=>orders.filter(o=>o.status===s).length;
 $("#pending-count").textContent=count("Pending");$("#preparing-count").textContent=count("Preparing");$("#completed-count").textContent=count("Completed");
 const shown=orders.filter(o=>filter==="All"||o.status===filter);
 $("#orders-list").innerHTML=shown.length?shown.map(o=>`<article class="order-card"><div class="order-top"><div><div class="order-id">ORDER #${o.id.slice(0,8).toUpperCase()}</div><h3>${esc(o.customerName||"Customer")}</h3></div><span class="status">${esc(o.status||"Pending")}</span></div><div class="order-items">${(o.items||[]).map(i=>`${i.quantity} × ${esc(i.name)} — ${money(i.price*i.quantity)}`).join("<br>")}</div><div class="order-meta">☎ ${esc(o.phone||"No phone")} · ${esc(o.type||"Pickup")}<br>${o.notes?"Note: "+esc(o.notes)+"<br>":""}Placed: ${new Date(o.createdAtMs||Date.now()).toLocaleString()}</div><div class="order-top"><b>${money(o.total)}</b><span class="order-id">${esc(o.status||"Pending")}</span></div><div class="order-actions">${["Pending","Preparing","Ready","Completed","Cancelled"].filter(s=>s!==o.status).map(s=>`<button class="${s==="Preparing"?"primary":""}" data-status="${s}" data-id="${o.id}">Mark ${s}</button>`).join("")}</div></article>`).join(""):'<div class="empty">No orders in this view yet.</div>';
}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
document.querySelectorAll(".filter").forEach(b=>b.onclick=()=>{filter=b.dataset.filter;document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x===b));render()});
document.addEventListener("click",async e=>{const b=e.target.closest("[data-status]");if(!b)return;b.disabled=true;try{await FB.updateDoc(FB.doc(FB.db,"orders",b.dataset.id),{status:b.dataset.status,updatedAt:FB.serverTimestamp()});toast("Order updated: "+b.dataset.status)}catch(err){console.error(err);toast("Could not update order. Check permissions.")}finally{b.disabled=false}});
$("#logout").onclick=async()=>{if(unsubscribe)unsubscribe();await FB.signOut(FB.auth);$("#dashboard-content").hidden=true;$("#login-card").hidden=false;};
