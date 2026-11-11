/* ==========================================
   INFINITYTOONS - COMPLETE FINAL JAVASCRIPT ENGINE
   ========================================== */

(() => {
    "use strict";

    const ANILIST_URL = "https://graphql.anilist.co";
    const JIKAN_URL = "https://api.jikan.moe/v4";
    const KITSU_URL = "https://kitsu.io/api/edge";
    const PER_PAGE = 24;

    let currentPage = 1;
    let currentSearch = "";
    let loading = false;
    let hasNextPage = true;
    let requestId = 0;
    let searchTimer;
    
    window.currentAnimeData = null;
    window.currentEpNumber = 1;

    const localTitles = () => {
        if (typeof allAnimeData === "undefined") return [];
        return allAnimeData.map(a => String(a.title || "").toLowerCase());
    };

    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, ch => ({
            "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
        })[ch]);
    }

    function getFormat() {
        const container = document.getElementById("mixed-container");
        const filter = (container?.dataset.filter || "").toUpperCase();
        const page = location.pathname.toLowerCase();

        if (filter === "MOVIE" || page.includes("movies")) return "MOVIE";
        if (filter === "SERIES" || page.includes("series")) return "TV";
        return null;
    }

    // 1. AniList Fetcher
    async function fetchAnilist(page, search, format, id) {
        try {
            const query = `
                query ($page: Int, $perPage: Int, $search: String, $format: MediaFormat) {
                    Page(page: $page, perPage: $perPage) {
                        pageInfo { currentPage hasNextPage }
                        media(search: $search, type: ANIME, format: $format, sort: POPULARITY_DESC) {
                            id siteUrl format
                            title { romaji english native }
                            coverImage { large extraLarge }
                        }
                    }
                }
            `;
            const response = await fetch(ANILIST_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify({ query, variables: { page, perPage: PER_PAGE, search: search || null, format: format || null } })
            });
            if (!response.ok) return null;
            const result = await response.json();
            if (id !== requestId) return null;
            return result.data?.Page;
        } catch (e) {
            return null;
        }
    }

    // 2. Jikan Fetcher
    async function fetchJikan(search, page) {
        try {
            let url = `${JIKAN_URL}/anime?page=${page}&limit=10`;
            if (search) url += `&q=${encodeURIComponent(search)}`;
            else url += `&order_by=popularity&sort=asc`;

            const res = await fetch(url);
            if (!res.ok) return [];
            const data = await res.json();
            
            return (data.data || []).map(item => ({
                id: item.mal_id,
                siteUrl: item.url,
                format: item.type === "Movie" ? "MOVIE" : "TV",
                title: {
                    romaji: item.title_japanese || item.title,
                    english: item.title_english || item.title,
                    native: item.title
                },
                coverImage: {
                    large: item.images?.jpg?.large_image_url || item.images?.jpg?.image_url,
                    extraLarge: item.images?.jpg?.large_image_url || item.images?.jpg?.image_url
                }
            }));
        } catch (e) {
            return [];
        }
    }

    // 3. Kitsu Fetcher
    async function fetchKitsu(search) {
        try {
            let url = `${KITSU_URL}/anime?page[limit]=10`;
            if (search) url += `&filter[text]=${encodeURIComponent(search)}`;

            const res = await fetch(url);
            if (!res.ok) return [];
            const data = await res.json();

            return (data.data || []).map(item => ({
                id: item.id,
                siteUrl: `https://kitsu.io/anime/${item.id}`,
                format: item.attributes?.subtype === "movie" ? "MOVIE" : "TV",
                title: {
                    romaji: item.attributes?.canonicalTitle,
                    english: item.attributes?.titles?.en || item.attributes?.canonicalTitle,
                    native: item.attributes?.titles?.ja_jp || ""
                },
                coverImage: {
                    large: item.attributes?.posterImage?.large || item.attributes?.posterImage?.original,
                    extraLarge: item.attributes?.posterImage?.original || item.attributes?.posterImage?.large
                }
            }));
        } catch (e) {
            return [];
        }
    }

    // 4. Pure Anime Top 10 Using AniList GraphQL
    async function loadTopRatedAnime() {
        const topContainer = document.querySelector(".top-rated-container");
        if (!topContainer) return;

        try {
            const query = `
                query {
                    Page(page: 1, perPage: 10) {
                        media(type: ANIME, sort: SCORE_DESC) {
                            id
                            siteUrl
                            title { romaji english }
                            coverImage { extraLarge large }
                        }
                    }
                }
            `;
            const response = await fetch(ANILIST_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify({ query })
            });
            const result = await response.json();
            const mediaList = result?.data?.Page?.media || [];

            if (mediaList.length > 0) {
                topContainer.innerHTML = mediaList.map((item, index) => {
                    const title = item.title.english || item.title.romaji || "Top Rated";
                    const poster = item.coverImage?.extraLarge || item.coverImage?.large || "";
                    const rank = index + 1;
                    return `
                        <a href="watch.html?anime=${encodeURIComponent(title)}&episode=1" class="top-card">
                            <div class="rank-number">${rank}</div>
                            <div class="top-img-box">
                                <img src="${escapeHTML(poster)}" alt="${escapeHTML(title)}" loading="lazy">
                            </div>
                        </a>
                    `;
                }).join("");
            }
        } catch (e) {
            console.error("Top Rated Anime load error:", e);
        }
    }

    // 5. Super-Fast Combined Aggregator
    async function fetchAnimeCombined(page, search, format, id) {
        if (!search) {
            const anilistData = await fetchAnilist(page, search, format, id);
            return {
                media: anilistData?.media || [],
                pageInfo: anilistData?.pageInfo || { currentPage: page, hasNextPage: false }
            };
        }

        const primaryResults = await Promise.all([
            fetchAnilist(page, search, format, id),
            fetchJikan(search, page),
            fetchKitsu(search)
        ]);

        const anilistMedia = primaryResults[0]?.media || [];
        const jikanMedia = primaryResults[1] || [];
        const kitsuMedia = primaryResults[2] || [];
        
        let mediaList = [...anilistMedia, ...jikanMedia, ...kitsuMedia];
        let hasNext = primaryResults[0]?.pageInfo?.hasNextPage || false;

        const uniqueMap = new Map();
        mediaList.forEach(item => {
            const titleKey = (item.title?.english || item.title?.romaji || "").toLowerCase().trim();
            if (titleKey && !uniqueMap.has(titleKey)) {
                uniqueMap.set(titleKey, item);
            }
        });

        return {
            media: Array.from(uniqueMap.values()),
            pageInfo: { currentPage: page, hasNextPage: hasNext }
        };
    }

    function createCard(anime) {
        const title = anime.title?.english || anime.title?.romaji || anime.title?.native || "Unknown Anime";
        const image = anime.coverImage?.extraLarge || anime.coverImage?.large || "";
        const href = `watch.html?anime=${encodeURIComponent(title)}&episode=1`;

        return `
            <a href="${escapeHTML(href)}" class="premium-card search-item anilist-card" data-title="${escapeHTML(title.toLowerCase())}">
                <div class="card-img-wrapper">
                    <img src="${escapeHTML(image)}" alt="${escapeHTML(title)}" class="card-img" loading="lazy" onerror="this.style.visibility='hidden'">
                    <div class="card-badges"><span class="badge sub">${anime.format === "MOVIE" ? "MOVIE" : "SERIES"}</span></div>
                    <div class="play-overlay"><i class="fas fa-play"></i></div>
                </div>
                <div class="card-info"><h3 class="card-title">${escapeHTML(title)}</h3></div>
            </a>
        `;
    }

    function showStatus(message) {
        const status = document.getElementById("anilist-status");
        if (status) status.textContent = message;
    }

    async function loadAnime(reset = false) {
        if (loading) return;
        const grid = document.getElementById("anilist-results-grid") || document.getElementById("mixed-container");
        const moreButton = document.getElementById("anilist-load-more");
        if (!grid) return;

        if (reset) {
            currentPage = 1;
            hasNextPage = true;
            grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: #bcaed4; padding: 20px;">Searching instantly...</div>`;
        }

        if (!hasNextPage && !reset) return;
        loading = true;
        const id = ++requestId;
        if (moreButton) moreButton.disabled = true;

        try {
            const data = await fetchAnimeCombined(currentPage, currentSearch, getFormat(), id);
            if (!data || id !== requestId) return;

            if (reset) grid.innerHTML = "";

            const existing = new Set(Array.from(grid.querySelectorAll(".anilist-card")).map(card => card.dataset.title));
            const cards = data.media.filter(anime => {
                const title = (anime.title?.english || anime.title?.romaji || anime.title?.native || "").toLowerCase();
                if (!title) return false;
                return !existing.has(title) && anime.coverImage;
            });

            if (cards.length === 0 && reset) {
                grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: #bcaed4; padding: 30px;">Koi anime nahi mila. Spelling check karein!</div>`;
            } else {
                grid.insertAdjacentHTML("beforeend", cards.map(createCard).join(""));
            }

            hasNextPage = data.pageInfo.hasNextPage;
            currentPage = data.pageInfo.currentPage + 1;
            if (moreButton) moreButton.style.display = hasNextPage ? "block" : "none";
        } catch (error) {
            console.error("Search error:", error);
        } finally {
            loading = false;
            if (moreButton) moreButton.disabled = false;
        }
    }

    function initAnimeSystem() {
        let grid = document.getElementById("anilist-results-grid") || document.getElementById("mixed-container");
        const container = document.getElementById("mixed-container");

        if (!grid) {
            const targetParent = container || document.querySelector("main") || document.body;
            const section = document.createElement("section");
            section.id = "anilist-section";
            section.innerHTML = `
                <h2>Global Search Results</h2>
                <p id="anilist-status" role="status" aria-live="polite"></p>
                <div id="anilist-results-grid"></div>
                <button id="anilist-load-more" type="button" style="margin:24px auto;padding:12px 24px;display:block;">Load More</button>
            `;
            targetParent.insertAdjacentElement("beforeend", section);
            grid = document.getElementById("anilist-results-grid");
        }

        const loadMoreBtn = document.getElementById("anilist-load-more");
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener("click", () => loadAnime());
        }

        // Universal search bar binding for all pages
        const inputs = document.querySelectorAll("#animeSearch, input[type='search'], input[name='search']");
        inputs.forEach(input => {
            input.addEventListener("input", (e) => {
                clearTimeout(searchTimer);
                searchTimer = setTimeout(() => {
                    currentSearch = e.target.value.trim();
                    requestId++;
                    loading = false;
                    loadAnime(true);
                }, 300);
            });
        });

        loadAnime(true);
    }

    async function setWatchPageBackground(animeName) {
        try {
            const query = `
                query ($search: String) {
                    Media (search: $search, type: ANIME) {
                        bannerImage
                        coverImage { extraLarge large }
                    }
                }
            `;
            const response = await fetch(ANILIST_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify({ query, variables: { search: animeName } })
            });
            const result = await response.json();
            const media = result?.data?.Media;
            
            if (media) {
                const bgUrl = media.bannerImage || media.coverImage?.extraLarge || media.coverImage?.large;
                if (bgUrl) {
                    document.body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url('${bgUrl}')`;
                    document.body.style.backgroundSize = "cover";
                    document.body.style.backgroundPosition = "center";
                    document.body.style.backgroundAttachment = "fixed";
                    document.body.style.backgroundRepeat = "no-repeat";
                }
            }
        } catch (e) {
            console.error("Background image load karne mein error aayi:", e);
        }
    }

    function initEpisodePlayer() {
        const params = new URLSearchParams(window.location.search);
        let animeKey = (params.get("anime") || "naruto").toLowerCase().trim();
        const episode = Number(params.get("episode") || params.get("ep") || 1);
        const currentServer = params.get("server") || "server1"; 
        const player = document.getElementById("vidPlayer");

        if (!player) return;

        let cleanAnimeKey = animeKey.replace(/[^a-z0-9]/g, '');
        let matchedKey = Object.keys(videoDatabase).find(key => {
            let cleanDbKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
            return cleanAnimeKey.includes(cleanDbKey) || cleanDbKey.includes(cleanAnimeKey);
        });
        
        if (!matchedKey || !videoDatabase[matchedKey]) {
            matchedKey = "naruto shippuden"; 
        }
        
        window.currentAnimeData = videoDatabase[matchedKey];
        window.currentEpNumber = episode;

        const animeObj = videoDatabase[matchedKey];
        const epData = animeObj?.episodes?.[episode] || animeObj?.episodes?.[1]; 
        const title = animeObj?.name || params.get("anime") || "Anime";

        setWatchPageBackground(title);

        const titleEl = document.getElementById("vidTitle");
        const nameEl = document.getElementById("animeNameText");
        const epEl = document.getElementById("epNumText");

        if (titleEl) titleEl.textContent = `${title} Episode ${episode}`;
        if (nameEl) nameEl.textContent = title;
        if (epEl) epEl.textContent = `Episode ${episode}`;

        let videoUrl = epData?.server1;
        if (currentServer === "server2" && epData?.server2) {
            videoUrl = epData.server2;
        } else {
            videoUrl = epData?.server1 || epData;
        }

        if (!videoUrl || typeof videoUrl !== "string") {
            player.removeAttribute("src");
            return;
        }

        player.src = videoUrl;
        player.setAttribute("allow", "autoplay; fullscreen; picture-in-picture; encrypted-media");
        player.setAttribute("allowfullscreen", "");
        player.setAttribute("referrerpolicy", "no-referrer-when-downgrade");

        const srv1Btn = document.getElementById("srv1Btn");
        const srv2Btn = document.getElementById("srv2Btn");
        if (currentServer === "server2") {
            if (srv2Btn) srv2Btn.classList.add("active");
            if (srv1Btn) srv1Btn.classList.remove("active");
        } else {
            if (srv1Btn) srv1Btn.classList.add("active");
            if (srv2Btn) srv2Btn.classList.remove("active");
        }

        const trayContainer = document.getElementById("episodeTray");
        if (trayContainer && animeObj?.episodes) {
            trayContainer.innerHTML = "";
            const episodeNumbers = Object.keys(animeObj.episodes).map(Number).sort((a, b) => a - b);
            
            episodeNumbers.forEach(i => {
                const epCard = document.createElement("a");
                epCard.className = `ep-tray-card ${i === episode ? "active-ep" : ""}`;
                epCard.href = `watch.html?anime=${encodeURIComponent(title)}&episode=${i}&server=${currentServer}`;
                epCard.textContent = `Episode ${i}`;
                trayContainer.appendChild(epCard);
            });

            const nextBtn = document.getElementById("nextEpBtn");
            if (nextBtn) {
                const currentIndex = episodeNumbers.indexOf(episode);
                if (currentIndex !== -1 && currentIndex < episodeNumbers.length - 1) {
                    const nextEpNum = episodeNumbers[currentIndex + 1];
                    nextBtn.style.display = "inline-block";
                    nextBtn.onclick = () => {
                        params.set("episode", nextEpNum);
                        params.set("server", currentServer);
                        window.location.search = params.toString();
                    };
                } else {
                    nextBtn.style.display = "none";
                }
            }
        }
    }

    window.switchServer = function(serverName) {
        const player = document.getElementById("vidPlayer");
        if (!player || !window.currentAnimeData) return;

        const epData = window.currentAnimeData.episodes?.[window.currentEpNumber];
        if (!epData) return;

        let targetUrl = "";
        const srv1Btn = document.getElementById("srv1Btn");
        const srv2Btn = document.getElementById("srv2Btn");

        if (serverName === 'server1') {
            targetUrl = epData.server1;
            if (srv1Btn) srv1Btn.classList.add("active");
            if (srv2Btn) srv2Btn.classList.remove("active");
        } else if (serverName === 'server2') {
            targetUrl = epData.server2 || epData.server1;
            if (srv2Btn) srv2Btn.classList.add("active");
            if (srv1Btn) srv1Btn.classList.remove("active");
        }

        if (targetUrl) {
            player.src = targetUrl;
            const params = new URLSearchParams(window.location.search);
            params.set("server", serverName);
            window.history.replaceState({}, '', `${location.pathname}?${params.toString()}`);
        }
    };

    function initHeroVideoPosterFix() {
        const heroVideo = document.getElementById("heroVideo");
        const pageBackground = document.getElementById("pageBackground");
        if (!heroVideo || !pageBackground) return;

        function updateBackground() {
            const playing = !heroVideo.paused && !heroVideo.ended && heroVideo.readyState >= 2;
            pageBackground.style.visibility = playing ? "hidden" : "visible";
        }

        ["playing", "pause", "ended", "waiting", "loadeddata"].forEach(eventName => {
            heroVideo.addEventListener(eventName, updateBackground);
        });
        updateBackground();
    }

    function moveFiltersToBottom() {
        let checkInterval = setInterval(() => {
            const catalogTools = document.getElementById("catalog-tools");
            const destination = document.getElementById("bottom-filter-destination");
            if (catalogTools) {
                if (destination) {
                    destination.appendChild(catalogTools);
                } else {
                    document.body.appendChild(catalogTools);
                }
                clearInterval(checkInterval); 
            }
        }, 500);
    }

    function initPage() {
        initAnimeSystem();
        initEpisodePlayer();
        initHeroVideoPosterFix();
        initDynamicHomePage();
        loadTopRatedAnime();
        moveFiltersToBottom(); 
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initPage);
    } else {
        initPage();
    }

    async function fetchAnimeCategory(format, sort, title, containerId) {
        const query = `
            query {
                Page(page: 1, perPage: 12) {
                    media(type: ANIME, format: ${format}, sort: ${sort}) {
                        id siteUrl format
                        title { romaji english native }
                        coverImage { extraLarge large }
                    }
                }
            }
        `;

        try {
            const response = await fetch(ANILIST_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify({ query })
            });

            const result = await response.json();
            if (result?.data?.Page?.media) {
                renderCategorySection(title, result.data.Page.media, containerId);
            }
        } catch (error) {
            console.error(`Error loading ${title}:`, error);
        }
    }

    function createCardHTML(anime) {
        const title = anime.title.english || anime.title.romaji || "Unknown";
        const image = anime.coverImage?.extraLarge || anime.coverImage?.large || "";
        const href = `watch.html?anime=${encodeURIComponent(title)}&episode=1`;

        return `
            <a href="${escapeHTML(href)}" class="premium-card anilist-card" data-title="${escapeHTML(title.toLowerCase())}">
                <div class="card-img-wrapper">
                    <img src="${escapeHTML(image)}" alt="${escapeHTML(title)}" class="card-img" loading="lazy">
                    <div class="card-badges"><span class="badge sub">${anime.format === "MOVIE" ? "MOVIE" : "SERIES"}</span></div>
                    <div class="play-overlay"><i class="fas fa-play"></i></div>
                </div>
                <div class="card-info"><h3 class="card-title">${escapeHTML(title)}</h3></div>
            </a>
        `;
    }

    function renderCategorySection(title, animeList, containerId) {
        const targetDiv = document.getElementById("dynamic-anime-sections");
        if (!targetDiv) return;

        const sectionHTML = `
            <div class="hero-message section-header" style="width:100%; display:flex; justify-content:space-between; margin-bottom:12px;">
                <span>${title}</span>
            </div>
            <div class="cards-row" id="${containerId}">
                ${animeList.map(a => createCardHTML(a)).join('')}
            </div>
        `;
        targetDiv.insertAdjacentHTML("beforeend", sectionHTML);
    }

    function initDynamicHomePage() {
        if (!document.getElementById("dynamic-anime-sections")) return;
        
        fetchAnimeCategory("TV", "TRENDING_DESC", "Anime Series", "row-series");
        setTimeout(() => fetchAnimeCategory("MOVIE", "TRENDING_DESC", "Anime Movies", "row-movies"), 500);
        setTimeout(() => fetchAnimeCategory("TV", "START_DATE_DESC", "New Arrivals", "row-new"), 1000);
        setTimeout(() => fetchAnimeCategory("TV", "POPULARITY_DESC", "Most Viewed Anime", "row-popular"), 1500);
    }
})();
