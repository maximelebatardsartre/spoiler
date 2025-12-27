/* =========================
   SPOILER — CINEMA UI v3
   Vanilla JS • localStorage watchlist
   YouTube embed: nocookie + origin + vq=hd1080 (best-effort)
   ========================= */

const STORAGE_KEY = "spoiler_progress_v3";

const EPISODES = [
  { id: 1, title: "Spoiler : j’ai bâclé ma préparation.", youtubeId: "cn0dz1Bmm88",
    line: "Si tu sais pas où tu vas… tu vas rarement aimer où t’arrives.",
    sub: "Préparer = décider avant.",
    takeaways: [
      "Décider avant la négo : objectif, minimum, limites.",
      "Préparer des concessions possibles (et leurs conditions).",
      "Avoir un plan B clair pour ne pas dire “oui” par panique."
    ]
  },
  { id: 2, title: "Spoiler : j’ai rien compris aux besoins du client.", youtubeId: "LHTl_mwueVY",
    line: "Si tu parles plus que ton client, tu vends un PowerPoint.",
    sub: "Écouter avant de vendre.",
    takeaways: [
      "Commencer par des questions, pas par un pitch.",
      "Comprendre le problème réel avant de parler solution.",
      "Faire parler l’autre : contexte, douleur, impact."
    ]
  },
  { id: 3, title: "Spoiler : j’ai cru savoir reformuler.", youtubeId: "6sXdLYOcooc",
    line: "Reformuler, c’est pas répéter. C’est clarifier et vérifier.",
    sub: "Je simplifie, je priorise, je vérifie.",
    takeaways: [
      "Simplifier : trier l’info et aller à l’essentiel.",
      "Prioriser : ce qui est urgent, puis ce qui compte.",
      "Vérifier : “On est d’accord ?” pour aligner les deux parties."
    ]
  },
  { id: 4, title: "Spoiler : j’ai cru faire une vraie découverte.", youtubeId: "XB48xGCeBik",
    line: "Poser des questions, tout le monde sait. Découvrir un vrai problème, c’est un métier.",
    sub: "Problème → impact → enjeu → décision.",
    takeaways: [
      "Arrêter l’interrogatoire “checklist”.",
      "Partir du problème → creuser l’impact → comprendre l’enjeu.",
      "Poser une vraie question : “Qu’est-ce qui vous gêne le plus aujourd’hui ?”"
    ]
  },
  { id: 5, title: "Spoiler : j’ai parlé prix trop tôt.", youtubeId: "algbyw5Q6NA",
    line: "Si tu donnes ton prix trop tôt… tu négocies déjà à genoux.",
    sub: "Prix = cadre + valeur + périmètre.",
    takeaways: [
      "Ne pas donner un prix brut à froid (surtout face à un acheteur).",
      "Cadrer : fourchette + 2 questions de périmètre.",
      "Reconnecter le prix à la valeur et aux conditions."
    ]
  },
  { id: 6, title: "Spoiler : j’ai pris les objections comme des attaques.", youtubeId: "IFsFFF6wYmY",
    line: "Une objection, c’est une demande d’explication. Pas une attaque.",
    sub: "Objection = porte, pas mur.",
    takeaways: [
      "Rester calme : l’objection est un test.",
      "Clarifier : “Quand vous dites ‘cher’, vous comparez à quoi ?”",
      "Comprendre avant de défendre."
    ]
  },
  { id: 7, title: "Spoiler : j’ai fait des concessions sans négocier.", youtubeId: "CAV2cZj-whA",
    line: "Une concession, tu la vends. Sinon c’est un cadeau pour un inconnu.",
    sub: "Concession = échange. Toujours.",
    takeaways: [
      "Ne jamais concéder sans obtenir quelque chose en échange.",
      "Remplacer “oui” par “oui… si” (condition claire).",
      "Échanger contre : engagement, délai, volume, témoignage…"
    ]
  },
  { id: 8, title: "Spoiler : j’ai découvert le pouvoir du silence.", youtubeId: "uPKV36rRfz0",
    line: "Le silence, c’est pas un vide. C’est un outil.",
    sub: "Silence = contrôle.",
    takeaways: [
      "Poser une question… puis se taire.",
      "Laisser l’autre respirer, réfléchir, parler.",
      "Celui qui tient le silence tient le rythme."
    ]
  },
  { id: 9, title: "Spoiler : j’ai négocié avec un acheteur.", youtubeId: "oA6roBkWob8",
    line: "Si tu cadres, il respecte. Si tu donnes trop, il prend tout.",
    sub: "Acheteur = pro. Cadre = respect.",
    takeaways: [
      "Un acheteur teste : ancrage, silence, demandes extrêmes.",
      "Cadrer : objectif + conditions + durée/volume.",
      "Toute concession doit acheter un engagement concret."
    ]
  },
];

