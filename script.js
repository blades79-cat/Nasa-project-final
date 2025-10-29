const FEED_URL = "https://cdn.jsdelivr.net/gh/GCA-Classroom/apod/data.json";
const USE_NASA_API = false;

const rangeForm = document.getElementById("rangeForm");
const startDateEl = document.getElementById("startDate");
const endDateEl = document.getElementById("endDate");
const statusEl = document.getElementById("status");
const galleryEl = document.getElementById("gallery");
const randomFactEl = document.getElementById("randomFact");
const modalEl = document.getElementById("modal");
const modalMedia = document.getElementById("modalMedia");
const modalTitle = document.getElementById("modalTitle");
const modalDate = document.getElementById("modalDate");
const modalExplanation = document.getElementById("modalExplanation");

const facts = [
  "A day on Venus is longer than a year on Venus.",
  "Neutron stars can spin 600 times per second.",
  "Saturn could float in water.",
  "There are more trees on Earth than stars in the Milky Way.",
  "Astronauts can grow taller in space!"
];
randomFactEl.textContent = facts[Math.floor(Math.random()*facts.length)];

function fmt(d){return new Date(d).toLocaleDateString();}

async function getFeed(){
  const res = await fetch(FEED_URL);
  const data = await res.json();
  return Array.isArray(data)?data:data.results;
}

function renderGallery(items){
  galleryEl.innerHTML="";
  items.forEach(e=>{
    const card=document.createElement("div");
    card.className="card";
    card.innerHTML=`
      <img src="${e.url}" alt="${e.title}">
      <div class="card__body"><h3>${e.title}</h3><p>${fmt(e.date)}</p></div>`;
    card.onclick=()=>openModal(e);
    galleryEl.append(card);
  });
}

function openModal(e){
  modalTitle.textContent=e.title;
  modalDate.textContent=fmt(e.date);
  modalExplanation.textContent=e.explanation;
  modalMedia.innerHTML="";
  if(e.media_type==="video"){
    const v=document.createElement("iframe");
    v.src=e.url.replace("watch?v=","embed/");
    v.allowFullscreen=true;
    modalMedia.append(v);
  }else{
    const img=document.createElement("img");
    img.src=e.url;
    modalMedia.append(img);
  }
  modalEl.setAttribute("aria-hidden","false");
}
modalEl.onclick=(ev)=>{if(ev.target.dataset.closeModal!==undefined||ev.target===modalEl)modalEl.setAttribute("aria-hidden","true");}

rangeForm.onsubmit=async(e)=>{
  e.preventDefault();
  statusEl.textContent="🔄 Loading space photos…";
  const start=new Date(startDateEl.value);
  const end=new Date(endDateEl.value);
  const all=await getFeed();
  const range=all.filter(i=>new Date(i.date)>=start && new Date(i.date)<=end);
  renderGallery(range);
  statusEl.textContent=`Loaded ${range.length} items.`;
};

(()=>{const t=new Date();const w=new Date(t);w.setDate(t.getDate()-6);
startDateEl.value=w.toISOString().slice(0,10);
endDateEl.value=t.toISOString().slice(0,10);})();
