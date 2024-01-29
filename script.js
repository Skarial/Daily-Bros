document.addEventListener("DOMContentLoaded", function () {
  const muteButton = document.querySelector(".btn_mute");
  let initialCount = 0;
  let count = 0;
  let timerTimeout;
  let isTimerRunning = false;
  let isGoButtonClicked = false;
  let isNextButtonEnabled = false;
  let overSound = new Audio("assets/over.mp3");
  let partieSound = new Audio("assets/partie.wav");
  const display = document.querySelector("#time");
  const imgPrincesse = document.querySelector(".img_princesse");
  const suivantButton = document.querySelector(".btn_suivant");
  const goButton = document.querySelector(".btn_go");
  const plusButton = document.querySelector(".btn_plus");
  const moinsButton = document.querySelector(".btn_moins");
  let siteOpened = false;

  function updateTimerDisplay() {
    const minutes = String(Math.floor(count / 60)).padStart(2, "0");
    const seconds = String(count % 60).padStart(2, "0");
    display.textContent = `${minutes}:${seconds}`;
  }

  function handleTimerExpiration() {
    imgPrincesse.src = "assets/monstre.png";
    overSound.play();

    partieSound.pause();
    partieSound.currentTime = 0;

    isTimerRunning = false;
    partieSound.addEventListener("pause", resetPartieSound);
    partieSound.addEventListener("ended", resetPartieSound);
  }

  function resetPartieSound() {
    partieSound.removeEventListener("pause", resetPartieSound);
    partieSound.removeEventListener("ended", resetPartieSound);
    partieSound.currentTime = 0;
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

    // Réactiver les boutons "Plus 30 secondes" et "Moins 30 secondes"
    plusButton.disabled = false;
    moinsButton.disabled = false;
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

    // Réduire le volume de partieSound lorsque le minuteur démarre
    partieSound.volume = 0.1; // Ajustez la valeur du volume selon vos besoins
    partieSound.play();

    // Désactiver les boutons "Plus 30 secondes" et "Moins 30 secondes" lorsque le minuteur démarre
    plusButton.disabled = true;
    moinsButton.disabled = true;
  }

  plusButton.addEventListener("click", function () {
    if (!isTimerRunning) {
      count += 30;
      initialCount = count;
      updateTimerDisplay();

      if (!siteOpened) {
        siteOpened = true;
        goButton.disabled = false;
        suivantButton.disabled = true; // Bloquer le bouton "Suivant" à l'ouverture du site
        isNextButtonEnabled = true;
      }
    }
  });

  moinsButton.addEventListener("click", function () {
    if (!isTimerRunning && count >= 30) {
      count -= 30;
      initialCount = count;
      updateTimerDisplay();

      if (!siteOpened) {
        siteOpened = true;
        goButton.disabled = false;
        suivantButton.disabled = true; // Bloquer le bouton "Suivant" à l'ouverture du site
        isNextButtonEnabled = true;
      }
    }
  });

  function disablePlusMinusButtons() {
    plusButton.disabled = true;
    moinsButton.disabled = true;
  }

  function enablePlusMinusButtons() {
    plusButton.disabled = false;
    moinsButton.disabled = false;
  }

  goButton.addEventListener("click", function () {
    if (!isTimerRunning && !isGoButtonClicked) {
      startTimer(count);
      isTimerRunning = true;
      isGoButtonClicked = true;

      goButton.disabled = true;
      disablePlusMinusButtons();

      isNextButtonEnabled = true;
      suivantButton.disabled = !isNextButtonEnabled; // Débloquer le bouton "Suivant" après avoir cliqué sur le bouton "GO"
    }
  });

  suivantButton.addEventListener("click", function () {
    if (isNextButtonEnabled) {
      resetTimer();
      overSound.pause();
      overSound.currentTime = 0;
      startTimer(count);
    }
  });

  suivantButton.disabled = true;
  goButton.disabled = true;

  muteButton.addEventListener("click", function () {
    if (overSound.volume > 0 || partieSound.volume > 0) {
      overSound.volume = 0;
      partieSound.volume = 0;
    } else {
      overSound.volume = 0.5;
      partieSound.volume = 0.1;
    }
  });

  updateTimerDisplay();
});
