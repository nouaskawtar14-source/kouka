/* ==========================================================================
   TypeRush — Logique de l'application
   JavaScript Vanilla ES6+, aucune dépendance externe.
   ========================================================================== */

/* --------------------------------------------------------------------------
   1. Bibliothèque de textes (5 textes minimum par niveau)
   -------------------------------------------------------------------------- */
   const TEXTS = {
    easy: [
      "le chat dort sur le canapé pendant que le soleil entre par la fenêtre du salon calme",
      "elle aime lire des livres le matin et boire un café chaud avant de partir travailler",
      "nous marchons dans le parc et regardons les oiseaux voler haut dans le ciel bleu",
      "mon frère joue au ballon dans le jardin avec ses amis tous les samedis après midi",
      "la pluie tombe doucement sur le toit et les enfants jouent tranquillement dans leur chambre",
      "il prepare le diner pendant que sa femme met la table et allume les bougies",
      "les vacances arrivent bientot et toute la famille part a la montagne pour se reposer",
    ],
  
    medium: [
      "Le développement web moderne repose sur trois piliers essentiels : le HTML pour la structure, le CSS pour le style, et le JavaScript pour l'interactivité. Apprendre ces bases permet de construire des sites solides et accessibles à tous les utilisateurs.",
      "Chaque matin, avant même que le soleil ne se lève complètement, les boulangers commencent à préparer le pain frais. C'est un métier exigeant qui demande de la patience, de la précision et une véritable passion pour les bonnes odeurs du matin.",
      "Pour progresser rapidement dans n'importe quel domaine, il est important de pratiquer régulièrement, d'accepter ses erreurs et de rester curieux. La constance vaut souvent bien plus que les efforts intenses mais irréguliers que l'on fait de temps en temps.",
      "Voyager seul permet de sortir de sa zone de confort, de rencontrer des gens différents et d'apprendre à se débrouiller dans des situations imprévues. C'est une expérience qui change durablement la façon de voir le monde et soi-même.",
      "L'intelligence artificielle transforme progressivement de nombreux secteurs, de la santé à l'éducation en passant par les transports. Comprendre ses bases devient une compétence précieuse pour quiconque souhaite rester pertinent sur le marché du travail.",
      "Le café est l'une des boissons les plus consommées au monde, juste après l'eau. Sa préparation varie énormément selon les régions, et chaque culture a développé ses propres rituels autour de cette boisson chaude et stimulante.",
    ],
  
    hard: [
      "En 2024, plus de 73% des développeurs utilisaient au moins un framework JavaScript, selon une étude menée auprès de 12.450 professionnels. Les résultats montrent que React (41%), Vue.js (18,5%) et Angular (15%) dominent toujours le marché, malgré l'arrivée de nouvelles solutions comme Svelte ou Solid.js, qui gagnent respectivement +6% et +3% de parts chaque année.",
      "Le protocole HTTP/2, normalisé en mai 2015 (RFC 7540), a permis de réduire la latence de 30 à 50% par rapport à HTTP/1.1, grâce au multiplexage des requêtes sur une seule connexion TCP. HTTP/3, basé sur QUIC, va plus loin encore en supprimant les blocages liés au protocole TCP, avec des gains mesurés jusqu'à 15% sur les réseaux instables.",
      "Selon le rapport annuel publié le 14/03/2023, l'entreprise a enregistré une croissance de 8,7% de son chiffre d'affaires (soit 4,2M€), tout en réduisant ses coûts opérationnels de 2,3%. Les actionnaires ont approuvé un dividende de 0,45€ par action lors de l'assemblée générale, malgré un contexte économique marqué par une inflation de 5,1%.",
      "La fonction f(x) = 3x² - 7x + 2 admet deux racines réelles : x₁ ≈ 2,12 et x₂ ≈ 0,21, calculées via le discriminant Δ = b² - 4ac = 49 - 24 = 25. Ce type d'équation du second degré apparaît fréquemment en physique, notamment dans le calcul de trajectoires paraboliques (ex: y = -4,9t² + 12t + 1,5).",
      "D'après l'OMS, environ 1 personne sur 5 souffrira d'un trouble de santé mentale au cours de sa vie ; pourtant, seulement 35% d'entre elles reçoivent un traitement adapté, faute de ressources (estimées à 2$ par habitant/an dans les pays à faible revenu, contre 50$+ dans les pays à revenu élevé). Ces chiffres, publiés en 2022, appellent à une réforme urgente des systèmes de santé.",
      "Le commit #a47e29c, poussé le 02/11/2023 à 14h37, introduit une régression critique : le temps de réponse de l'API /users/{id} est passé de 120ms à 980ms (+716%), causant une chute de 22% du taux de conversion en moins de 48h, avant qu'un correctif (v2.4.1) ne soit déployé en urgence.",
    ],
  };
  
  /* --------------------------------------------------------------------------
     2. Références DOM
     -------------------------------------------------------------------------- */
  const levelSelect = document.getElementById("level-select");
  const bestScoreDisplay = document.getElementById("best-score-display");
  const timerDisplay = document.getElementById("timer-display");
  const liveWpmDisplay = document.getElementById("live-wpm");
  const liveAccuracyDisplay = document.getElementById("live-accuracy");
  const textDisplay = document.getElementById("text-display");
  const textInput = document.getElementById("text-input");
  const progressFill = document.getElementById("progress-fill");
  const resultCard = document.getElementById("result-card");
  const resultTime = document.getElementById("result-time");
  const resultWpm = document.getElementById("result-wpm");
  const resultAccuracy = document.getElementById("result-accuracy");
  const resultMessage = document.getElementById("result-message");
  const resultRecord = document.getElementById("result-record");
  const newTestBtn = document.getElementById("new-test-btn");
  
  /* --------------------------------------------------------------------------
     3. État global du test
     -------------------------------------------------------------------------- */
  const state = {
    level: "medium",
    currentText: "",
    charSpans: [],       // tableau des éléments <span> du texte courant
    startTime: null,     // timestamp de la première frappe
    timerId: null,        // identifiant de l'intervalle du chronomètre
    isFinished: false,
    totalTyped: 0,        // nombre total de caractères saisis (pour la précision)
    totalCorrect: 0,      // nombre total de caractères corrects saisis
  };
  
  /* --------------------------------------------------------------------------
     4. Fonctions utilitaires
     -------------------------------------------------------------------------- */
  
  /**
   * Choisit un texte aléatoire dans la bibliothèque pour un niveau donné.
   * @param {string} level - "easy" | "medium" | "hard"
   * @returns {string}
   */
  function pickRandomText(level) {
    const pool = TEXTS[level];
    const index = Math.floor(Math.random() * pool.length);
    return pool[index];
  }
  
  /**
   * Construit la zone d'affichage du texte : un <span> par caractère.
   * @param {string} text
   */
  function renderText(text) {
    textDisplay.innerHTML = "";
    state.charSpans = [];
  
    for (const char of text) {
      const span = document.createElement("span");
      span.textContent = char;
      span.classList.add("char", "char--pending");
      textDisplay.appendChild(span);
      state.charSpans.push(span);
    }
  
    // Marque le premier caractère comme "curseur courant"
    if (state.charSpans.length > 0) {
      state.charSpans[0].classList.add("char--current");
    }
  }
  
  /**
   * Récupère le meilleur score (WPM) stocké pour un niveau donné.
   * @param {string} level
   * @returns {number}
   */
  function getBestScore(level) {
    const key = `${level}Best`;
    return Number(localStorage.getItem(key)) || 0;
  }
  
  /**
   * Enregistre le meilleur score (WPM) pour un niveau donné si le nouveau
   * score le dépasse. Retourne true si un nouveau record a été établi.
   * @param {string} level
   * @param {number} wpm
   * @returns {boolean}
   */
  function saveBestScoreIfHigher(level, wpm) {
    const key = `${level}Best`;
    const current = getBestScore(level);
    if (wpm > current) {
      localStorage.setItem(key, String(wpm));
      return true;
    }
    return false;
  }
  
  /**
   * Met à jour l'affichage du meilleur score pour le niveau actif.
   */
  function refreshBestScoreDisplay() {
    const best = getBestScore(state.level);
    bestScoreDisplay.textContent = best > 0 ? `${best} WPM` : "— WPM";
  }
  
  /**
   * Formate un nombre de secondes en chaîne lisible avec une décimale.
   * @param {number} seconds
   * @returns {string}
   */
  function formatSeconds(seconds) {
    return seconds.toFixed(1);
  }
  
  /* --------------------------------------------------------------------------
     5. Chronomètre
     -------------------------------------------------------------------------- */
  
  /**
   * Démarre le chronomètre et met à jour l'affichage chaque 100ms.
   */
  function startTimer() {
    state.startTime = Date.now();
    state.timerId = setInterval(() => {
      const elapsed = (Date.now() - state.startTime) / 1000;
      timerDisplay.textContent = formatSeconds(elapsed);
      updateLiveStats(elapsed);
    }, 100);
  }
  
  /**
   * Arrête le chronomètre.
   * @returns {number} Temps écoulé total en secondes.
   */
  function stopTimer() {
    clearInterval(state.timerId);
    state.timerId = null;
    return (Date.now() - state.startTime) / 1000;
  }
  
  /* --------------------------------------------------------------------------
     6. Calculs WPM / Précision
     -------------------------------------------------------------------------- */
  
  /**
   * Calcule le WPM à partir du nombre de caractères corrects et du temps écoulé.
   * @param {number} correctChars
   * @param {number} elapsedSeconds
   * @returns {number} WPM arrondi
   */
  function calculateWpm(correctChars, elapsedSeconds) {
    if (elapsedSeconds <= 0) return 0;
    const minutes = elapsedSeconds / 60;
    const wpm = (correctChars / 5) / minutes;
    return Math.round(wpm);
  }
  
  /**
   * Calcule la précision en pourcentage.
   * @param {number} correctChars
   * @param {number} typedChars
   * @returns {number} Précision arrondie
   */
  function calculateAccuracy(correctChars, typedChars) {
    if (typedChars <= 0) return 100;
    return Math.round((correctChars / typedChars) * 100);
  }
  
  /**
   * Met à jour les statistiques en direct (WPM live + précision live)
   * pendant la frappe, sans attendre la fin du test.
   * @param {number} elapsedSeconds
   */
  function updateLiveStats(elapsedSeconds) {
    const wpm = calculateWpm(state.totalCorrect, elapsedSeconds);
    const accuracy = calculateAccuracy(state.totalCorrect, state.totalTyped);
    liveWpmDisplay.textContent = wpm;
    liveAccuracyDisplay.textContent = accuracy;
  }
  
  /* --------------------------------------------------------------------------
     7. Message adapté au résultat
     -------------------------------------------------------------------------- */
  
  /**
   * Retourne un message d'encouragement adapté au score WPM obtenu.
   * @param {number} wpm
   * @returns {string}
   */
  function getResultMessage(wpm) {
    if (wpm < 40) return "Continue à t'entraîner !";
    if (wpm <= 70) return "Bon travail !";
    return "Excellent !";
  }
  
  /* --------------------------------------------------------------------------
     8. Gestion de la frappe (coloration en temps réel)
     -------------------------------------------------------------------------- */
  
  /**
   * Compare la saisie de l'utilisateur au texte de référence et met à jour
   * la coloration de chaque caractère ainsi que les compteurs globaux.
   */
  function handleInput() {
    if (state.isFinished) return;
  
    const typedValue = textInput.value;
  
    // Démarre le chrono à la toute première frappe
    if (state.startTime === null && typedValue.length > 0) {
      startTimer();
    }
  
    let correctCount = 0;
  
    state.charSpans.forEach((span, index) => {
      const typedChar = typedValue[index];
  
      span.classList.remove("char--correct", "char--incorrect", "char--pending", "char--current");
  
      if (typedChar === undefined) {
        // Caractère pas encore atteint
        span.classList.add("char--pending");
      } else if (typedChar === span.textContent) {
        span.classList.add("char--correct");
        correctCount++;
      } else {
        span.classList.add("char--incorrect");
      }
    });
  
    // Place le curseur visuel sur le caractère courant
    if (typedValue.length < state.charSpans.length) {
      state.charSpans[typedValue.length].classList.add("char--current");
    }
  
    // Met à jour les compteurs globaux utilisés pour WPM / précision
    state.totalTyped = typedValue.length;
    state.totalCorrect = correctCount;
  
    // Met à jour la barre de progression
    const progressPercent = Math.min(100, (typedValue.length / state.charSpans.length) * 100);
    progressFill.style.width = `${progressPercent}%`;
  
    // Vérifie si le texte est entièrement et correctement terminé
    if (typedValue.length >= state.charSpans.length) {
      finishTest();
    }
  }
  
  /* --------------------------------------------------------------------------
     9. Fin de test et affichage des résultats
     -------------------------------------------------------------------------- */
  
  /**
   * Finalise le test : arrête le chrono, calcule les statistiques finales,
   * affiche la carte de résultats et met à jour le meilleur score si besoin.
   */
  function finishTest() {
    state.isFinished = true;
    textInput.disabled = true;
  
    const elapsedSeconds = stopTimer();
    const finalWpm = calculateWpm(state.totalCorrect, elapsedSeconds);
    const finalAccuracy = calculateAccuracy(state.totalCorrect, state.totalTyped);
  
    // Affichage de la carte de résultats
    resultTime.textContent = `${formatSeconds(elapsedSeconds)}s`;
    resultWpm.textContent = finalWpm;
    resultAccuracy.textContent = `${finalAccuracy}%`;
    resultMessage.textContent = getResultMessage(finalWpm);
  
    const isNewRecord = saveBestScoreIfHigher(state.level, finalWpm);
    resultRecord.hidden = !isNewRecord;
    refreshBestScoreDisplay();
  
    resultCard.hidden = false;
  }
  
  /* --------------------------------------------------------------------------
     10. Réinitialisation / nouveau test
     -------------------------------------------------------------------------- */
  
  /**
   * Réinitialise complètement l'interface et l'état pour démarrer un nouveau
   * test, avec un nouveau texte aléatoire correspondant au niveau actif.
   */
  function startNewTest() {
    // Stoppe un éventuel chrono encore actif
    if (state.timerId !== null) {
      clearInterval(state.timerId);
    }
  
    // Réinitialise l'état
    state.currentText = pickRandomText(state.level);
    state.startTime = null;
    state.timerId = null;
    state.isFinished = false;
    state.totalTyped = 0;
    state.totalCorrect = 0;
  
    // Réinitialise l'interface
    renderText(state.currentText);
    textInput.value = "";
    textInput.disabled = false;
    textInput.focus();
  
    timerDisplay.textContent = "0.0";
    liveWpmDisplay.textContent = "0";
    liveAccuracyDisplay.textContent = "100";
    progressFill.style.width = "0%";
  
    resultCard.hidden = true;
    resultRecord.hidden = true;
  
    refreshBestScoreDisplay();
  }
  
  /* --------------------------------------------------------------------------
     11. Gestion du changement de niveau
     -------------------------------------------------------------------------- */
  
  /**
   * Met à jour le niveau actif et relance un nouveau test correspondant.
   */
  function handleLevelChange() {
    state.level = levelSelect.value;
    startNewTest();
  }
  
  /* --------------------------------------------------------------------------
     12. Initialisation et écouteurs d'événements
     -------------------------------------------------------------------------- */
  
  textInput.addEventListener("input", handleInput);
  newTestBtn.addEventListener("click", startNewTest);
  levelSelect.addEventListener("change", handleLevelChange);
  
  // Lancement initial de l'application
  state.level = levelSelect.value;
  startNewTest();