// ──────────────────────────────────────────────────────────────
// CONSTANTES E CACHE DE ELEMENTOS
// ──────────────────────────────────────────────────────────────

const ELEMENTS = {
    cepInput: null,
    buscaMsg: null,
    mapaWrapper: null,
    mapaElement: null
};

const CONFIG = {
    VIACEP_URL: 'https://viacep.com.br/ws',
    MAPS_URL: 'https://maps.google.com/maps',
    CEP_LENGTH: 8,
    DEFAULT_ZOOM: 15,
    SEARCH_QUERY: 'assistência técnica eletrônicos'
};

const MSG = {
    INVALID_CEP: '⚠️ Digite um CEP válido com 8 dígitos.',
    LOADING: 'Buscando dados do CEP...',
    NOT_FOUND: '❌ CEP não encontrado. Verifique e tente novamente.',
    ERROR: '❌ Erro: ',
    SUCCESS: '✅ Endereço: ',
    SEARCHING: '. Procurando técnicos próximos...'
};

// ──────────────────────────────────────────────────────────────
// INICIALIZAÇÃO E EVENT LISTENERS
// ──────────────────────────────────────────────────────────────

function inicializar() {
    ELEMENTS.cepInput = document.getElementById('cep-input');
    ELEMENTS.buscaMsg = document.getElementById('busca-msg');
    ELEMENTS.mapaWrapper = document.getElementById('mapa-wrapper');
    ELEMENTS.mapaElement = document.getElementById('mapa');

    if (!ELEMENTS.cepInput || !ELEMENTS.buscaMsg) {
        console.error('Elementos necessários não encontrados no HTML');
        return;
    }

    ELEMENTS.cepInput.addEventListener('input', formatarCEP);
    ELEMENTS.cepInput.addEventListener('keydown', (e) => e.key === 'Enter' && buscarTecnicos());
    document.getElementById('busca-btn')?.addEventListener('click', buscarTecnicos);

    const form = document.getElementById('cadastro-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Formulário submetido');
        });
    }
}

// Iniciar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializar);
} else {
    inicializar();
}

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

function definirMensagem(texto, classe = 'busca-msg') {
    ELEMENTS.buscaMsg.textContent = texto;
    ELEMENTS.buscaMsg.className = classe;
}

// ──────────────────────────────────────────────────────────────
// BUSCA DE CEP
// ──────────────────────────────────────────────────────────────

async function buscarTecnicos() {
    const cep = extrairDigitosCEP(ELEMENTS.cepInput.value);

    if (cep.length !== CONFIG.CEP_LENGTH) {
        definirMensagem(MSG.INVALID_CEP, 'busca-msg erro');
        return;
    }

    definirMensagem(MSG.LOADING);

    try {
        const res = await fetch(`${CONFIG.VIACEP_URL}/${cep}/json/`);

        if (!res.ok) {
            throw new Error(`ViaCEP retornou status ${res.status}`);
        }

        const data = await res.json();

        if (data.erro) {
            definirMensagem(MSG.NOT_FOUND, 'busca-msg erro');
            return;
        }

        const { logradouro, bairro, localidade, uf } = data;
        const cepFormatado = `${cep.slice(0, 5)}-${cep.slice(5, 8)}`;
        const enderecoExibido = montarEnderecoExibido(logradouro, bairro);

        definirMensagem(
            `${MSG.SUCCESS}${enderecoExibido}, ${localidade} - ${uf}${MSG.SEARCHING}`,
            'busca-msg sucesso'
        );

        exibirMapa(logradouro, bairro, localidade, uf, cepFormatado);

    } catch (e) {
        console.error('Erro na busca:', e);
        definirMensagem(`${MSG.ERROR}${e.message}`, 'busca-msg erro');
    }
}

function montarEnderecoExibido(rua, bairro) {
    const partes = [];
    if (rua) partes.push(rua);
    if (bairro) partes.push(bairro);
    return partes.length ? partes.join(', ') : 'Endereço não específico';
}

// ──────────────────────────────────────────────────────────────
// EXIBIÇÃO DO MAPA
// ──────────────────────────────────────────────────────────────

function exibirMapa(rua, bairro, cidade, uf, cep) {
    if (!ELEMENTS.mapaWrapper || !ELEMENTS.mapaElement) {
        console.error('Elementos do mapa não encontrados');
        return;
    }

    ELEMENTS.mapaWrapper.style.display = 'block';

    const endereco = `${rua || ''} ${bairro || ''} ${cidade} ${cep}`.trim();
    const query = encodeURIComponent(`${endereco} ${CONFIG.SEARCH_QUERY}`);
    const src = `${CONFIG.MAPS_URL}?q=${query}&z=${CONFIG.DEFAULT_ZOOM}&output=embed&hl=pt-BR`;

    ELEMENTS.mapaElement.src = src;
}