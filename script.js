const flowerContainer = document.querySelector(".flower-container");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function createFlower() {
    if (!flowerContainer || reducedMotion.matches) return;

    const flower = document.createElement("div");
    flower.className = "flower";
    flower.style.left = `${8 + Math.random() * 84}%`;
    flower.style.top = `${10 + Math.random() * 72}%`;
    flower.style.animationDelay = `${Math.random() * -4}s`;

    for (let index = 0; index < 8; index += 1) {
        const petal = document.createElement("span");
        petal.className = "petal";
        petal.style.transform = `translate(-50%, -100%) rotate(${index * 45}deg)`;
        flower.appendChild(petal);
    }

    flowerContainer.appendChild(flower);
    window.setTimeout(() => flower.remove(), 9000);
}

function createSparkle() {
    if (reducedMotion.matches) return;
    const sparkle = document.createElement("span");
    sparkle.className = "sparkle";
    sparkle.style.left = `${Math.random() * 100}vw`;
    sparkle.style.top = "-10px";
    document.body.appendChild(sparkle);
    window.setTimeout(() => sparkle.remove(), 4000);
}

const tabs = [...document.querySelectorAll(".tab")];
const panels = [...document.querySelectorAll(".tab-panel")];

function activateTab(tab) {
    tabs.forEach((item) => {
        const isActive = item === tab;
        item.classList.toggle("is-active", isActive);
        item.setAttribute("aria-selected", String(isActive));
        item.tabIndex = isActive ? 0 : -1;
    });
    panels.forEach((panel) => {
        panel.hidden = panel.id !== tab.dataset.panel;
        panel.classList.toggle("is-visible", !panel.hidden);
    });
}

tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activateTab(tab));
    tab.addEventListener("keydown", (event) => {
        if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
        event.preventDefault();
        const direction = event.key === "ArrowRight" ? 1 : -1;
        const nextTab = tabs[(index + direction + tabs.length) % tabs.length];
        activateTab(nextTab);
        nextTab.focus();
    });
});

const musicButton = document.querySelector("#musicBtn");
const music = document.querySelector("#bgMusic");
const musicStatus = document.querySelector("#musicStatus");
const liveRegion = document.querySelector(".live-region");

musicButton.addEventListener("click", async () => {
    if (music.paused) {
        try {
            await music.play();
            musicButton.innerHTML = '<span aria-hidden="true">Ⅱ</span> Pausar';
            musicButton.setAttribute("aria-pressed", "true");
            musicStatus.textContent = "Reproduciendo música";
            liveRegion.textContent = "La música está reproduciéndose.";
        } catch {
            musicStatus.textContent = "No se pudo reproducir";
            liveRegion.textContent = "No se pudo reproducir la música.";
        }
    } else {
        music.pause();
        musicButton.innerHTML = '<span aria-hidden="true">♪</span> Escuchar';
        musicButton.setAttribute("aria-pressed", "false");
        musicStatus.textContent = "Música en pausa";
        liveRegion.textContent = "La música está en pausa.";
    }
});

document.querySelector("#surpriseBtn").addEventListener("click", () => {
    if (reducedMotion.matches) {
        liveRegion.textContent = "El jardín está listo para ti.";
        return;
    }

    const colors = ["#f7c84b", "#ed8468", "#8fc7aa", "#f8f3df", "#a9b8ed"];
    for (let index = 0; index < 36; index += 1) {
        const confetti = document.createElement("span");
        confetti.className = "confetti";
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.backgroundColor = colors[index % colors.length];
        confetti.style.animationDelay = `${Math.random() * .7}s`;
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        document.body.appendChild(confetti);
        window.setTimeout(() => confetti.remove(), 3600);
    }
    liveRegion.textContent = "El jardín se llenó de color. ✨";
});

if (!reducedMotion.matches) {
    for (let index = 0; index < 4; index += 1) createFlower();
    window.setInterval(createFlower, 2600);
    window.setInterval(createSparkle, 850);
}
