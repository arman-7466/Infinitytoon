/* Infinitytoonshub: rotating featured anime, genre/A-Z filters, episode cards and ambient glow */
(() => {
  "use strict";
  const API = "https://graphql.anilist.co";
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const params = new URLSearchParams(location.search);
  const animeParam = params.get("anime") || "";
  const posterParam = params.get("poster") || "";
  const genres = ["Action","Adventure","Comedy","Drama","Fantasy","Horror","Mystery","Romance","Sci-Fi","Slice of Life","Sports","Supernatural","Thriller"];
  const esc = v => String(v ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);
  
  async function api(query, variables={}) {
    const r = await fetch(API,{method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json"},body:JSON.stringify({query,variables})});
    if(!r.ok) throw new Error("AniList request failed: "+r.status);
    const j=await r.json(); if(j.errors?.length) throw new Error(j.errors[0].message); return j.data;
  }
  
  function hueFor(text) { let n=0; for(const c of text) n=(n*31+c.charCodeAt(0))%360; return `hsl(${n} 82% 62%)`; }

  function setupCatalogTools() {
    const container=$("#mixed-container"); if(!container || $("#catalog-tools")) return;
    const section=document.createElement("section"); section.id="catalog-tools";
    section.innerHTML=`<div class="catalog-heading"><h2>Find Your Anime</h2><p>Genre se filter karo ya A–Z letters se anime browse karo.</p></div>
      <div class="genre-chips" id="genreChips"><button class="genre-chip active" data-genre="ALL">All Genres</button>${genres.map(g=>`<button class="genre-chip" data-genre="${esc(g)}">${esc(g)}</button>`).join("")}</div>
      <div class="az-section"><div class="az-title">Browse A–Z <span id="azCount"></span></div><div class="az-list" id="azList"></div></div><p class="genre-status" id="genreStatus" aria-live="polite"></p>`;
    container.insertAdjacentElement("beforebegin",section);
    $("#genreChips").addEventListener("click",e=>{
      const b=e.target.closest("[data-genre]"); if(!b)return;
      $$(".genre-chip",section).forEach(x=>x.classList.toggle("active",x===b));
      const g=b.dataset.genre.toLowerCase();
      $$(".anilist-card").forEach(c=>{const list=(c.dataset.genres||"").toLowerCase().split("|");c.hidden=g!=="all"&&!list.includes(g);});
      $("#genreStatus").textContent=g==="all"?"":`Showing genre: ${b.dataset.genre}`; drawLetters();
    });
    drawLetters();
  }

  function drawLetters() {
    const list=$("#azList"); if(!list)return;
    const cards=$$(".anilist-card").filter(c=>!c.hidden), counts={};
    cards.forEach(c=>{const t=(c.dataset.title||$(".card-title",c)?.textContent||"").trim().toUpperCase();const l=/^[A-Z]/.test(t)?t[0]:"#";counts[l]=(counts[l]||0)+1;});
    list.innerHTML=["#",..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"].map(l=>`<button class="az-chip ${counts[l]?"":"empty"}" data-letter="${l}" ${counts[l]?"":"disabled"}>${l}<small>${counts[l]||0}</small></button>`).join("");
    const count=$("#azCount");if(count)count.textContent=`(${cards.length} loaded)`;
    list.onclick=e=>{const b=e.target.closest("[data-letter]");if(!b)return;$$(".az-chip",list).forEach(x=>x.classList.toggle("active",x===b));const l=b.dataset.letter;cards.forEach(c=>{const t=(c.dataset.title||$(".card-title",c)?.textContent||"").trim().toUpperCase();c.hidden=l==="#"?/^[A-Z]/.test(t):!t.startsWith(l);});};
  }

  function decorateCards() {
    $$(".anilist-card").forEach(c=>{
      const title=c.dataset.title||$(".card-title",c)?.textContent||"Anime";const img=$("img",c);const poster=img?.currentSrc||img?.src||"";
      const u=new URL("episodes.html",location.href);u.searchParams.set("anime",title);if(poster)u.searchParams.set("poster",poster);c.href=u.href;c.target="_self";
      const info=$(".card-info",c), list=(c.dataset.genres||"").split("|").filter(Boolean);
      if(info&&list.length&&!$(".card-genres",info))info.insertAdjacentHTML("beforeend",`<div class="card-genres">${list.slice(0,3).map(g=>`<span>${esc(g)}</span>`).join("")}</div>`);
    });drawLetters();
  }

  async function addGenreMetadata() {
    const grid=$("#anilist-results-grid");if(!grid)return;
    try {
      const d=await api(`query { Page(page:1,perPage:24){ media(type:ANIME,sort:POPULARITY_DESC){ title{english romaji} genres bannerImage episodes coverImage{large extraLarge} } } }`);
      const m=new Map(d.Page.media.map(a=>[(a.title.english||a.title.romaji||"").toLowerCase(),a]));
      $$(".anilist-card",grid).forEach(c=>{const a=m.get((c.dataset.title||"").toLowerCase());if(a){c.dataset.genres=(a.genres||[]).join("|");c.dataset.episodes=a.episodes||0;c.dataset.banner=a.bannerImage||"";}});
      decorateCards();
    }catch(e){console.warn("Genre metadata unavailable",e);decorateCards();}
  }

  function setupRotatingHero() {
    const hero=$(".hero-banner");if(!hero||hero.dataset.featuredReady)return;hero.dataset.featuredReady="1";
    const video=$("video.hero-video",hero);if(video)video.style.opacity=".18";
    hero.classList.add("auto-featured-hero");const content=$(".hero-content",hero);if(!content)return;
    if(!$(".featured-dynamic-tag",content)){const tag=document.createElement("span");tag.className="featured-dynamic-tag";tag.textContent="FEATURED ANIME";content.prepend(tag);}
    let list=[],i=0;
    const show=a=>{if(!a)return;const title=a.title?.english||a.title?.romaji||"Anime Universe";const image=a.bannerImage||a.coverImage?.extraLarge||a.coverImage?.large||"";
      if(image)hero.style.backgroundImage=`linear-gradient(90deg,rgba(5,2,12,.92),rgba(5,2,12,.3)),url("${image}")`;
      const h=$(".hero-content h1",hero),p=$(".hero-content p",hero),tag=$(".featured-dynamic-tag",hero);if(h)h.textContent=title;if(p)p.textContent=(a.genres||[]).slice(0,4).join(" • ")||"Discover your next anime.";if(tag)tag.textContent=a.format==="MOVIE"?"FEATURED ANIME MOVIE":"FEATURED ANIME";
      const go=()=>{const u=new URL("episodes.html",location.href);u.searchParams.set("anime",title);const poster=a.coverImage?.extraLarge||a.coverImage?.large;if(poster)u.searchParams.set("poster",poster);location.href=u.href;};const play=$(".btn-glass-play",hero),info=$(".btn-glass-info",hero);if(play)play.onclick=go;if(info)info.onclick=go;
    };
    api(`query { Page(page:1,perPage:12){ media(type:ANIME,sort:POPULARITY_DESC){ format genres bannerImage title{english romaji} coverImage{large extraLarge} } } }`).then(d=>{list=d.Page.media.filter(a=>a.bannerImage||a.coverImage?.large);if(!list.length)return;show(list[0]);if(list.length>1)setInterval(()=>{i=(i+1)%list.length;show(list[i]);},9000);}).catch(e=>console.warn("Featured carousel unavailable",e));
  }

  async function setupEpisodePage() {
    const grid=$("#episode-list-container");if(!grid)return;
    const title=animeParam||"Anime Episodes",bg=$("#pageBackground"),hero=$(".hero-banner");
    if($("#pageTitle"))$("#pageTitle").textContent=title;
    if($("#subHeading"))$("#subHeading").textContent=`${title} — Episodes`;
    if(posterParam&&bg)bg.style.backgroundImage=`url("${posterParam.replace(/["\\]/g,"")}")`;
    document.documentElement.style.setProperty("--anime-glow",hueFor(title));
    if(hero&&posterParam)hero.style.backgroundImage=`linear-gradient(90deg,rgba(5,2,12,.9),rgba(5,2,12,.25)),url("${posterParam.replace(/["\\]/g,"")}")`;
    grid.innerHTML='<p class="episode-loading">Loading episode information…</p>';
    try {
      const d=await api(`query($search:String){Media(search:$search,type:ANIME){episodes genres bannerImage title{english romaji} coverImage{large extraLarge}}}`,{search:title});
      const a=d.Media;
      const real=a?.title?.english||a?.title?.romaji||title,total=Math.min(Number(a?.episodes)||0,300),poster=posterParam||a?.coverImage?.extraLarge||a?.coverImage?.large||"";
      if($("#pageTitle"))$("#pageTitle").textContent=real;
      if($("#animeNameText"))$("#animeNameText").textContent=real;
      if($("#subHeading"))$("#subHeading").textContent=`${real} — ${total?total+" episodes":"Episode guide"}`;
      if(bg&&poster)bg.style.backgroundImage=`url("${poster}")`;
      if(hero&&(a?.bannerImage||poster))hero.style.backgroundImage=`linear-gradient(90deg,rgba(5,2,12,.9),rgba(5,2,12,.25)),url("${a?.bannerImage||poster}")`;
      if(!total){grid.innerHTML=`<div class="episode-empty"><h3>${esc(real)}</h3><p>Is title ka episode count available nahi hai.</p></div>`;return;}
      grid.innerHTML=Array.from({length:total},(_,n)=>{const ep=n+1,u=new URL("watch.html",location.href);u.searchParams.set("anime",real);u.searchParams.set("episode",ep);u.searchParams.set("poster",poster);u.searchParams.set("total",total);return `<a class="premium-card episode-anime-card" href="${esc(u.href)}"><div class="episode-thumb" style="background-image:linear-gradient(0deg,rgba(0,0,0,.8),rgba(0,0,0,.05)),url('${esc(poster)}')"><span class="episode-play"><i class="fas fa-play"></i></span><span class="episode-number">EPISODE ${ep}</span></div><div class="card-info"><h3 class="card-title">${esc(real)} — Episode ${ep}</h3><p class="episode-description">${esc((a?.genres||[]).slice(0,2).join(" • "))}</p></div></a>`;}).join("");
    }catch(e){console.error(e);grid.innerHTML='<div class="episode-empty"><h3>Episodes load nahi hue</h3><p>Internet connection check karein.</p></div>';}
  }

  function init() {
      setupCatalogTools();
      setupRotatingHero();
      setupEpisodePage();
      decorateCards();
      
      const grid = $("#anilist-results-grid");
      if(grid) {
          let refreshTimer;
          const obs = new MutationObserver(() => {
              clearTimeout(refreshTimer);
              refreshTimer = setTimeout(() => { decorateCards(); }, 120);
          });
          obs.observe(grid, {childList: true, subtree: true});
          setTimeout(decorateCards, 900);
      }
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", init); else init();
})();