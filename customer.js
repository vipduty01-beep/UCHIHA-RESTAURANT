import * as FB from "./firebase.js";
const menu = [
 {id:"espresso",name:"Espresso",cat:"Coffee",price:2.50,emoji:"☕",desc:"A rich, smooth shot of freshly pulled coffee."},
 {id:"americano",name:"Americano",cat:"Coffee",price:3.00,emoji:"🫖",desc:"Espresso softened with hot water."},
 {id:"latte",name:"Iced Latte",cat:"Coffee",price:4.00,emoji:"🥤",desc:"Double espresso, chilled milk, and ice."},
 {id:"matcha",name:"Matcha Latte",cat:"Tea",price:4.50,emoji:"🍵",desc:"Earthy Japanese matcha with creamy milk."},
 {id:"peachtea",name:"Peach Iced Tea",cat:"Tea",price:3.50,emoji:"🍑",desc:"Black tea, peach, and a refreshing finish."},
 {id:"croissant",name:"Butter Croissant",cat:"Bakery",price:3.00,emoji:"🥐",desc:"Flaky, golden, and baked fresh."},
 {id:"cheesecake",name:"Cheesecake",cat:"Bakery",price:4.50,emoji:"🍰",desc:"Creamy classic cheesecake with a biscuit base."},
 {id:"sandwich",name:"Chicken Sandwich",cat:"Food",price:6.50,emoji:"🥪",desc:"Grilled chicken, crisp greens, and house sauce."},
 {id:"toast",name:"Avocado Toast",cat:"Food",price:5.50,emoji:"🥑",desc:"Smashed avocado on toasted sourdough."}
];
const $=s=>document.querySelector(s), money=n=>"$"+n.toFixed(2);
let cart={}, category="All", customerUid=null;
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2800)}
function renderMenu(){
 const cats=["All",...new Set(menu.map(x=>x.cat))];
 $("#categories").innerHTML=cats.map(c=>`<button class="category ${c===category?"active":""}" data-cat="${c}">${c}</button>`).join("");
 $("#menu-grid").innerHTML=menu.filter(x=>category==="All"||x.cat===category).map(x=>`<article class="menu-card"><div class="food-art"><span>${x.emoji}</span></div><h3>${x.name}</h3><p>${x.desc}</p><div class="card-bottom"><span class="price">${money(x.price)}</span><button class="add-btn" data-add="${x.id}" aria-label="Add ${x.name}">+</button></div></article>`).join("");
}
function totals(){let count=Object.values(cart).reduce((a,b)=>a+b,0),total=menu.reduce((s,x)=>s+x.price*(cart[x.id]||0),0);$("#cart-count").textContent=count;$("#cart-total").textContent=money(total);$("#checkout-total").textContent=money(total);$("#submit-total").textContent=money(total);return {count,total}}
function renderCart(){
 const entries=menu.filter(x=>cart[x.id]);$("#cart-items").innerHTML=entries.length?entries.map(x=>`<div class="cart-row"><div><b>${x.name}</b><div class="muted">${money(x.price)} each</div></div><div class="qty"><button data-minus="${x.id}">−</button><b>${cart[x.id]}</b><button data-plus="${x.id}">+</button></div></div>`).join():'<p class="muted">Your cart is empty. Add something delicious!</p>';totals();
}
document.addEventListener("click",e=>{
 const add=e.target.closest("[data-add]")?.dataset.add, plus=e.target.closest("[data-plus]")?.dataset.plus, minus=e.target.closest("[data-minus]")?.dataset.minus, cat=e.target.closest("[data-cat]")?.dataset.cat;
 if(add){cart[add]=(cart[add]||0)+1;renderCart();toast("Added to your order")}
 if(plus){cart[plus]++;renderCart()} if(minus){cart[minus]--;if(cart[minus]<=0)delete cart[minus];renderCart()}
 if(cat){category=cat;renderMenu()}
});
$("#cart-open").onclick=()=>$("#cart-overlay").classList.add("open");$("#cart-close").onclick=()=>$("#cart-overlay").classList.remove("open");
$("#cart-overlay").addEventListener("click",e=>{if(e.target.id==="cart-overlay")$("#cart-overlay").classList.remove("open")});
$("#checkout-form").addEventListener("submit",async e=>{
 e.preventDefault();const {count,total}=totals();if(!count)return toast("Please add an item first");
 const f=new FormData(e.target), order={customerName:f.get("name").trim(),phone:f.get("phone").trim(),type:f.get("type"),notes:f.get("notes").trim(),items:menu.filter(x=>cart[x.id]).map(x=>({id:x.id,name:x.name,price:x.price,quantity:cart[x.id]})),total,status:"Pending",createdAt:FB.serverTimestamp(),createdAtMs:Date.now(),customerUid};
 const btn=e.target.querySelector("button[type=submit]");btn.disabled=true;btn.textContent="Sending order…";
 try{
  if(!FB.configured)throw new Error("SETUP");
  if(!FB.auth.currentUser){const cred=await FB.signInAnonymously(FB.auth);customerUid=cred.user.uid;order.customerUid=customerUid;}
  const ref=await FB.addDoc(FB.collection(FB.db,"orders"),order);localStorage.setItem("uchiha-last-order",ref.id);
  cart={};renderCart();e.target.reset();$("#cart-overlay").classList.remove("open");toast("Order sent! Your order number is "+ref.id.slice(0,7).toUpperCase());
 }catch(err){console.error(err);toast(err.message==="SETUP"?"Connect Firebase first. See README.":"Could not send order. Check your connection and Firebase setup.");}
 finally{btn.disabled=false;btn.innerHTML='Place order · <span id="submit-total">'+money(total)+'</span>'}
});
$("#year").textContent=new Date().getFullYear();renderMenu();renderCart();