// DOM helpers
const $ = (s) => document.querySelector(s);

const views = {
  intro: $("#viewIntro"),
  player: $("#viewPlayer"),
  done: $("#viewDone"),
};

const btnHome = $("#btnHome");
const btnReset = $("#btnReset");

const btnStart = $("#btnStart");
const btnResume = $("#btnResume");

const teaserList = $("#teaserList");
const episodeList = $("#episodeList");
const doneEpisodeGrid = $("#doneEpisodeGrid");

const stageEp = $("#stageEp");
const stageTitle = $("#stageTitle");
const stageLine = $("#stageLine");

const player = $("#player");
const playerOverlay = $("#playerOverlay");
const btnOpenYoutube = $("#btnOpenYoutube");

const takeawaysList = $("#takeawaysList");
const watchedBadge = $("#watchedBadge");

const btnPrev = $("#btnPrev");
const btnNext = $("#btnNext");
const btnNextCta = $("#btnNextCta");
const btnMarkWatched = $("#btnMarkWatched");
const btnFocus = $("#btnFocus");

const btnEpisodes = $("#btnEpisodes");
const btnCloseRail = $("#btnCloseRail");
const railStatus = $("#railStatus");

const progressBar = $("#progressBar");
const progressText = $("#progressText");
const progressPct = $("#progressPct");

const btnRewatch = $("#btnRewatch");
const btnBackHome = $("#btnBackHome");
const doneProgress = $("#doneProgress");

const toast = $("#toast");

const floaters = $("#floaters");

// State
let state = loadState();
let currentEpId = clampEpId(state.lastEpisodeId ?? 1);

/* =========================
   Storage
   ========================= */
