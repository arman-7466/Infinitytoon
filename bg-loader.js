// ==========================================
// UNIVERSAL LIQUID GLASS BACKGROUND ROTATOR
// ==========================================
const bgImages = [
    "url('https://s4.anilist.co/file/anilistcdn/media/anime/banner/16498-m5ZMNtFiCHQj.jpg')",
    "url('https://s4.anilist.co/file/anilistcdn/media/anime/banner/21-wf37VrvodqCU.jpg')",
    "url('https://s4.anilist.co/file/anilistcdn/media/anime/banner/101922-PEn1CTc93DQl.jpg')",
    "url('https://s4.anilist.co/file/anilistcdn/media/anime/banner/151807-m1gX3iwfIsLu.jpg')",
    "url('https://s4.anilist.co/file/anilistcdn/media/anime/banner/1-OQH378s0i0et.jpg')"
];

let currentBgIndex = 0;

function initGlobalBackground() {
    // Agar background container pehle se nahi hai toh create karke body ke shuru mein laga do
    if (!document.getElementById("bg-container")) {
        const bgDiv = document.createElement("div");
        bgDiv.id = "bg-container";
        bgDiv.style.position = "fixed";
        bgDiv.style.top = "0";
        bgDiv.style.left = "0";
        bgDiv.style.width = "100vw";
        bgDiv.style.height = "100vh";
        bgDiv.style.zIndex = "-999";
        bgDiv.style.backgroundSize = "cover";
        bgDiv.style.backgroundPosition = "center";
        bgDiv.style.filter = "blur(8px) brightness(0.7) saturate(1.2)";
        bgDiv.style.transform = "scale(1.05)";
        bgDiv.style.transition = "background-image 1.5s ease-in-out";
        bgDiv.style.backgroundImage = bgImages[0];
        
        document.body.prepend(bgDiv);
    }
}

function rotateGlobalBackground() {
    const bgDiv = document.getElementById("bg-container");
    if (bgDiv) {
        currentBgIndex = (currentBgIndex + 1) % bgImages.length;
        bgDiv.style.backgroundImage = bgImages[currentBgIndex];
    }
}

// Page load hone par background lagayein aur har 5 minute (300,000 ms) mein rotate karein
document.addEventListener("DOMContentLoaded", () => {
    initGlobalBackground();
    setInterval(rotateGlobalBackground, 300000);
});
