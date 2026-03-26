/* ================================================
   ABAPYRA TECH — Lógica do Modal de Autenticação
   Arquivo: js/auth.js
   ================================================ */

/* ── Abrir modal ── */
function abrirModal(aba = 'login') {
  const overlay = document.getElementById('auth-overlay');
  console.log('abrirModal chamado, overlay:', overlay);

  // Se o modal ainda não foi injetado pelo fetch, tenta novamente
  if (!overlay) {
    console.log('Overlay não encontrado, tentando novamente em 100ms');
    setTimeout(() => abrirModal(aba), 100);
    return;
  }

  console.log('Abrindo modal - removendo hidden e adicionando ativo');
  overlay.removeAttribute('hidden');
  overlay.classList.add('ativo');
  document.body.style.overflow = 'hidden';
  trocarAba(aba);

  setTimeout(() => {
    const primeiro = overlay.querySelector('.auth-painel.active input');
    if (primeiro) primeiro.focus();
  }, 300);
}

/* ── Fechar modal ── */
function fecharModal() {
  const overlay = document.getElementById('auth-overlay');
  if (!overlay) return;
  overlay.classList.remove('ativo');
  document.body.style.overflow = '';
  limparMensagens();
}

/* ── Fechar ao clicar no overlay (fora do modal) ── */
document.addEventListener('click', function (e) {
  const overlay = document.getElementById('auth-overlay');
  if (e.target === overlay) fecharModal();
});

/* ── Fechar com tecla ESC ── */
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') fecharModal();
});

/* ── Trocar aba (Login / Cadastro) ── */
function trocarAba(aba) {
  const paineis   = document.querySelectorAll('.auth-painel');
  const abas      = document.querySelectorAll('.auth-tab');
  const indicador = document.getElementById('tab-indicator');

  paineis.forEach(p => p.classList.remove('active'));
  abas.forEach(a => {
    a.classList.remove('active');
    a.setAttribute('aria-selected', 'false');
  });

  document.getElementById('painel-' + aba).classList.add('active');
  const tabAtiva = document.getElementById('tab-' + aba);
  tabAtiva.classList.add('active');
  tabAtiva.setAttribute('aria-selected', 'true');

  // Move o indicador deslizante
  if (indicador) {
    indicador.style.transform = aba === 'cadastro' ? 'translateX(100%)' : 'translateX(0)';
  }

  limparMensagens();
}

/* ── Mostrar / ocultar senha ── */
function toggleSenha(inputId, btn) {
  const input = document.getElementById(inputId);
  const icon  = btn.querySelector('i');

  if (input.type === 'password') {
    input.type = 'text';
    icon.classList.replace('fa-eye', 'fa-eye-slash');
  } else {
    input.type = 'password';
    icon.classList.replace('fa-eye-slash', 'fa-eye');
  }
}

/* ── Força da senha ── */
function verificarForca(senha) {
  const barras = [
    document.getElementById('fb1'),
    document.getElementById('fb2'),
    document.getElementById('fb3'),
    document.getElementById('fb4'),
  ];
  const texto = document.getElementById('forca-texto');
  if (!barras[0]) return;

  let pontos = 0;
  if (senha.length >= 8)          pontos++;
  if (/[A-Z]/.test(senha))        pontos++;
  if (/[0-9]/.test(senha))        pontos++;
  if (/[^A-Za-z0-9]/.test(senha)) pontos++;

  const niveis = [
    { cor: '#ef4444', label: 'Muito fraca' },
    { cor: '#f97316', label: 'Fraca'       },
    { cor: '#eab308', label: 'Média'       },
    { cor: '#22c55e', label: 'Forte'       },
  ];

  barras.forEach((b, i) => {
    b.style.background = i < pontos ? niveis[pontos - 1].cor : '#e5e7eb';
  });

  texto.textContent = senha.length > 0 ? (niveis[pontos - 1]?.label ?? '') : '';
  texto.style.color = pontos > 0 ? niveis[pontos - 1].cor : '#6b7280';
}

/* ── Mostrar mensagem de feedback ── */
function mostrarMsg(id, texto, tipo = 'erro') {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = texto;
  el.className   = 'auth-msg auth-msg--' + tipo;
}

function limparMensagens() {
  document.querySelectorAll('.auth-msg').forEach(el => {
    el.textContent = '';
    el.className   = 'auth-msg';
  });
}

/* ── Handler: Login ── */
function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const senha = document.getElementById('login-senha').value;

  if (!email || !senha) {
    mostrarMsg('login-msg', 'Preencha todos os campos.');
    return;
  }

  mostrarMsg('login-msg', 'Entrando...', 'info');

  setTimeout(() => {
    // Substitua por sua chamada real ao backend (fetch/axios)
    mostrarMsg('login-msg', '✅ Login realizado com sucesso!', 'sucesso');
    setTimeout(() => fecharModal(), 1200);
  }, 1000);
}

/* ── Handler: Cadastro ── */
function handleCadastro(e) {
  e.preventDefault();
  const nome     = document.getElementById('cad-nome').value.trim();
  const email    = document.getElementById('cad-email').value.trim();
  const senha    = document.getElementById('cad-senha').value;
  const confirma = document.getElementById('cad-confirma').value;
  const termos   = document.getElementById('cad-termos').checked;

  if (!nome || !email || !senha || !confirma) {
    mostrarMsg('cad-msg', 'Preencha todos os campos.');
    return;
  }

  if (senha !== confirma) {
    mostrarMsg('cad-msg', 'As senhas não coincidem.');
    return;
  }

  if (senha.length < 8) {
    mostrarMsg('cad-msg', 'A senha deve ter pelo menos 8 caracteres.');
    return;
  }

  if (!termos) {
    mostrarMsg('cad-msg', 'Aceite os termos para continuar.');
    return;
  }

  mostrarMsg('cad-msg', 'Criando sua conta...', 'info');

  setTimeout(() => {
    // Substitua por sua chamada real ao backend (fetch/axios)
    mostrarMsg('cad-msg', '✅ Conta criada! Bem-vindo à Abapyra!', 'sucesso');
    setTimeout(() => {
      fecharModal();
      trocarAba('login');
    }, 1400);
  }, 1000);
}