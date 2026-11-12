/* ==========================================
   INFINITYTOONS - LIGHTNING FAST ENGINE
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

    async function fetchAnimeCombined(page, search, format, id) {
        // Instant response using primary AniList fetch first
        const anilistData = await fetchAnilist(page, search, format, id);
        return {
            media: anilistData?.media || [],
            pageInfo: anilistData?.pageInfo || { currentPage: page, hasNextPage: false }
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

    async function loadAnime(reset = false) {
        if (loading) return;
        const grid = document.getElementById("anilist-results-grid") || document.getElementById("mixed-container");
        const moreButton = document.getElementById("anilist-load-more");
        if (!grid) return;

        if (reset) {
            currentPage = 1;
            hasNextPage = true;
            grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: #bcaed4; padding: 20px;">Loading...</div>`;
        }

        if (!hasNextPage && !reset) return;
        loading = true;
        const id = ++requestId;
        if (moreButton) moreButton.disabled = true;

        try {
            const data = await fetchAnimeCombined(currentPage, currentSearch, getFormat(), id);
            if (!data || id !== requestId) return;

            if (reset) grid.innerHTML = "";

            const cards = data.media.filter(anime => anime.coverImage);

            if (cards.length === 0 && reset) {
                grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: #bcaed4; padding: 30px;">No anime found!</div>`;
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
                <h2>Search Results</h2>
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

        // Instant search binding
        const inputs = document.querySelectorAll("#animeSearch, input[type='search'], input[name='search']");
        inputs.forEach(input => {
            input.addEventListener("input", (e) => {
                clearTimeout(searchTimer);
                searchTimer = setTimeout(() => {
                    currentSearch = e.target.value.trim();
                    requestId++;
                    loading = false;
                    loadAnime(true);
                }, 200); // Super fast 200ms debounce
            });
        });

        loadAnime(true);
    }

    function initPage() {
        initAnimeSystem();
        loadTopRatedAnime();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initPage);
    } else {
        initPage();
    }
})();


// ==========================================
// 1. AUTOMATIC BACKGROUND ROTATOR (Har 5 Minutes Me Change Hogi)
// ==========================================
const bgImages = [
    "url('https://s4.anilist.co/file/anilistcdn/media/anime/banner/16498-m5ZMNtFiCHQj.jpg')",
    "url('https://s4.anilist.co/file/anilistcdn/media/anime/banner/21-wf37VrvodqCU.jpg')",
    "url('https://s4.anilist.co/file/anilistcdn/media/anime/banner/101922-PEn1CTc93DQl.jpg')",
    "url('https://s4.anilist.co/file/anilistcdn/media/anime/banner/151807-m1gX3iwfIsLu.jpg')",
    "url('https://s4.anilist.co/file/anilistcdn/media/anime/banner/1-OQH378s0i0et.jpg')"
];

let currentBgIndex = 0;

function initAutoBackground() {
    // Check agar pehle se #bg-container nahi hai toh body mein prepend kar do
    if (!document.getElementById("bg-container")) {
        const bgDiv = document.createElement("div");
        bgDiv.id = "bg-container";
        bgDiv.style.backgroundImage = bgImages[0];
        document.body.prepend(bgDiv);
    }
}

function rotateBackground() {
    const bgDiv = document.getElementById("bg-container");
    if (bgDiv) {
        currentBgIndex = (currentBgIndex + 1) % bgImages.length;
        bgDiv.style.backgroundImage = bgImages[currentBgIndex];
    }
}

// Har 5 minutes (300,000 ms) mein background change hogi
setInterval(rotateBackground, 300000);


// ==========================================
// 2. MOVE A-Z / CATALOG TOOLS TO THE ABSOLUTE BOTTOM
// ==========================================
function moveCatalogToolsToBottom() {
    const catalogTools = document.getElementById("catalog-tools");
    const footer = document.querySelector("footer") || document.body;
    
    if (catalogTools) {
        // Agar footer ya body ke end mein shift karna ho
        if (footer && footer !== document.body) {
            footer.parentNode.insertBefore(catalogTools, footer);
        } else {
            document.body.appendChild(catalogTools);
        }
    }
}

// Initialization function ke andar inhe call kar dein
window.addEventListener("DOMContentLoaded", () => {
    initAutoBackground();
    moveCatalogToolsToBottom();
});
