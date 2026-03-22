let fonteAtual = 100;
let contrasteAtivo = false;
let leituraAtiva = false;

// Abre/fecha painel
function toggleAcess() {
    const painel = document.getElementById('acessPainel');
    painel.classList.toggle('aberto');
}

// Fecha ao clicar fora
document.addEventListener('click', function (e) {
    const widget = document.getElementById('acessWidget');
    if (!widget.contains(e.target)) {
        document.getElementById('acessPainel').classList.remove('aberto');
    }
});

// Fonte
function alterarFonte(direcao) {
    fonteAtual = Math.min(Math.max(fonteAtual + direcao * 10, 80), 140);
    document.documentElement.style.fontSize = fonteAtual + '%';
    salvarPrefs();
}

// Alto contraste
function toggleContraste() {
    contrasteAtivo = !contrasteAtivo;
    document.body.classList.toggle('alto-contraste', contrasteAtivo);
    document.getElementById('btnContraste').classList.toggle('ativo', contrasteAtivo);
    document.getElementById('btnContraste').textContent = contrasteAtivo ? 'Desativar' : 'Ativar';
    salvarPrefs();
}

// Leitura de tela
function toggleLeitura() {
    leituraAtiva = !leituraAtiva;
    document.body.classList.toggle('leitura-ativa', leituraAtiva);
    document.getElementById('btnLeitura').classList.toggle('ativo', leituraAtiva);
    document.getElementById('btnLeitura').textContent = leituraAtiva ? 'Desativar' : 'Ativar';

    if (leituraAtiva) {
        ativarLeitura();
    } else {
        desativarLeitura();
    }
    salvarPrefs();
}

// Leitura de tela — fala o texto ao passar o mouse
function ativarLeitura() {
    document.querySelectorAll('p, h1, h2, h3, h4, a, button, label, span').forEach(el => {
        el.addEventListener('mouseenter', falarTexto);
    });
}

function desativarLeitura() {
    speechSynthesis.cancel();
    document.querySelectorAll('p, h1, h2, h3, h4, a, button, label, span').forEach(el => {
        el.removeEventListener('mouseenter', falarTexto);
    });
}

function falarTexto(e) {
    const texto = e.target.innerText?.trim();
    if (!texto) return;
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.95;
    speechSynthesis.speak(utterance);
}

// Reset
function resetAcess() {
    fonteAtual = 100;
    contrasteAtivo = false;
    leituraAtiva = false;

    document.documentElement.style.fontSize = '100%';
    document.body.classList.remove('alto-contraste', 'leitura-ativa');
    document.getElementById('btnContraste').classList.remove('ativo');
    document.getElementById('btnContraste').textContent = 'Ativar';
    document.getElementById('btnLeitura').classList.remove('ativo');
    document.getElementById('btnLeitura').textContent = 'Ativar';

    desativarLeitura();
    localStorage.removeItem('acessPrefs');
}

// Salva preferências no localStorage
function salvarPrefs() {
    localStorage.setItem('acessPrefs', JSON.stringify({ fonteAtual, contrasteAtivo, leituraAtiva }));
}

// Carrega preferências salvas ao abrir a página
window.addEventListener('load', () => {
    const salvo = localStorage.getItem('acessPrefs');
    if (!salvo) return;
    const prefs = JSON.parse(salvo);

    if (prefs.fonteAtual) {
        fonteAtual = prefs.fonteAtual;
        document.documentElement.style.fontSize = fonteAtual + '%';
    }
    if (prefs.contrasteAtivo) toggleContraste();
    if (prefs.leituraAtiva) toggleLeitura();
});