
(() => {
  const clips = [
    "animeclip (10).mp4",
    "animeclip (11).mp4",
    "animeclip (17).mp4",
    "attack.mp4",
    "suzume.mp4",
    "baserk.mp4",
    "culling game.mp4",
    "parasyte.mp4",
    "piece.mp4",
    "takopi.mp4",
    "punch.mp4",
    "revengers.mp4",
    "chain.mp4",
    "kaiju.mp4",
    "demon.mp4",
    "leveling.mp4",
    "dandan.mp4"
  ];

  document.querySelectorAll(".hero-banner").forEach((hero) => {
    let video = hero.querySelector("video.hero-video");

    if (!video) {
      video = document.createElement("video");
      video.className = "hero-video";
      hero.prepend(video);
    }

    video.autoplay = true;
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.loop = false;
    video.controls = false;
    video.preload = "auto";

    let index = Math.floor(Math.random() * clips.length);
    let changing = false;

    function playClip() {
      if (changing) return;
      changing = true;

      video.src = "videos/" + clips[index];
      video.load();

      const attemptPlay = () => {
        video.play().catch(() => {
          console.warn("Video autoplay nahi hui:", clips[index]);
        });
      };

      video.oncanplay = attemptPlay;

      video.onended = () => {
        index = (index + 1) % clips.length;
        changing = false;
        playClip();
      };

      video.onerror = () => {
        console.error("Video file nahi mili ya play nahi hui:", clips[index]);
        index = (index + 1) % clips.length;
        changing = false;
        playClip();
      };
    }

    playClip();
  });
})();
