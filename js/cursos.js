const track = document.getElementById('carrossel');
const cards = document.querySelectorAll('.curso-card');
const dotsContainer = document.getElementById('dots');

const visiveis = 3;
let atual = 0;
const total = cards.length - visiveis + 1;

// Cria dots
for (let i = 0; i < total; i++) {
    const dot = document.createElement('span');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('ativo');
    dot.onclick = () => irPara(i);
    dotsContainer.appendChild(dot);
}

function irPara(index) {
    atual = Math.max(0, Math.min(index, total - 1));

    // Calcula largura real do card + gap em tempo de execução
    const cardWidth = cards[0].offsetWidth + 20;
    track.style.transform = `translateX(-${atual * cardWidth}px)`;

    document.querySelectorAll('.dot').forEach((d, i) => {
        d.classList.toggle('ativo', i === atual);
    });
}

function moverCarrossel(direcao) {
    irPara(atual + direcao);
}