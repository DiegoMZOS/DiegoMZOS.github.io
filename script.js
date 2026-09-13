const views = [...document.querySelectorAll(".view")];
const viewLinks = [...document.querySelectorAll("[data-view-link]")];
const navItems = [...document.querySelectorAll("[data-nav]")];
const liveRegion = document.querySelector(".live-region");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const gameSymbols = ["☀️", "🌼", "☁️", "⚓", "🌊", "⭐"];
let gameRound = 1;
let gameScore = 0;
let gameTarget = "";
let gameLocked = false;

function showView(name, updateHistory = true) {
    views.forEach((view) => {
        const active = view.dataset.view === name;
        view.hidden = !active;
        view.classList.toggle("is-active", active);
    });
    navItems.forEach((item) => item.classList.toggle("is-active", item.dataset.nav === name));
    if (updateHistory) history.pushState({ view: name }, "", `#${name}`);
    const activeView = document.querySelector(`#view-${name}`);
    activeView?.querySelector(".back-link")?.focus({ preventScroll: true });
    liveRegion.textContent = `Vista ${name} abierta.`;
}

viewLinks.forEach((link) => link.addEventListener("click", () => showView(link.dataset.viewLink)));
window.addEventListener("popstate", () => showView(location.hash.slice(1) || "inicio", false));
showView(location.hash.slice(1) || "inicio", false);

const islandMessage = document.querySelector("#islandMessage");
document.querySelectorAll(".island").forEach((island) => {
    island.addEventListener("click", () => {
        document.querySelectorAll(".island").forEach((item) => item.classList.remove("is-selected"));
        island.classList.add("is-selected");
        islandMessage.textContent = `${island.dataset.emoji} ${island.dataset.message}`;
        liveRegion.textContent = island.dataset.message;
    });

    function updateProgress() {
        const finished = gameRound >= 3 && gameScore / 3 >= 0.8;
        const progress = finished ? 100 : Math.round(((gameRound - 1) / 3) * 100);
        document.querySelector("#progressLabel").textContent = `${progress}%`;
        document.querySelector("#routeCurrent").classList.toggle("is-unlocked", progress >= 67);
        document.querySelector("#routeLine").classList.toggle("is-done", progress >= 100);
        document.querySelector("#routeTreasure").classList.toggle("is-unlocked", progress >= 100);
    }

    function createRound() {
        const compassCard = document.querySelector("#compassCard");
        const choices = document.querySelector("#gameChoices");
        const feedback = document.querySelector("#gameFeedback");
        const roundLabel = document.querySelector("#gameRound");
        const scoreLabel = document.querySelector("#gameScore");
        if (!compassCard || !choices) return;

        gameLocked = false;
        gameTarget = gameSymbols[Math.floor(Math.random() * gameSymbols.length)];
        const options = [gameTarget];
        while (options.length < 3) {
            const option = gameSymbols[Math.floor(Math.random() * gameSymbols.length)];
            if (!options.includes(option)) options.push(option);
        }
        options.sort(() => Math.random() - .5);
        compassCard.innerHTML = `${gameTarget}<small>Encuentra este símbolo</small>`;
        roundLabel.textContent = gameRound;
        scoreLabel.textContent = gameScore;
        feedback.textContent = "Elige la carta que coincide con la brújula.";
        choices.innerHTML = options.map((symbol) => `<button class="choice" type="button" data-symbol="${symbol}" aria-label="Elegir ${symbol}">${symbol}</button>`).join("");
        choices.querySelectorAll(".choice").forEach((choice) => {
            choice.addEventListener("click", () => answerRound(choice));
        });
    }

    function answerRound(choice) {
        if (gameLocked) return;
        gameLocked = true;
        const correct = choice.dataset.symbol === gameTarget;
        if (correct) gameScore += 1;
        choice.classList.add(correct ? "is-correct" : "is-wrong");
        document.querySelectorAll(".choice").forEach((item) => {
            item.disabled = true;
            if (item.dataset.symbol === gameTarget) item.classList.add("is-correct");
        });
        const feedback = document.querySelector("#gameFeedback");
        feedback.textContent = correct ? "¡Rumbo correcto! La tripulación avanza." : `El rumbo era ${gameTarget}. No pasa nada, seguimos navegando.`;
        document.querySelector("#gameScore").textContent = gameScore;
        window.setTimeout(() => {
            if (gameRound < 3) {
                gameRound += 1;
                updateProgress();
                createRound();
            } else {
                updateProgress();
                const percent = Math.round((gameScore / 3) * 100);
                feedback.textContent = percent >= 80
                    ? `¡Tesoro desbloqueado! Lograste ${percent}%. Ve a la sección Tesoro.`
                    : `Partida terminada con ${percent}%. Reinicia para intentarlo de nuevo.`;
                if (percent >= 80) document.querySelector("#routeTreasure").classList.add("is-unlocked");
                liveRegion.textContent = feedback.textContent;
            }
        }, 850);
    }

    document.querySelector("#restartGame").addEventListener("click", () => {
        gameRound = 1;
        gameScore = 0;
        updateProgress();
        createRound();
    });
    createRound();
});

