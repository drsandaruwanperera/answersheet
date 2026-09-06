import { db } from "../firebase.js";
import { collection, addDoc, deleteDoc, doc, onSnapshot, orderBy, query, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const script=document.currentScript;
const cfg=JSON.parse(script.dataset.config);
const fields=cfg.fields;
const form=document.getElementById("form"), list=document.getElementById("list"), msg=document.getElementById("msg"), resetBtn=document.getElementById("resetBtn"), formTitle=document.getElementById("formTitle");
let editingId=null;
const val=(key,type)=>{const el=document.getElementById("f_"+key); return type==="checkbox"?el.checked:el.value.trim()};
function setMsg(t,error=false){msg.textContent=t;msg.style.color=error?"#c73555":"#4037c9"}
function clearForm(){editingId=null;form.reset();formTitle.textContent="Add "+cfg.title;setMsg("")}
function fill(id,data){editingId=id;for(const f of fields){const el=document.getElementById("f_"+f.key); if(f.type==="checkbox") el.checked=data[f.key]===true; else el.value=data[f.key]??"";}formTitle.textContent="Edit "+cfg.title;window.scrollTo({top:0,behavior:"smooth"})}
function esc(s){return String(s??"").replace(/[&<>"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[m]))}
function render(items){if(!items.length){list.innerHTML='<div class="empty">No items saved yet.</div>';return}list.innerHTML=items.map(({id,data})=>{const title=data.title||data.question||data.name||data.label||data.siteTitle||id;const details=Object.entries(data).filter(([k])=>!['updatedAt','createdAt','enabled','order'].includes(k)).slice(0,4).map(([k,v])=>`<b>${esc(k)}:</b> ${esc(v)}`).join("<br>");return `<article class="item"><div class="item-head"><div><h3>${esc(title)}</h3><div class="meta">${details}</div></div><div class="actions"><button class="btn secondary" data-edit="${id}">Edit</button><button class="btn danger" data-delete="${id}">Delete</button></div></div></article>`}).join("");list.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>{const x=items.find(i=>i.id===b.dataset.edit);if(x)fill(x.id,x.data)});list.querySelectorAll('[data-delete]').forEach(b=>b.onclick=async()=>{if(!confirm("Delete this item?"))return;try{await deleteDoc(doc(db,cfg.collection,b.dataset.delete));setMsg("Deleted.")}catch(e){setMsg(e.message,true)}})}

const q=query(collection(db,cfg.collection),orderBy("order"));
onSnapshot(q,s=>render(s.docs.map(d=>({id:d.id,data:d.data()}))),e=>{const fallback=collection(db,cfg.collection);onSnapshot(fallback,s=>render(s.docs.map(d=>({id:d.id,data:d.data()}))),err=>setMsg(err.message,true));});
form.addEventListener("submit",async e=>{e.preventDefault();setMsg("Saving…");try{const data={};for(const f of fields)data[f.key]=val(f.key,f.type);data.updatedAt=serverTimestamp();if(editingId)await updateDoc(doc(db,cfg.collection,editingId),data);else{data.createdAt=serverTimestamp();await addDoc(collection(db,cfg.collection),data)}clearForm();setMsg("Saved successfully.")}catch(err){setMsg(err.message,true)}});resetBtn.onclick=clearForm;
