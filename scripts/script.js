/* =========================================
   CONFIGURATION — EDIT THESE VALUES
========================================= */

const CONFIG = {
  brotherName: "Sandeep Reddy",

  passcode: "1611",

  hint: "YOUR BIRTH DATE (1611)",

  letter: `Dear Sandeep,

Happy Birthday, brother!

Wishing you another year full of success,
good health, great opportunities and unforgettable
memories. Keep chasing your goals, stay focused
and never stop being yourself.

Keep winning. Proud to have you as my brother.
Enjoy your day. You deserve the best!

— Gagan Reddy`,

  images: [
    "photos/sandeep1.jpg",
    "photos/sandeep2.jpg",
    "photos/sandeep3.jpg",
    "photos/sandeep4.jpg",
    "photos/sandeep5.jpg",
    "photos/sandeep6.jpg"
  ],

  video: "assets/Fireworks.mp4",
  music: "assets/KALYANI.mp3"
};

// Easy-to-find configuration variables
const PASSCODE = CONFIG.passcode;
const BROTHER_NAME = CONFIG.brotherName;
const LETTER_TEXT = CONFIG.letter;
const IMAGE_PATHS = CONFIG.images;
const VIDEO_PATH = CONFIG.video;

/* =========================================
   SCREEN TRANSITIONS
========================================= */

const screens = document.querySelectorAll(".screen");

function showScreen(id) {
  screens.forEach(screen => {
    screen.classList.remove("active");
  });

  document.getElementById(id).classList.add("active");
}

/* =========================================
   1. LOCK SCREEN
========================================= */

let enteredCode = "";

const dots = document.querySelectorAll(".dot");
const vault = document.getElementById("vault");
const statusText = document.getElementById("status");

function updateDots() {
  dots.forEach((dot, index) => {
    dot.classList.toggle("filled", index < enteredCode.length);
  });
}

function clearCode() {
  enteredCode = "";
  updateDots();
}

function unlock() {
  if (enteredCode === PASSCODE) {
    statusText.textContent = "ACCESS GRANTED";
    statusText.style.color = "var(--green)";
    vault.classList.add("success");

    document.getElementById("lockIcon").textContent = "◇";

    setTimeout(() => {
      vault.style.transform = "scale(1.08) rotateX(10deg)";
      vault.style.opacity = "0";

     setTimeout(() => {
  showScreen("loadingScreen");

  // Start music when entering second screen
  playBirthdayMusic();

  startLoading();
}, 650);
    }, 700);

  } else {
    statusText.textContent = "ACCESS DENIED";
    statusText.style.color = "var(--red)";

    vault.classList.add("shake");

    setTimeout(() => {
      vault.classList.remove("shake");
      clearCode();
      statusText.textContent = "";
    }, 700);
  }
}

document.getElementById("keypad").addEventListener("click", e => {
  const button = e.target.closest("[data-key]");
  if (!button) return;

  const key = button.dataset.key;

  if (key === "clear") {
    clearCode();
    statusText.textContent = "";
    return;
  }

  if (key === "enter") {
    if (enteredCode.length === 4) unlock();
    return;
  }

  if (enteredCode.length < 4) {
    enteredCode += key;
    updateDots();
  }

  if (enteredCode.length === 4) {
    setTimeout(unlock, 250);
  }
});

document.addEventListener("keydown", e => {
  if (!document.getElementById("lockScreen").classList.contains("active")) return;

  if (/^[0-9]$/.test(e.key) && enteredCode.length < 4) {
    enteredCode += e.key;
    updateDots();

    if (enteredCode.length === 4) setTimeout(unlock, 250);
  }

  if (e.key === "Backspace") {
    enteredCode = enteredCode.slice(0, -1);
    updateDots();
  }

  if (e.key === "Enter" && enteredCode.length === 4) unlock();
});

/* =========================================
   2. LOADING + LETTER REVEAL
========================================= */

function startLoading() {
  let progress = 0;

  const bar = document.getElementById("loadingBar");
  const percent = document.getElementById("percent");

  const interval = setInterval(() => {
    progress += 1;

    bar.style.width = progress + "%";
    percent.textContent = String(progress).padStart(2, "0") + "%";

    if (progress >= 100) {
      clearInterval(interval);

      setTimeout(() => {
        revealName();
      }, 400);
    }
  }, 25);
}

function revealName() {
  const title = document.getElementById("revealTitle");
  const message = `HAPPY BIRTHDAY ${BROTHER_NAME.toUpperCase()}`;

  title.innerHTML = "";

  [...message].forEach((letter, index) => {
    const span = document.createElement("span");
    span.textContent = letter === " " ? "\u00A0" : letter;
    span.style.animationDelay = `${index * 0.045}s`;
    title.appendChild(span);
  });

  title.classList.add("show");

  const revealDuration = message.length * 45 + 1000;

  setTimeout(() => {
    showScreen("fireworksScreen");
    startFireworks();
  }, revealDuration);
}

/* =========================================
   3. CANVAS FIREWORKS
========================================= */

const canvas = document.getElementById("fireworksCanvas");
const ctx = canvas.getContext("2d");

let particles = [];
let fireworksRunning = false;
let fireworkEndTimer;
let animationFrame;

const colors = [
  "#ffffff",
  "#00aaff",
  "#e63946",
  "#e8bb70"
];

