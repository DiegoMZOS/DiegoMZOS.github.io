const views = [...document.querySelectorAll(".view")];
const viewLinks = [...document.querySelectorAll("[data-view-link]")];
const navItems = [...document.querySelectorAll("[data-nav]")];
const liveRegion = document.querySelector(".live-region");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

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
