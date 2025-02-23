document.addEventListener("DOMContentLoaded", function () {
    const track = document.querySelector(".gallery-track");
    const prevBtn = document.querySelector(".gallery-prev");
    const nextBtn = document.querySelector(".gallery-next");
    const dotsContainer = document.querySelector(".gallery-dots");
    let items = document.querySelectorAll(".gallery-item");

    const itemWidth = items[0].clientWidth + 20; // Considera o espaçamento entre imagens (gap)
    let index = 1; // Começa na segunda imagem (depois do clone)

    const totalImages = items.length;

    // Criar dinamicamente os dots
    dotsContainer.innerHTML = "";
    for (let i = 0; i < totalImages; i++) {
        const dot = document.createElement("span");
        dot.classList.add("dot");
        if (i === 0) dot.classList.add("active");
        dotsContainer.appendChild(dot);
    }

    const dots = document.querySelectorAll(".dot");

    // Clona a primeira e última imagem 
    const firstClone = items[0].cloneNode(true);
    const lastClone = items[items.length - 1].cloneNode(true);

    firstClone.id = "first-clone";
    lastClone.id = "last-clone";

    track.appendChild(firstClone);
    track.insertBefore(lastClone, items[0]);

    items = document.querySelectorAll(".gallery-item");
    const totalItems = items.length;

    // Ajusta a posição inicial
    track.style.transform = `translateX(${-index * itemWidth}px)`;

    function updateGallery(instant = false) {
        track.style.transition = instant ? "none" : "transform 0.5s ease-in-out";
        track.style.transform = `translateX(${-index * itemWidth}px)`;

        // Atualiza os indicadores (dots)
        dots.forEach(dot => dot.classList.remove("active"));
        dots[(index - 1) % totalImages].classList.add("active");
    }

    function nextSlide() {
        index++;
        updateGallery();

        if (index >= totalItems - 1) {
            setTimeout(() => {
                index = 1;
                updateGallery(true); // Reset imediato sem animação
            }, 500);
        }
    }

    function prevSlide() {
        index--;
        updateGallery();

        if (index <= 0) {
            setTimeout(() => {
                index = totalItems - 2;
                updateGallery(true);
            }, 500);
        }
    }

    nextBtn.addEventListener("click", nextSlide);
    prevBtn.addEventListener("click", prevSlide);

    dots.forEach((dot, i) => {
        dot.addEventListener("click", () => {
            index = i + 1;
            updateGallery();
        });
    });

    window.addEventListener("resize", () => {
        track.style.transition = "none";
        updateGallery(true);
        setTimeout(() => {
            track.style.transition = "transform 0.5s ease-in-out";
        }, 50);
    });

    updateGallery();
});