const musicButton = document.querySelector("#musicBtn");
const music = document.querySelector("#bgMusic");
musicButton.addEventListener("click", async () => {
    if (music.paused) {
        try {
            await music.play();
            musicButton.innerHTML = "<span>Ⅱ</span> Pausar música";
            musicButton.setAttribute("aria-pressed", "true");
            liveRegion.textContent = "La música de abordo está sonando.";
        } catch {
            liveRegion.textContent = "No se pudo reproducir la música.";
        }
    } else {
        music.pause();
        musicButton.innerHTML = "<span>♫</span> Música de abordo";
        musicButton.setAttribute("aria-pressed", "false");
        liveRegion.textContent = "La música está en pausa.";
    }
});

document.querySelector("#surpriseBtn").addEventListener("click", () => {
    if (reducedMotion.matches) {
        liveRegion.textContent = "Tesoro encontrado. ✨";
        return;
    }
    const colors = ["#f8c84e", "#ef806a", "#5ed1cf", "#e9fbf2", "#ffe69a"];
    for (let index = 0; index < 42; index += 1) {
        const piece = document.createElement("span");
        piece.className = "confetti";
        piece.style.left = `${Math.random() * 100}vw`;
        piece.style.backgroundColor = colors[index % colors.length];
        piece.style.animationDelay = `${Math.random() * .7}s`;
        piece.style.transform = `rotate(${Math.random() * 360}deg)`;
        document.body.appendChild(piece);
        window.setTimeout(() => piece.remove(), 3800);
    }
    liveRegion.textContent = "El tesoro se abrió y el mar se llenó de color.";
});

document.querySelector("#downloadCard").addEventListener("click", () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 760;
    const context = canvas.getContext("2d");
    const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#07344a");
    gradient.addColorStop(1, "#071d2b");
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "#f8c84e";
    context.lineWidth = 8;
    context.strokeRect(34, 34, canvas.width - 68, canvas.height - 68);
    context.fillStyle = "#f8c84e";
    context.font = "bold 30px Arial";
    context.fillText("REGISTRO DE LA TRIPULACIÓN", 90, 120);
    context.fillStyle = "#f6fbef";
    context.font = "bold 72px Georgia";
    context.fillText("El tesoro más grande", 90, 270);
    context.fillStyle = "#ffe69a";
    context.fillText("es tenerte a bordo.", 90, 355);
    context.fillStyle = "#a8ced0";
    context.font = "28px Arial";
    context.fillText("Una postal de la Grand Line para Kanel", 90, 465);
    context.fillStyle = "#f8c84e";
    context.font = "54px Arial";
    context.fillText("✦  🌼  ⚓  🌼  ✦", 90, 610);
    const link = document.createElement("a");
    link.download = "postal-grand-line-kanel.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
    liveRegion.textContent = "Postal descargada.";
});
