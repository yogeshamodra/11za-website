document.addEventListener("DOMContentLoaded", function () {

  const toggleBtn = document.getElementById("toggleCall");
  const wave = document.getElementById("wave");
  const status = document.getElementById("voiceStatus");
  const timer = document.getElementById("voiceTime");

  if (!toggleBtn) return;

  // Put your mp3 at this path (or change the path here)
  const AUDIO_SRC = "assets/audio/ai-voice-demo.wav";

  const audio = new Audio(AUDIO_SRC);
  audio.preload = "metadata";

  function fmt(t) {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
  }

  function setIdle(msg) {
    toggleBtn.innerHTML = "▶ Play AI Voice";
    wave.classList.remove("is-playing");
    status.textContent = msg || "Listen to AI demo";
    timer.textContent = "00:00";
  }

  audio.addEventListener("play", function () {
    toggleBtn.innerHTML = "■ Stop AI Voice";
    wave.classList.add("is-playing");
    status.textContent = "AI voice playing";
  });

  audio.addEventListener("timeupdate", function () {
    timer.textContent = fmt(audio.currentTime);
  });

  audio.addEventListener("ended", function () {
    setIdle("Demo completed");
  });

  audio.addEventListener("error", function () {
    setIdle("Voice unavailable");
  });

  toggleBtn.addEventListener("click", function () {
    if (!audio.paused) {
      audio.pause();
      audio.currentTime = 0;
      setIdle();
    } else {
      audio.play().catch(function () {
        setIdle("Voice unavailable");
      });
    }
  });

});