function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return { watched: {}, lastEpisodeId: null };
    const parsed = JSON.parse(raw);
    return {
      watched: parsed?.watched || {},
      lastEpisodeId: parsed?.lastEpisodeId ?? null,
    };
  } catch {
    return { watched: {}, lastEpisodeId: null };
  }
}
function saveState(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

function resetState(){
  state = { watched: {}, lastEpisodeId: null };
  saveState();
  currentEpId = 1;
  updateAllUI();
  routeTo("intro");
  showToast("Progression réinitialisée.");
}

/* =========================
   Helpers
   ========================= */
function clampEpId(n){
  const num = Number(n);
  if(Number.isNaN(num)) return 1;
  return Math.min(Math.max(1, num), EPISODES.length);
}
function getEpisodeById(id){
  return EPISODES.find(e => e.id === id) || EPISODES[0];
}
function watchedCount(){
  return Object.values(state.watched).filter(Boolean).length;
}
function allWatched(){
  return watchedCount() === EPISODES.length;
}
function percentWatched(){
  return Math.round((watchedCount() / EPISODES.length) * 100);
}
function showToast(msg){
  toast.textContent = msg;
  toast.classList.add("toast--show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("toast--show"), 1700);
}

/* =========================
   Routing + views
   ========================= */
function setView(name){
  Object.values(views).forEach(v => v.classList.remove("view--active"));
  views[name].classList.add("view--active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function routeTo(view, opts = { pushHash: true }){
  setView(view);
  if(opts.pushHash){
    if(view === "intro") location.hash = "#intro";
    if(view === "player") location.hash = `#ep/${currentEpId}`;
    if(view === "done") location.hash = "#done";
  }
  if(view !== "player"){
    document.body.classList.remove("focus");
    document.body.classList.remove("railOpen");
  }
  updateResumeButton();
}

function routeFromHash(){
  const h = (location.hash || "#intro").replace("#", "");
  if(h.startsWith("ep/")){
    const id = clampEpId(h.split("/")[1]);
    openEpisode(id, { pushHash: false });
    return;
  }
  if(h === "done"){
    routeTo("done", { pushHash: false });
    return;
  }
  routeTo("intro", { pushHash: false });
}

/* =========================
   UI building
   ========================= */
function updateResumeButton(){
  const ok = state.lastEpisodeId && state.lastEpisodeId >= 1;
  btnResume.disabled = !ok;
  btnResume.textContent = ok ? `Reprendre — EP ${state.lastEpisodeId}` : "Reprendre";
}

function buildTeasers(){
  teaserList.innerHTML = "";
  EPISODES.forEach(ep => {
    const el = document.createElement("div");
    el.className = "teaser";
    el.innerHTML = `
      <div class="teaser__n">${ep.id}</div>
      <div>
        <div class="teaser__t">${escapeHtml(ep.title)}</div>
        <div class="teaser__s">${escapeHtml(ep.sub)}</div>
      </div>
    `;
    el.addEventListener("click", () => openEpisode(ep.id));
    teaserList.appendChild(el);
  });
}

function buildEpisodeList(){
  episodeList.innerHTML = "";
  EPISODES.forEach(ep => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "epItem";
    btn.dataset.ep = String(ep.id);
    btn.innerHTML = `
      <div class="epNum">${ep.id}</div>
      <div class="epMain">
        <div class="epTitle">${escapeHtml(ep.title)}</div>
        <div class="epSub">${escapeHtml(ep.sub)}</div>
      </div>
      <div class="epCheck ${state.watched[ep.id] ? "epCheck--on" : ""}">
        ${checkSvg()}
      </div>
    `;
    btn.addEventListener("click", () => {
      openEpisode(ep.id);
      document.body.classList.remove("railOpen");
    });
    episodeList.appendChild(btn);
  });
}

function buildDoneGrid(){
  doneEpisodeGrid.innerHTML = "";
  EPISODES.forEach(ep => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "epItem";
    btn.innerHTML = `
      <div class="epNum">${ep.id}</div>
      <div class="epMain">
        <div class="epTitle">${escapeHtml(ep.title)}</div>
        <div class="epSub">Revoir • ${escapeHtml(ep.sub)}</div>
      </div>
      <div class="epCheck epCheck--on">${checkSvg()}</div>
    `;
    btn.addEventListener("click", () => openEpisode(ep.id));
    doneEpisodeGrid.appendChild(btn);
  });
}

function updateProgress(){
  const c = watchedCount();
  const pct = percentWatched();
  progressBar.style.width = `${pct}%`;
  progressText.textContent = `${c}/${EPISODES.length}`;
  progressPct.textContent = `${pct}%`;
  railStatus.textContent = allWatched() ? "Terminé" : (c === 0 ? "Départ" : "En cours");
  doneProgress.textContent = `${c}/${EPISODES.length} • ${pct}%`;
}

function updateActiveRail(){
  [...episodeList.querySelectorAll(".epItem")].forEach(el => {
    const id = Number(el.dataset.ep);
    el.classList.toggle("epItem--active", id === currentEpId);
    const check = el.querySelector(".epCheck");
    check?.classList.toggle("epCheck--on", !!state.watched[id]);
  });
}

function updateStage(ep){
  stageEp.textContent = `EP ${ep.id}`;
  stageTitle.textContent = ep.title;
  stageLine.textContent = ep.line;

  takeawaysList.innerHTML = "";
  ep.takeaways.forEach(t => {
    const li = document.createElement("li");
    li.textContent = t;
    takeawaysList.appendChild(li);
  });

  watchedBadge.innerHTML = "";
  const b = document.createElement("span");
  b.className = "badge";
  b.innerHTML = `<span class="badgeDot"></span>${state.watched[ep.id] ? "Vu" : "Pas encore vu"}`;
  watchedBadge.appendChild(b);

  btnMarkWatched.textContent = state.watched[ep.id] ? "Marquer comme “non vu”" : "Marquer comme “vu”";
}

/* =========================
   Player embed
   ========================= */
function updatePlayer(ep){
  // best-effort: ask HD; YouTube may still adapt
  const origin = encodeURIComponent(window.location.origin);

  // vq is best-effort, not guaranteed
  const src =
    `https://www.youtube-nocookie.com/embed/${ep.youtubeId}` +
    `?rel=0&modestbranding=1&controls=1&playsinline=1` +
    `&origin=${origin}` +
    `&vq=hd1080`;

  player.innerHTML = `
    <iframe
      src="${src}"
      title="Lecture ${escapeAttr(ep.title)}"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen
      referrerpolicy="strict-origin-when-cross-origin"
    ></iframe>
  `;

  btnOpenYoutube.href = `https://youtu.be/${ep.youtubeId}`;
}

function cinematicBeat(){
  playerOverlay.classList.add("playerOverlay--show");
  setTimeout(() => playerOverlay.classList.remove("playerOverlay--show"), 620);
}

/* =========================
   Actions
   ========================= */
function openEpisode(id, { pushHash = true } = {}){
  currentEpId = clampEpId(id);
  const ep = getEpisodeById(currentEpId);

  state.lastEpisodeId = currentEpId;
  saveState();

  routeTo("player", { pushHash: false });
  updateStage(ep);
  updatePlayer(ep);
  updateProgress();
  updateActiveRail();

  if(pushHash) location.hash = `#ep/${currentEpId}`;

  cinematicBeat();
}

function markWatchedToggle(){
  const id = currentEpId;
  state.watched[id] = !state.watched[id];
  state.lastEpisodeId = id;
  saveState();

  updateProgress();
  buildEpisodeList();
  updateActiveRail();
  updateStage(getEpisodeById(id));

  showToast(state.watched[id] ? `EP ${id} marqué “vu”.` : `EP ${id} marqué “non vu”.`);

  if(allWatched()){
    setTimeout(() => routeTo("done"), 520);
  }
}

function nextEpisode(){
  if(currentEpId < EPISODES.length) return openEpisode(currentEpId + 1);
  if(allWatched()) return routeTo("done");
  showToast("Dernier épisode. Coche tout “vu” pour débloquer la fin.");
}

function prevEpisode(){
  if(currentEpId > 1) return openEpisode(currentEpId - 1);
  showToast("Déjà au début.");
}

function toggleFocus(){
  document.body.classList.toggle("focus");
  showToast(document.body.classList.contains("focus") ? "Focus ON" : "Focus OFF");
}

/* =========================
   Floaters (animated keywords)
   ========================= */
const FLOATER_WORDS = [
  "CADRE", "SILENCE", "OUI… SI", "CONCESSION", "ÉCHANGE", "VALEUR", "OBJECTION", "ANCRAGE", "DÉCOUVERTE"
];

function spawnFloater(){
  const el = document.createElement("div");
  el.className = "floater";
  const w = FLOATER_WORDS[Math.floor(Math.random() * FLOATER_WORDS.length)];
  el.innerHTML = `<b>${w}</b>`;

  const x = Math.random() * 100;
  const y = 85 + Math.random() * 10; // start lower
  el.style.left = `${x}%`;
  el.style.top = `${y}%`;

  const dur = 9 + Math.random() * 6;
  el.style.animationDuration = `${dur}s`;

  floaters.appendChild(el);
  setTimeout(() => el.remove(), (dur + 0.5) * 1000);
}

function startFloaters(){
  // low intensity
  spawnFloater();
  setInterval(() => {
    // fewer on mobile
    const isMobile = window.matchMedia("(max-width: 980px)").matches;
    if(isMobile && Math.random() < 0.5) return;
    spawnFloater();
  }, 1400);
}

/* =========================
   Utils
   ========================= */
function escapeHtml(str){
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
function escapeAttr(str){ return escapeHtml(str); }
function checkSvg(){
  return `
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 7L10 17l-5-5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"></path>
    </svg>
  `;
}

/* =========================
   Events
   ========================= */
btnHome.addEventListener("click", () => routeTo("intro"));
btnReset.addEventListener("click", resetState);

btnStart.addEventListener("click", () => openEpisode(1));
btnResume.addEventListener("click", () => openEpisode(state.lastEpisodeId || 1));

btnPrev.addEventListener("click", prevEpisode);
btnNext.addEventListener("click", nextEpisode);
btnNextCta.addEventListener("click", nextEpisode);
btnMarkWatched.addEventListener("click", markWatchedToggle);

btnFocus.addEventListener("click", toggleFocus);

btnEpisodes.addEventListener("click", () => document.body.classList.toggle("railOpen"));
btnCloseRail.addEventListener("click", () => document.body.classList.remove("railOpen"));

btnRewatch.addEventListener("click", () => routeTo("done"));
btnBackHome.addEventListener("click", () => routeTo("intro"));

window.addEventListener("hashchange", routeFromHash);

document.addEventListener("keydown", (e) => {
  const view = document.querySelector(".view--active")?.dataset.view || "intro";

  if(view === "intro"){
    if(e.key === "Enter") openEpisode(state.lastEpisodeId || 1);
    return;
  }

  if(view === "player"){
    if(e.key === "ArrowRight") nextEpisode();
    if(e.key === "ArrowLeft") prevEpisode();
    if(e.key.toLowerCase() === "n") nextEpisode();
    if(e.key.toLowerCase() === "m") markWatchedToggle();
    if(e.key.toLowerCase() === "f") toggleFocus();
    if(e.key === "Escape"){
      document.body.classList.remove("focus");
      document.body.classList.remove("railOpen");
    }
  }

  if(view === "done"){
    if(e.key === "Escape") routeTo("intro");
  }
});

/* =========================
   Init
   ========================= */
function updateAllUI(){
  buildTeasers();
  buildEpisodeList();
  buildDoneGrid();
  updateProgress();
  updateResumeButton();
}
function init(){
  updateAllUI();
  startFloaters();

  if(allWatched()){
    routeTo("done", { pushHash: false });
    location.hash = "#done";
  } else {
    routeFromHash();
    if(!location.hash) location.hash = "#intro";
  }
}
init();
