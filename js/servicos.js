// Carrega header e footer automaticamente
async function carregarLayout() {
    const header = await fetch('includes/header.html');
    document.getElementById('header').innerHTML = await header.text();

    const footer = await fetch('includes/footer.html');
    document.getElementById('footer').innerHTML = await footer.text();
}
carregarLayout();

// ── Dados fictícios de técnicos ──────────────────────────────
const tecnicosFicticios = [
    { nome: "Carlos Silva",    especialidade: "Celulares e tablets", bairro: "Tatuapé",        lat: -23.5400, lng: -46.5764, avaliacao: "⭐ 4.8" },
    { nome: "Ana Ferreira",    especialidade: "Notebooks e PCs",     bairro: "Mooca",          lat: -23.5490, lng: -46.5980, avaliacao: "⭐ 4.6" },
    { nome: "Roberto Mendes",  especialidade: "Eletrodomésticos",    bairro: "Vila Prudente",  lat: -23.5712, lng: -46.5630, avaliacao: "⭐ 4.9" },
    { nome: "Juliana Costa",   especialidade: "Celulares e tablets", bairro: "Penha",          lat: -23.5270, lng: -46.5400, avaliacao: "⭐ 4.7" },
    { nome: "Marcos Oliveira", especialidade: "TV e monitores",      bairro: "Aricanduva",     lat: -23.5601, lng: -46.5280, avaliacao: "⭐ 4.5" },
    { nome: "Priscila Nunes",  especialidade: "Notebooks e PCs",     bairro: "Belém",          lat: -23.5348, lng: -46.6004, avaliacao: "⭐ 4.8" },
    { nome: "Diego Ramos",     especialidade: "Eletrodomésticos",    bairro: "Brás",           lat: -23.5420, lng: -46.6180, avaliacao: "⭐ 4.4" },
];

// ── Coordenadas fixas das principais cidades brasileiras ─────
const coordenadas = {
    "são paulo":             { lat: -23.5505, lng: -46.6333 },
    "rio de janeiro":        { lat: -22.9068, lng: -43.1729 },
    "belo horizonte":        { lat: -19.9167, lng: -43.9345 },
    "salvador":              { lat: -12.9714, lng: -38.5014 },
    "fortaleza":             { lat: -3.7172,  lng: -38.5431 },
    "curitiba":              { lat: -25.4284, lng: -49.2733 },
    "manaus":                { lat: -3.1190,  lng: -60.0217 },
    "recife":                { lat: -8.0476,  lng: -34.8770 },
    "porto alegre":          { lat: -30.0346, lng: -51.2177 },
    "belém":                 { lat: -1.4558,  lng: -48.5044 },
    "goiânia":               { lat: -16.6869, lng: -49.2648 },
    "guarulhos":             { lat: -23.4543, lng: -46.5333 },
    "campinas":              { lat: -22.9099, lng: -47.0626 },
    "são luís":              { lat: -2.5297,  lng: -44.3028 },
    "são gonçalo":           { lat: -22.8268, lng: -43.0539 },
    "maceió":                { lat: -9.6658,  lng: -35.7350 },
    "duque de caxias":       { lat: -22.7856, lng: -43.3117 },
    "natal":                 { lat: -5.7945,  lng: -35.2110 },
    "campo grande":          { lat: -20.4697, lng: -54.6201 },
    "teresina":              { lat: -5.0892,  lng: -42.8019 },
    "são bernardo do campo": { lat: -23.6939, lng: -46.5650 },
    "nova iguaçu":           { lat: -22.7596, lng: -43.4511 },
    "joão pessoa":           { lat: -7.1195,  lng: -34.8450 },
    "santo andré":           { lat: -23.6639, lng: -46.5383 },
    "osasco":                { lat: -23.5329, lng: -46.7919 },
    "jaboatão dos guararapes": { lat: -8.1131, lng: -35.0145 },
    "ribeirão preto":        { lat: -21.1775, lng: -47.8103 },
    "uberlândia":            { lat: -18.9186, lng: -48.2772 },
    "sorocaba":              { lat: -23.5015, lng: -47.4526 },
    "contagem":              { lat: -19.9317, lng: -44.0536 },
    "aracaju":               { lat: -10.9472, lng: -37.0731 },
    "feira de santana":      { lat: -12.2664, lng: -38.9663 },
    "cuiabá":                { lat: -15.6014, lng: -56.0979 },
    "joinville":             { lat: -26.3044, lng: -48.8487 },
    "londrina":              { lat: -23.3045, lng: -51.1696 },
    "ananindeua":            { lat: -1.3656,  lng: -48.3722 },
    "niterói":               { lat: -22.8832, lng: -43.1036 },
    "belford roxo":          { lat: -22.7642, lng: -43.3997 },
    "carapicuíba":           { lat: -23.5228, lng: -46.8358 },
    "são josé dos campos":   { lat: -23.1794, lng: -45.8869 },
    "florianópolis":         { lat: -27.5954, lng: -48.5480 },
    "mauá":                  { lat: -23.6678, lng: -46.4611 },
    "santos":                { lat: -23.9618, lng: -46.3322 },
    "são josé do rio preto": { lat: -20.8197, lng: -49.3794 },
    "betim":                 { lat: -19.9678, lng: -44.1986 },
    "macapá":                { lat: 0.0356,   lng: -51.0705 },
    "porto velho":           { lat: -8.7612,  lng: -63.9004 },
    "rio branco":            { lat: -9.9754,  lng: -67.8249 },
    "palmas":                { lat: -10.2491, lng: -48.3243 },
    "boa vista":             { lat: 2.8235,   lng: -60.6758 },
};

