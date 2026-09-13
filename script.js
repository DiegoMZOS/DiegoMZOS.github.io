const views = [...document.querySelectorAll(".view")];
const viewLinks = [...document.querySelectorAll("[data-view-link]")];
const liveRegion = document.querySelector(".live-region");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function showView(name, updateHistory = true) {
    views.forEach((view) => {
        const active = view.dataset.view === name;
        view.hidden = !active;
        view.classList.toggle("is-active", active);
    });
    if (updateHistory) history.pushState({ view: name }, "", `#${name}`);
    liveRegion.textContent = `Vista ${name} abierta.`;
}

viewLinks.forEach((link) => link.addEventListener("click", () => showView(link.dataset.viewLink)));
window.addEventListener("popstate", () => showView(location.hash.slice(1) || "inicio", false));
showView(location.hash.slice(1) || "inicio", false);

const islandModal = document.querySelector("#islandModal");
const closeIsland = document.querySelector("#closeIsland");
document.querySelectorAll(".island").forEach((island) => {
    island.addEventListener("click", () => {
        document.querySelectorAll(".island").forEach((item) => item.classList.remove("is-selected"));
        island.classList.add("is-selected");
        document.querySelector("#islandMessage").textContent = `${island.dataset.emoji} ${island.dataset.message}`;
        document.querySelector("#islandModalEmoji").textContent = island.dataset.emoji;
        document.querySelector("#islandModalTitle").textContent = island.querySelector("strong").textContent;
        document.querySelector("#islandModalMessage").textContent = island.dataset.message;
        islandModal.hidden = false;
        closeIsland.focus();
    });
});
closeIsland.addEventListener("click", () => { islandModal.hidden = true; });
islandModal.addEventListener("click", (event) => {
    if (event.target === islandModal) islandModal.hidden = true;
});