function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = window.innerWidth * ratio;
  canvas.height = window.innerHeight * ratio;

  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function createExplosion(x, y) {
  const color = colors[Math.floor(Math.random() * colors.length)];
  const count = 65;

  for (let i = 0; i < count; i++) {
    const angle = Math.PI * 2 * i / count;
    const speed = Math.random() * 4 + 1;

    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      alpha: 1,
      size: Math.random() * 2.5 + 1,
      color
    });
  }
}

function animateFireworks() {
  if (!fireworksRunning) return;

  const width = window.innerWidth;
  const height = window.innerHeight;

  ctx.fillStyle = "rgba(5, 6, 7, 0.18)";
  ctx.fillRect(0, 0, width, height);

  if (Math.random() < 0.055) {
    createExplosion(
      Math.random() * width,
      Math.random() * height * 0.7
    );
  }

  particles.forEach((p, index) => {
    p.x += p.vx;
    p.y += p.vy;

    p.vy += 0.035;
    p.alpha -= 0.012;

    ctx.globalAlpha = Math.max(0, p.alpha);
    ctx.fillStyle = p.color;
    ctx.shadowBlur = 12;
    ctx.shadowColor = p.color;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();

    if (p.alpha <= 0) particles.splice(index, 1);
  });

  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;

  animationFrame = requestAnimationFrame(animateFireworks);
}



function goToLetter() {
  clearTimeout(fireworkEndTimer);
  fireworksRunning = false;
  cancelAnimationFrame(animationFrame);

  const video = document.getElementById("fireworksVideo");
  if (video) video.pause();

  showScreen("letterScreen");
  startTypewriter();
}

function startFireworks() {
  fireworksRunning = true;
  particles = [];

  const video = document.getElementById("fireworksVideo");
  if (video) video.play().catch(() => {});

  animateFireworks();

  fireworkEndTimer = setTimeout(goToLetter, 7000);
}

document.getElementById("letterNextBtn").addEventListener("click", goToLetter);




const sound = document.getElementById("fireworkSound");
const soundBtn = document.getElementById("soundBtn");
sound.volume = 0.5;

function playBirthdayMusic() {
  sound.play().then(() => {
    if (soundBtn) soundBtn.textContent = "♫ SOUND ON";
  }).catch(() => {
    if (soundBtn) soundBtn.textContent = "♫ TAP TO PLAY";
  });
}

function pauseBirthdayMusic() {
  sound.pause();
  sound.currentTime = 0;
}

if (soundBtn) {
  soundBtn.addEventListener("click", () => {
    if (sound.paused) playBirthdayMusic();
    else {
      sound.pause();
      soundBtn.textContent = "♫ SOUND OFF";
    }
  });
}

/* =========================================
   4. TYPEWRITER LETTER
========================================= */

let typewriterTimer = null;
let letterIndex = 0;



function startTypewriter() {
  const output = document.getElementById("letterText");
  const cursor = document.getElementById("cursor");

  clearTimeout(typewriterTimer);
  output.textContent = "";
  cursor.style.display = "inline-block";
  letterIndex = 0;

  function type() {
    if (letterIndex < LETTER_TEXT.length) {
      output.textContent += LETTER_TEXT.charAt(letterIndex);
      letterIndex++;
      typewriterTimer = setTimeout(type, 30);
    } else {
      cursor.style.display = "none";
    }
  }
  type();
}

/* =========================================
   5. IMAGE GALLERY
========================================= */

function createGalleryCard(path, index) {
  const card = document.createElement("div");
  card.className = "photo-card";

  const img = document.createElement("img");
  img.src = path;
  img.alt = `Birthday memory ${index + 1}`;
  img.loading = "lazy";

  const fallback = document.createElement("div");
  fallback.className = "fallback";
  fallback.textContent = `MEMORY ${String(index + 1).padStart(2, "0")}`;

  img.addEventListener("load", () => {
    card.classList.add("has-image");
  });

  img.addEventListener("error", () => {
    img.remove();
  });

  // Subtle pointer tilt on desktop
  card.addEventListener("mousemove", e => {
    if (window.matchMedia("(hover: none)").matches) return;

    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - .5;
    const y = (e.clientY - rect.top) / rect.height - .5;

    card.style.transform =
      `perspective(700px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.04)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });

  card.append(img, fallback);
  return card;
}



function buildGallery() {
  const trackOne = document.getElementById("trackOne");
  const trackTwo = document.getElementById("trackTwo");

  trackOne.innerHTML = "";
  trackTwo.innerHTML = "";

  // Build each row twice for a seamless loop
  for (let round = 0; round < 2; round++) {
    IMAGE_PATHS.forEach((path, index) => {
      trackOne.appendChild(createGalleryCard(path, index));
      trackTwo.appendChild(createGalleryCard(path, index));
    });
    [...IMAGE_PATHS].reverse().forEach((path, index) => {
  trackTwo.appendChild(createGalleryCard(path, index));
});
  }

  document.getElementById("closingText").textContent =
    `ONCE AGAIN, HAPPY BIRTHDAY ${BROTHER_NAME.toUpperCase()}`;
}

document.getElementById("galleryBtn").addEventListener("click", () => {
  buildGallery();
  showScreen("galleryScreen");
});

/* =========================================
   ASSET PRELOADING
========================================= */

function preloadImages() {
  IMAGE_PATHS.forEach(path => {
    const image = new Image();
    image.src = path;
  });
}

preloadImages();

// The birthday experience is ready.
// Initially keep music paused on lock screen
pauseBirthdayMusic();