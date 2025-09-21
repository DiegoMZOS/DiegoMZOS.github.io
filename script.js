function createFlower() {
    const flowerContainer = document.querySelector(".flower-container");

    // Número máximo de flores en pantalla
    const maxFlowersOnScreen = 5;

    // Verificar si ya hay 10 flores en pantalla
    if (document.querySelectorAll(".flower").length >= maxFlowersOnScreen) {
        return; // No crear más flores
    }

    // Número máximo de flores a crear simultáneamente (entre 1 y 5)
    const maxFlowers = Math.ceil(Math.random() * 5 + 1);
    const flowerSize = 100; // Tamaño de la flor

    // Arrays para almacenar las posiciones de las flores existentes
    const existingPositions = [];

    for (let j = 0; j < maxFlowers; j++) {
        let positionValid = false;
        let randomX, randomY;

        // Generar posiciones aleatorias y verificar que no se superpongan con las existentes
        while (!positionValid) {
            randomX = Math.random() * (window.innerWidth - flowerSize);
            randomY = Math.random() * (window.innerHeight - flowerSize);

            positionValid = true;

            // Verificar si la nueva posición está lo suficientemente alejada de las posiciones existentes
            for (const position of existingPositions) {
                const distance = Math.sqrt(Math.pow(position.x - randomX, 2) + Math.pow(position.y - randomY, 2));
                if (distance < 0) { // Rango de 300 píxeles recomendado para pc, en celular con 0
                    positionValid = false;
                    break;
                }
            }
        }

        // Agregar la nueva posición a la lista de posiciones existentes
        existingPositions.push({ x: randomX, y: randomY });

        const flower = document.createElement("div");
        flower.classList.add("flower");
        flower.style.animation = "fadeInFlower 1s ease-in-out both"; // Agregar animación de entrada a la flor

        for (let i = 1; i <= 10; i++) {
            const petal = document.createElement("div");
            petal.classList.add("petal", `p${i}`);
            flower.appendChild(petal);

            // Tiempo aleatorio de desaparición entre 2 y 5 segundos
            const disappearanceTime = Math.random() * 3000 + 2000;

            // Agrega una animación de salida a los pétalos con el tiempo aleatorio de desaparición
            petal.style.animation = `fadeOutPetal 0.5s ease-in-out both ${i * 0.1}s, fadeOutFlower 0.5s ease-in-out both ${disappearanceTime}s`;
        }

        flower.style.position = "fixed";
        flower.style.left = `${randomX}px`;
        flower.style.top = `${randomY}px`;

        flowerContainer.appendChild(flower);

        // Tiempo aleatorio de desaparición entre 2 y 5 segundos
        const disappearanceTime = Math.random() * 3000 + 2000;

        setTimeout(() => {
            flowerContainer.removeChild(flower);

            // Remover la posición de la flor que desapareció de la lista de posiciones existentes
            existingPositions.splice(existingPositions.findIndex(pos => pos.x === randomX && pos.y === randomY), 1);
        }, disappearanceTime);
    }
	
	setInterval(createSparkle, 300);
// Control de música
const musicBtn = document.getElementById("musicBtn");
const bgMusic = document.getElementById("bgMusic");

musicBtn.addEventListener("click", () => {
    if (bgMusic.paused) {
        bgMusic.play();
        musicBtn.textContent = "⏸️ Pausar";
    } else {
        bgMusic.pause();
        musicBtn.textContent = "🎵 Música";
    }
});


// Botón sorpresa con confeti
const surpriseBtn = document.getElementById("surpriseBtn");

surpriseBtn.addEventListener("click", () => {
    for (let i = 0; i < 40; i++) {
        const confetti = document.createElement("div");
        confetti.classList.add("confetti");

        // Posición inicial aleatoria
        confetti.style.left = Math.random() * window.innerWidth + "px";

        // Colores aleatorios
        const colors = ["#ff4d4d", "#ffd633", "#66ff66", "#66b3ff", "#ff66cc", "#ffffff"];
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

        // Tamaños variados
        const size = Math.random() * 8 + 6;
        confetti.style.width = size + "px";
        confetti.style.height = (size * 2) + "px";

        // Velocidad y rotación aleatoria
        confetti.style.animationDuration = (Math.random() * 2 + 2) + "s";
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;

        document.body.appendChild(confetti);

        setTimeout(() => confetti.remove(), 4000);
    }
});


}

// Cambia el intervalo de tiempo para controlar la aparición de las flores cada 3 segundos
setInterval(createFlower, 1000); // Nuevas flores cada 3 segundos

function createSparkle() {
    const sparkle = document.createElement("div");
    sparkle.classList.add("sparkle");
    sparkle.style.left = Math.random() * window.innerWidth + "px";
    sparkle.style.top = "-10px";
    document.body.appendChild(sparkle);

    setTimeout(() => sparkle.remove(), 4000);
}


