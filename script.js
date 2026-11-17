/* ==========================================
   INFINITYTOONS - OPTIMIZED STABLE MULTI-API ENGINE
   AniList + Jikan + Kitsu + TMDB + All Links Intact
   ========================================== */

(() => {
    "use strict";

    const ANILIST_URL = "https://graphql.anilist.co";
    const JIKAN_URL = "https://api.jikan.moe/v4";
    const KITSU_URL = "https://kitsu.io/api/edge";
    const TMDB_API_KEY = "3fd2be6f0c70a2a598f084ddfb75487c"; 
    const PER_PAGE = 24;

    // ==========================================
    // 1. BACKGROUND IMAGE ROTATOR (Har 10 Seconds Me Change Hogi)
    // ==========================================
    const animeBackgrounds = [
        "https://s4.anilist.co/file/anilistcdn/media/anime/banner/16498-m5ZMNtFiCHQj.jpg",
        "https://s4.anilist.co/file/anilistcdn/media/anime/banner/21-wf37VrvodqCU.jpg",
        "https://s4.anilist.co/file/anilistcdn/media/anime/banner/101922-PEn1CTc93DQl.jpg",
        "https://s4.anilist.co/file/anilistcdn/media/anime/banner/151807-m1gX3iwfIsLu.jpg",
        "https://s4.anilist.co/file/anilistcdn/media/anime/banner/21507-XvYbcK0w22XJ.jpg"
    ];

    let globalBgIndex = 0;

    function initGlobalBackgroundRotator() {
        const bgContainer = document.getElementById("pageBackground");
        if (!bgContainer) return;

        setInterval(() => {
            globalBgIndex = (globalBgIndex + 1) % animeBackgrounds.length;
            bgContainer.style.backgroundImage = `url('${animeBackgrounds[globalBgIndex]}')`;
        }, 10000);
    }

    // ==========================================
    // 2. TOP RATED SWING / AUTO-SCROLL CARDS (TMDB / High Rated)
    // ==========================================
    function initTopRatedSwing() {
        const container = document.querySelector(".top-rated-container");
        if (!container) return;

        let scrollDirection = 1;
        setInterval(() => {
            container.scrollLeft += scrollDirection * 150;
            if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 10) {
                scrollDirection = -1; // End par aakar reverse swing
            } else if (container.scrollLeft <= 0) {
                scrollDirection = 1; // Shuru mein aakar forward swing
            }
        }, 3000); // Har 3 seconds mein smooth swing karega
    }

    // 3. VIDEO LINKS DATABASE
    const videoDatabase = {
        "attack on titan": { 
            name: "Attack On Titan", 
            episodes: { 
                1: { server1: "https://www.youtube.com/embed/MGRm4IzK1SQ", server2: "https://filemoon.org/embed/demo" }, 
                2: { server1: "https://www.youtube.com/embed/xyz", server2: "https://filemoon.org/embed/demo" }
            }
        },
        "marriagetoxin": { 
            name: "MARRIAGETOXIN", 
            episodes: { 
                1: { server1: "https://player.abyssplayer.com/eZZA95gJl", server2: "" }, 
                2: { server1: "https://player.abyssplayer.com/iWJlNIomI", server2: "" }
            }
        },
        "tokyo ghoul": { 
            name: "Tokyo Ghoul", 
            episodes: { 
                1: { server1: "https://player.abyssplayer.com/yEMcoqgDU", server2: "" }
            }
        },
        "naruto shippuden": { 
            name: "Naruto Shippuden", 
            episodes: { 
                1: { server1: "https://filemoon.org/en/APVmaXbjGXo8/embed", server2: "https://playmogo.com/e/w1my8nj0euez" }, 
                2: { server1: "https://filemoon.org/en/ex5z2DXlmKqk/embed", server2: "https://www.youtube.com/embed/xyz" }
            }
        },
        "solo leveling": { 
            name: "Solo Leveling", 
            episodes: { 
                1: { server1: "https://filemoon.org/en/APVmaXWwGXo8/embed", server2: "https://playmogo.com/e/w1my8nj0euez" }, 
                2: { server1: "https://filemoon.org/en/0JgG7gYKGoYW/embed", server2: "https://playmogo.com/e/xzojw2qipdkt" }
            } 
        },
        "demon slayer": { 
            name: "Demon Slayer", 
            episodes: { 
                1: { server1: "https://playmogo.com/e/ezuxvzl5p23f", server2: "https://playmogo.com/e/ezuxvzl5p23f" }
            }
        },
        "death note": { 
            name: "Death Note", 
            episodes: { 
                1: { server1: "https://filemoon.org/en/b5OzdXY8zB8L/embed", server2: "https://playmogo.com/e/kc3g7giokpon" }
            } 
        }
    };

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

    async function fetchAnilist(page, search, format, id) {
        try {
            const query = `
                query ($page: Int, $perPage: Int, $search: String, $format: MediaFormat) {
                    Page(page: $page, perPage: $perPage) {
                        pageInfo { currentPage hasNextPage }
                        media(search: $search, type: ANIME, format: $format, sort: SCORE_DESC) {
                            id siteUrl format
                            title { romaji english native }
                            coverImage { large extraLarge }
                            averageScore
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

    async function fetchAnimeCombined(page, search, format, id) {
        const anilistData = await fetchAnilist(page, search, format, id);
        return {
            media: anilistData?.media || [],
            pageInfo: { currentPage: page, hasNextPage: anilistData?.pageInfo?.hasNextPage || false }
        };
    }

    // FIX: Cards click karne par seedha watch.html par redirect karega
    function createCard(anime) {
        const title = anime.title?.english || anime.title?.romaji || anime.title?.native || "Unknown Anime";
        const image = anime.coverImage?.extraLarge || anime.coverImage?.large || "";
        const href = `watch.html?anime=${encodeURIComponent(title)}`;

        return `
            <a href="${escapeHTML(href)}" class="premium-card search-item anilist-card" data-title="${escapeHTML(title.toLowerCase())}" target="_self">
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
        const grid = document.getElementById("anilist-results-grid");
        const moreButton = document.getElementById("anilist-load-more");
        if (!grid) return;

        if (reset) {
            currentPage = 1;
            hasNextPage = true;
            grid.innerHTML = "";
        }

        if (!hasNextPage && !reset) return;
        loading = true;
        const id = ++requestId;
        if (moreButton) moreButton.disabled = true;

        try {
            const data = await fetchAnimeCombined(currentPage, currentSearch, getFormat(), id);
            if (!data || id !== requestId) return;

            const cards = data.media.filter(anime => anime.coverImage);
            grid.insertAdjacentHTML("beforeend", cards.map(createCard).join(""));
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
        let grid = document.getElementById("anilist-results-grid");
        const container = document.getElementById("mixed-container");

        if (!grid) {
            const targetParent = container || document.querySelector("main") || document.body;
            const section = document.createElement("section");
            section.id = "anilist-section";
            section.innerHTML = `
                <div id="anilist-results-grid"></div>
                <button id="anilist-load-more" type="button" style="margin:24px auto;padding:12px 24px;display:block;">Load More</button>
            `;
            targetParent.insertAdjacentElement("beforeend", section);
            grid = document.getElementById("anilist-results-grid");
        }

        const loadMoreBtn = document.getElementById("anilist-load-more");
        if (loadMoreBtn) loadMoreBtn.addEventListener("click", () => loadAnime());

        const input = document.getElementById("animeSearch");
        if (input) {
            input.addEventListener("input", () => {
                clearTimeout(searchTimer);
                searchTimer = setTimeout(() => {
                    currentSearch = input.value.trim();
                    requestId++;
                    loading = false;
                    loadAnime(true);
                }, 300);
            });
        }

        loadAnime(true);
    }

    function initEpisodePlayer() {
        const params = new URLSearchParams(window.location.search);
        let animeKey = (params.get("anime") || "naruto").toLowerCase().trim();
        const episode = Number(params.get("episode") || params.get("ep") || 1);
        const currentServer = params.get("server") || "server1"; 
        const player = document.getElementById("vidPlayer");

        if (!player) return;

        let matchedKey = Object.keys(videoDatabase).find(key => animeKey.includes(key) || key.includes(animeKey)) || "naruto";
        window.currentAnimeData = videoDatabase[matchedKey];
        window.currentEpNumber = episode;

        const animeObj = videoDatabase[matchedKey];
        const epData = animeObj?.episodes?.[episode] || animeObj?.episodes?.[1]; 
        const title = animeObj?.name || params.get("anime") || "Anime";

        const titleEl = document.getElementById("vidTitle");
        const nameEl = document.getElementById("animeNameText");
        const epEl = document.getElementById("epNumText");

        if (titleEl) titleEl.textContent = `${title} Episode ${episode}`;
        if (nameEl) nameEl.textContent = title;
        if (epEl) epEl.textContent = `Episode ${episode}`;

        let videoUrl = currentServer === "server2" && epData?.server2 ? epData.server2 : epData?.server1;
        if (!videoUrl) return;

        player.src = videoUrl;
        player.setAttribute("allow", "autoplay; fullscreen; picture-in-picture");

        const trayContainer = document.getElementById("episodeTray");
        if (trayContainer && animeObj?.episodes) {
            trayContainer.innerHTML = "";
            Object.keys(animeObj.episodes).map(Number).forEach(i => {
                const epCard = document.createElement("a");
                epCard.className = `ep-tray-card ${i === episode ? "active-ep" : ""}`;
                epCard.href = `watch.html?anime=${encodeURIComponent(title)}&episode=${i}&server=${currentServer}`;
                epCard.textContent = `Episode ${i}`;
                trayContainer.appendChild(epCard);
            });
        }
    }

    function moveFiltersToBottom() {
        let checkInterval = setInterval(() => {
            const catalogTools = document.getElementById("catalog-tools");
            const destination = document.getElementById("bottom-filter-destination");
            if (catalogTools) {
                if (destination) destination.appendChild(catalogTools);
                else document.body.appendChild(catalogTools);
                clearInterval(checkInterval); 
            }
        }, 500);
    }

    function initPage() {
        initAnimeSystem();
        initEpisodePlayer();
        initGlobalBackgroundRotator();
        initTopRatedSwing();
        moveFiltersToBottom(); 
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initPage);
    } else {
        initPage();
    }
})();
