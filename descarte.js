
// ── CONSTANTES E CONFIGURAÇÃO ──────────────────────────────────

const CONFIG = {
  VIACEP_URL:   'https://viacep.com.br/ws',
  MAPS_URL:     'https://maps.google.com/maps',
  CEP_LENGTH:   8,
  DEFAULT_ZOOM: 15,
  SEARCH_QUERY: 'ponto de descarte mais próximo'
};

const MSG = {
  INVALID_CEP: '⚠️ Digite um CEP válido com 8 dígitos.',
  LOADING:     'Buscando dados do CEP...',
  NOT_FOUND:   '❌ CEP não encontrado. Verifique e tente novamente.',
  ERROR:       '❌ Erro ao buscar CEP. Tente novamente.',
  SUCCESS:     '✅ Endereço: ',
  SEARCHING:   '. Procurando pontos de descarte próximos...'
};

// ── CACHE DE ELEMENTOS DO DOM ──────────────────────────────────

const ELEMENTS = {
  cepInput:     null,
  buscaMsg:     null,
  buscaBtn:     null,
  mapaWrapper:  null,
  mapaElement:  null,
  exemploCards: null
};

// ── INICIALIZAÇÃO ──────────────────────────────────────────────

function inicializar() {
  ELEMENTS.cepInput     = document.getElementById('cep-input');
  ELEMENTS.buscaMsg     = document.getElementById('busca-msg');
  ELEMENTS.buscaBtn     = document.getElementById('busca-btn');
  ELEMENTS.mapaWrapper  = document.getElementById('mapa-wrapper');
  ELEMENTS.mapaElement  = document.getElementById('mapa');
  ELEMENTS.exemploCards = document.getElementById('exemplo-cards');

  if (!ELEMENTS.cepInput || !ELEMENTS.buscaMsg || !ELEMENTS.buscaBtn) {
    console.error('[AbapyraTech] Elementos da busca não encontrados no DOM.');
    return;
  }

  ELEMENTS.cepInput.addEventListener('input', formatarCEP);
  ELEMENTS.cepInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') buscarPontos();
  });
  ELEMENTS.buscaBtn.addEventListener('click', buscarPontos);

  iniciarObservadorScroll();
}

// Aguarda o DOM estar pronto (compatível com header/footer carregados por fetch)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializar);
} else {
  inicializar();
}

// ── FORMATAÇÃO DE CEP ──────────────────────────────────────────

function formatarCEP(e) {
  let valor = e.target.value.replace(/\D/g, '');
  if (valor.length > 5) {
    valor = valor.slice(0, 5) + '-' + valor.slice(5, 8);
  }
  e.target.value = valor;
}

function extrairDigitosCEP(cep) {
  return cep.replace(/\D/g, '');
}

// ── MENSAGENS DE FEEDBACK ──────────────────────────────────────

function definirMensagem(texto, classe = '') {
  ELEMENTS.buscaMsg.innerHTML = texto;
  ELEMENTS.buscaMsg.className = classe;
}

function montarEnderecoExibido(rua, bairro) {
  const partes = [];
  if (rua)    partes.push(rua);
  if (bairro) partes.push(bairro);
  return partes.length ? partes.join(', ') : 'Endereço não específico';
}

// ── BUSCA DE CEP VIA VIACEP ────────────────────────────────────

async function buscarPontos() {
  const cep = extrairDigitosCEP(ELEMENTS.cepInput.value);

  if (cep.length !== CONFIG.CEP_LENGTH) {
    definirMensagem(MSG.INVALID_CEP, 'erro');
    return;
  }

  // UI: estado de loading
  definirMensagem('<span class="spinner"></span>' + MSG.LOADING);
  ELEMENTS.buscaBtn.disabled = true;
  ELEMENTS.mapaWrapper.style.display = 'none';

  try {
    const url = `${CONFIG.VIACEP_URL}/${cep}/json/`;
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      mode: 'cors'
    });

    if (!res.ok) {
      throw new Error(`Servidor retornou status ${res.status}`);
    }

    const data = await res.json();

    // ViaCEP retorna { erro: true } quando o CEP não existe
    if (data.erro) {
      definirMensagem(MSG.NOT_FOUND, 'erro');
      return;
    }

    const { logradouro, bairro, localidade, uf } = data;
    const cepFormatado    = `${cep.slice(0, 5)}-${cep.slice(5, 8)}`;
    const enderecoExibido = montarEnderecoExibido(logradouro, bairro);

    definirMensagem(
      `${MSG.SUCCESS}${enderecoExibido}, ${localidade} – ${uf}${MSG.SEARCHING}`,
      'sucesso'
    );

    exibirMapa(logradouro, bairro, localidade, uf, cepFormatado);

  } catch (erro) {
    console.error('[AbapyraTech] Erro ao consultar ViaCEP:', erro);
    definirMensagem(MSG.ERROR, 'erro');
  } finally {
    ELEMENTS.buscaBtn.disabled = false;
  }
}

// ── EXIBIÇÃO DO MAPA ───────────────────────────────────────────

function exibirMapa(rua, bairro, cidade, uf, cep) {
  if (!ELEMENTS.mapaWrapper || !ELEMENTS.mapaElement) {
    console.error('[AbapyraTech] Elementos do mapa não encontrados.');
    return;
  }

  // Endereço simples: apenas rua, bairro e cidade (sem o CEP que pode causar confusão)
  const endereco = `${rua}, ${bairro}, ${cidade}`;
  const enderecoEncodado = encodeURIComponent(endereco);
  
  // Busca focada: pontos de descarte NESTE endereço
  const query = encodeURIComponent(`${CONFIG.SEARCH_QUERY}`);
  
  // URL: maps com q do endereço + busca de ecopontos
  const src = `${CONFIG.MAPS_URL}?q=ponto+de+descarte+em+${enderecoEncodado}&z=18&output=embed&hl=pt-BR`;

  ELEMENTS.mapaElement.src           = src;
  ELEMENTS.mapaWrapper.style.display = 'block';

  // Esconde cards de exemplo após primeira busca
  if (ELEMENTS.exemploCards) {
    ELEMENTS.exemploCards.style.display = 'none';
  }

  // Scroll suave até o mapa
  setTimeout(() => {
    ELEMENTS.mapaWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 400);
}

// ── ANIMAÇÕES DE SCROLL (Intersection Observer) ────────────────

function iniciarObservadorScroll() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  const seletores = '.page-descarte .motivo-card, .page-descarte .item-card, .page-descarte .result-card';

  // Usa MutationObserver para lidar com elementos que podem ser
  // inseridos depois (ex: header/footer via fetch)
  function observarElementos() {
    document.querySelectorAll(seletores).forEach((el) => {
      if (el.dataset.observed) return; // evita duplicatas
      el.dataset.observed    = 'true';
      el.style.opacity       = '0';
      el.style.transform     = 'translateY(22px)';
      el.style.transition    = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(el);
    });
  }

  observarElementos();

  // Re-observa se o DOM mudar (header/footer injetados depois)
  const mutObs = new MutationObserver(observarElementos);
  mutObs.observe(document.body, { childList: true, subtree: true });
}