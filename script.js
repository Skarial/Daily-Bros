// Liste des URL des fonds d'écran
const backgrounds = [
  "url('assets/fond_ecran.webp')",
  "url('assets/fond_ecran2.webp')",
  "url('assets/fond_ecran.webp')",
  "url('assets/fond_ecran2.webp')",
];

let currentBackgroundIndex = 0; // Indice du fond d'écran actuellement affiché

// Fonction pour changer dynamiquement le fond d'écran
function changeBackground() {
  document.body.style.backgroundImage = backgrounds[currentBackgroundIndex];
  currentBackgroundIndex = (currentBackgroundIndex + 1) % backgrounds.length;
}

// Changer le fond d'écran toutes les deux secondes
setInterval(changeBackground, 2000);

document.addEventListener("DOMContentLoaded", function () {
  let initialCount = 0;
  let count = 0;
  let timerTimeout;
  let isTimerRunning = false;
  let isGoButtonClicked = false; // Nouvelle variable pour suivre l'état du bouton "GO"
  let overSound = new Audio("assets/game_over.mp3");
  let partieSound = new Audio("assets/partie.wav");
  const display = document.querySelector("#time");
  const imgPrincesse = document.querySelector(".img_princesse");
  const suivantButton = document.querySelector(".btn_suivant");

  const partieVolume = 0.2;
  partieSound.volume = partieVolume;
  const audioElementVolume = 1;
  overSound.volume = audioElementVolume;

  // Ajout d'une variable pour suivre l'état initial du site
  let siteOpened = false;

  function updateTimerDisplay() {
    const minutes = String(Math.floor(count / 60)).padStart(2, "0");
    const seconds = String(count % 60).padStart(2, "0");
    display.textContent = `${minutes}:${seconds}`;
  }

  function handleTimerExpiration() {
    imgPrincesse.src = "assets/monstre.png";
    overSound.play().then(() => {
      overSound.addEventListener("ended", resetTimer);
    });

    partieSound.pause();
    partieSound.currentTime = 0;

    isTimerRunning = false;
  }

  function resetTimer() {
    count = initialCount;
    isTimerRunning = false;
    updateTimerDisplay();
    imgPrincesse.src = "assets/princesse.png";
    clearTimeout(timerTimeout);
    timerTimeout = null;

    partieSound.pause();
    partieSound.currentTime = 0;
  }

  function startTimer(duration) {
    function update() {
      if (duration === 0) {
        handleTimerExpiration();
      } else {
        timerTimeout = setTimeout(update, 1000);
      }

      const minutes = String(Math.floor(duration / 60)).padStart(2, "0");
      const seconds = String(duration % 60).padStart(2, "0");
      display.textContent = `${minutes}:${seconds}`;
      duration--;
    }

    update();
    partieSound.play();
  }

  const plusButton = document.querySelector(".btn_plus");
  const moinsButton = document.querySelector(".btn_moins");
  const goButton = document.querySelector(".btn_go");
  const muteButton = document.querySelector(".btn_mute");

  plusButton.addEventListener("click", function () {
    if (!isTimerRunning) {
      count += 30;
      initialCount = count;
      updateTimerDisplay();
    }
  });

  moinsButton.addEventListener("click", function () {
    if (!isTimerRunning && count >= 30) {
      count -= 30;
      initialCount = count;
      updateTimerDisplay();
    }
  });

  goButton.addEventListener("click", function () {
    if (!isTimerRunning && !isGoButtonClicked) {
      startTimer(count);
      isTimerRunning = true;
      isGoButtonClicked = true; // Mettre à true après le premier clic sur le bouton "GO"

      // Débloquer le bouton "suivant" après avoir appuyé sur le bouton "go" une première fois
      if (!siteOpened) {
        siteOpened = true;
        suivantButton.disabled = false;
      }
    }
  });

  // Désactiver le bouton "suivant" à l'ouverture du site
  suivantButton.disabled = true;

  suivantButton.addEventListener("click", function () {
    resetTimer();
    overSound.pause();
    overSound.currentTime = 0;
    startTimer(count);
  });

  muteButton.addEventListener("click", function () {
    if (overSound.volume > 0 || partieSound.volume > 0) {
      // Si le son est actuellement activé, le désactiver en mettant le volume à zéro
      overSound.volume = 0;
      partieSound.volume = 0;
    } else {
      // Si le son est actuellement désactivé, le réactiver en remettant le volume à sa valeur initiale
      overSound.volume = audioElementVolume;
      partieSound.volume = partieVolume;
    }
  });

  updateTimerDisplay();
});