const musicButton = document.querySelector("#musicBtn");
const music = document.querySelector("#bgMusic");
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
function playButtonSound() {
    if (audioContext.state === "suspended") audioContext.resume();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(520, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(760, audioContext.currentTime + 0.07);
    gain.gain.setValueAtTime(0.045, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.09);
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
}
document.addEventListener("click", (event) => {
    if (event.target.closest("button, a")) playButtonSound();
});
music.volume = 0.55;
function setMusicButton(isPlaying) {
    musicButton.innerHTML = isPlaying
        ? "<span>■</span> Detener música"
        : "<span>▶</span> Activar música";
    musicButton.setAttribute("aria-pressed", String(isPlaying));
}

music.play().then(() => {
    setMusicButton(true);
}).catch(() => {
    setMusicButton(false);
    musicButton.setAttribute("aria-pressed", "false");
    liveRegion.textContent = "El navegador requiere una interacción para iniciar la música.";
});
musicButton.addEventListener("click", async () => {
    if (music.paused) {
        try {
            await music.play();
            setMusicButton(true);
            liveRegion.textContent = "La música está sonando.";
        } catch {
            setMusicButton(false);
            liveRegion.textContent = "No se pudo iniciar la música.";
        }
    } else {
        music.pause();
        setMusicButton(false);
        liveRegion.textContent = "La música está detenida.";
    }
});

const gameSymbols = ["⚓", "🌊", "🎩", "🐚", "⭐", "🧭"];
const fallingGame = document.querySelector("#fallingGame");
const compassCard = document.querySelector("#compassCard");
const gameScoreLabel = document.querySelector("#gameScore");
const gameTimeLabel = document.querySelector("#gameTime");
const gameFeedback = document.querySelector("#gameFeedback");
let gameScore = 0;
let gameTime = 30;
let gameTarget = "⚓";
let gameTimer;
let spawnTimer;
let gameRunning = false;
let guaranteeTarget = true;

function setGameTarget() {
    gameTarget = gameSymbols[Math.floor(Math.random() * gameSymbols.length)];
    guaranteeTarget = true;
    compassCard.innerHTML = `${gameTarget}<small>Recolecta este objeto</small>`;
}

function spawnObject() {
    if (!gameRunning) return;
    const object = document.createElement("button");
    object.type = "button";
    object.className = "falling-object";
    const shouldSpawnTarget = guaranteeTarget || Math.random() < 0.5;
    object.textContent = shouldSpawnTarget
        ? gameTarget
        : gameSymbols[Math.floor(Math.random() * gameSymbols.length)];
    if (shouldSpawnTarget) guaranteeTarget = false;
    object.style.left = `${Math.random() * 88 + 2}%`;
    object.style.animationDuration = `${Math.random() * 1.7 + 2.2}s`;
    object.setAttribute("aria-label", `Objeto ${object.textContent}`);
    object.addEventListener("click", () => {
        if (object.dataset.checked) return;
        object.dataset.checked = "true";
        if (object.textContent === gameTarget) {
            gameScore += 1;
            gameScoreLabel.textContent = gameScore;
            object.classList.add("is-correct");
            setGameTarget();
            if (gameScore >= 10) finishGame();
        } else {
            object.classList.add("is-wrong");
            gameFeedback.textContent = "Ese objeto no es el indicado; el puntaje solo cuenta con el símbolo correcto.";
        }
        window.setTimeout(() => object.remove(), 250);
    });
    object.addEventListener("animationend", () => object.remove());
    fallingGame.appendChild(object);
}

function finishGame() {
    gameRunning = false;
    window.clearInterval(gameTimer);
    window.clearInterval(spawnTimer);
    document.querySelectorAll(".falling-object").forEach((object) => object.remove());
    gameFeedback.textContent = "¡Nivel completado! Regresa a la cubierta para canjear el tesoro.";
    liveRegion.textContent = gameFeedback.textContent;
    document.querySelector("#startGame").textContent = "✓ Nivel completado";
    document.querySelector("#startGame").disabled = true;
    document.querySelector("#returnHome").hidden = false;
    document.querySelector("#progressLabel").textContent = "100%";
    document.querySelector(".route-card__heading strong").lastChild.textContent = " · Tesoro desbloqueado";
    document.querySelector("#routeCurrent").classList.add("is-unlocked");
    document.querySelector("#routeLine").classList.add("is-done");
    const treasureButton = document.querySelector("#routeTreasure");
    treasureButton.disabled = false;
    treasureButton.classList.add("is-unlocked");
    treasureButton.setAttribute("aria-label", "Abrir tesoro desbloqueado");
}

function resetGame() {
    gameRunning = false;
    window.clearInterval(gameTimer);
    window.clearInterval(spawnTimer);
    document.querySelectorAll(".falling-object").forEach((object) => object.remove());
    gameScore = 0;
    gameTime = 30;
    gameScoreLabel.textContent = "0";
    gameTimeLabel.textContent = "30";
    gameFeedback.textContent = "Pulsa iniciar para comenzar la travesía.";
    document.querySelector("#startGame").textContent = "▶ Iniciar juego";
    document.querySelector("#startGame").disabled = false;
    document.querySelector("#returnHome").hidden = true;
    setGameTarget();
}

function startGame() {
    resetGame();
    gameRunning = true;
    gameFeedback.textContent = "¡Atrapa solo el objeto que muestra la brújula!";
    spawnObject();
    spawnTimer = window.setInterval(spawnObject, 650);
    gameTimer = window.setInterval(() => {
        gameTime -= 1;
        gameTimeLabel.textContent = gameTime;
        if (gameTime <= 0) {
            gameRunning = false;
            window.clearInterval(gameTimer);
            window.clearInterval(spawnTimer);
            gameFeedback.textContent = gameScore >= 10
                ? "¡Nivel completado! Regresa a la cubierta para canjear el tesoro."
                : `Se acabó el tiempo con ${gameScore}/10 aciertos. Reinicia para volver a intentarlo.`;
        }
    }, 1000);
}

document.querySelector("#startGame").addEventListener("click", startGame);
document.querySelector("#restartGame").addEventListener("click", resetGame);
setGameTarget();

const treasureModal = document.querySelector("#treasureModal");
document.querySelector("#routeTreasure").addEventListener("click", () => {
    treasureModal.hidden = false;
    document.querySelector("#closeTreasure").focus();
});
document.querySelector("#closeTreasure").addEventListener("click", () => { treasureModal.hidden = true; });
treasureModal.addEventListener("click", (event) => {
    if (event.target === treasureModal) treasureModal.hidden = true;
});

function downloadCanvasCard() {
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 760;
    const context = canvas.getContext("2d");
    const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#6b3b21");
    gradient.addColorStop(1, "#1d120d");
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "#e5ad45";
    context.lineWidth = 10;
    context.strokeRect(35, 35, canvas.width - 70, canvas.height - 70);
    context.fillStyle = "#ffe0a0";
    context.font = "bold 30px Arial";
    context.fillText("NIVEL COMPLETADO · TRIPULACIÓN KANEL", 90, 120);
    context.fillStyle = "#fff6df";
    context.font = "bold 70px Georgia";
    context.fillText("El tesoro más grande", 90, 280);
    context.fillStyle = "#ffe0a0";
    context.fillText("es tenerte a bordo.", 90, 370);
    context.fillStyle = "#d1b995";
    context.font = "28px Arial";
    context.fillText("Una postal de nuestra travesía por alta mar", 90, 480);
    context.font = "58px Arial";
    context.fillText("⚓  🌊  🎩  🐚  ⭐", 90, 620);
    const link = document.createElement("a");
    link.download = "tesoro-tripulacion-kanel.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
}

function downloadRewardImage() {
    const link = document.createElement("a");
    link.href = "recompensa-tesoro.png";
    link.download = "recompensa-tesoro.png";
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    link.remove();
    liveRegion.textContent = "La imagen de recompensa se está descargando.";
}

document.querySelector("#downloadCard").addEventListener("click", downloadCanvasCard);
document.querySelector("#downloadReward").addEventListener("click", downloadRewardImage);