// Coordenadas das capitais por UF (fallback)
const capitais = {
    "SP": coordenadas["são paulo"],      "RJ": coordenadas["rio de janeiro"],
    "MG": coordenadas["belo horizonte"], "BA": coordenadas["salvador"],
    "CE": coordenadas["fortaleza"],      "PR": coordenadas["curitiba"],
    "AM": coordenadas["manaus"],         "PE": coordenadas["recife"],
    "RS": coordenadas["porto alegre"],   "PA": coordenadas["belém"],
    "GO": coordenadas["goiânia"],        "MA": coordenadas["são luís"],
    "AL": coordenadas["maceió"],         "RN": coordenadas["natal"],
    "MS": coordenadas["campo grande"],   "PI": coordenadas["teresina"],
    "PB": coordenadas["joão pessoa"],    "SE": coordenadas["aracaju"],
    "MT": coordenadas["cuiabá"],         "SC": coordenadas["florianópolis"],
    "AP": coordenadas["macapá"],         "RO": coordenadas["porto velho"],
    "AC": coordenadas["rio branco"],     "TO": coordenadas["palmas"],
    "RR": coordenadas["boa vista"],      "DF": { lat: -15.7801, lng: -47.9292 },
    "ES": { lat: -20.3155, lng: -40.3128 },
};

let mapa = null;

// Formata CEP automaticamente (00000-000)
document.getElementById('cep-input').addEventListener('input', function () {
    let v = this.value.replace(/\D/g, '');
    if (v.length > 5) v = v.slice(0, 5) + '-' + v.slice(5, 8);
    this.value = v;
});

// Busca ao pressionar Enter
document.getElementById('cep-input').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') buscarTecnicos();
});

async function buscarTecnicos() {
    const cep = document.getElementById('cep-input').value.replace(/\D/g, '');
    const msg = document.getElementById('busca-msg');

    if (cep.length !== 8) {
        msg.textContent = '⚠️ Digite um CEP válido com 8 dígitos.';
        msg.className = 'busca-msg erro';
        return;
    }

    msg.textContent = 'Buscando localização...';
    msg.className = 'busca-msg';

    try {
        const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);

        if (!res.ok) {
            throw new Error(`ViaCEP retornou status ${res.status}`);
        }

        const data = await res.json();
        console.log('ViaCEP retornou:', data);

        if (data.erro) {
            msg.textContent = '❌ CEP não encontrado. Verifique e tente novamente.';
            msg.className = 'busca-msg erro';
            return;
        }

        const cidadeOriginal = data.localidade;
        const cidadeNorm = cidadeOriginal.toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        console.log('Cidade normalizada:', cidadeNorm);

        // Busca no dicionário ignorando acentos
        let coords = null;
        for (const [chave, val] of Object.entries(coordenadas)) {
            const chaveNorm = chave.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            if (chaveNorm === cidadeNorm) { coords = val; break; }
        }

        // Fallback: capital do estado
        if (!coords) {
            console.log(`Cidade "${cidadeOriginal}" não está no dicionário, usando capital de ${data.uf}`);
            coords = capitais[data.uf] || { lat: -15.7801, lng: -47.9292 };
        }

        console.log('Coordenadas usadas:', coords);

        msg.textContent = `✅ ${tecnicosFicticios.length} técnicos encontrados em ${cidadeOriginal}!`;
        exibirMapa(coords.lat, coords.lng);

    } catch (e) {
        console.error('Erro na busca:', e);
        msg.textContent = `❌ Erro: ${e.message}`;
        msg.className = 'busca-msg erro';
    }
}

function exibirMapa(lat, lng) {
    document.getElementById('mapa-wrapper').style.display = 'block';

    if (mapa) { mapa.remove(); mapa = null; }

    mapa = L.map('mapa').setView([lat, lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(mapa);

    // Marcador do usuário (verde)
    const iconeUsuario = L.divIcon({
        html: '<div style="background:#2dce7a;width:16px;height:16px;border-radius:50%;border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.4)"></div>',
        className: '',
        iconAnchor: [8, 8]
    });
    L.marker([lat, lng], { icon: iconeUsuario })
        .addTo(mapa)
        .bindPopup('<strong>📍 Você está aqui</strong>')
        .openPopup();

    // Marcadores dos técnicos (laranja)
    const iconeTecnico = L.divIcon({
        html: '<div style="background:#ff8c00;width:14px;height:14px;border-radius:50%;border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.4)"></div>',
        className: '',
        iconAnchor: [7, 7]
    });

    tecnicosFicticios.forEach(t => {
        const latVar = lat + (Math.random() * 0.04 - 0.02);
        const lngVar = lng + (Math.random() * 0.04 - 0.02);

        L.marker([latVar, lngVar], { icon: iconeTecnico })
            .addTo(mapa)
            .bindPopup(`
                <strong>${t.nome}</strong><br>
                🔧 ${t.especialidade}<br>
                📌 ${t.bairro}<br>
                ${t.avaliacao}
            `);
    });
}
