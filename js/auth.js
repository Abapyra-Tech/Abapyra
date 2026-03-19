/* ══════════════════════════════
   AUTH MODAL — auth.js
   ══════════════════════════════ */

// ── Abre o modal na aba desejada ──
function abrirModal(aba = 'login') {
  const overlay = document.getElementById('modal-auth');
  if (!overlay) return;
  overlay.classList.add('ativo');
  trocarAba(aba);
  document.body.style.overflow = 'hidden'; // trava o scroll da página
}

// ── Fecha o modal ──
function fecharModal() {
  const overlay = document.getElementById('modal-auth');
  if (!overlay) return;
  overlay.classList.remove('ativo');
  document.body.style.overflow = ''; // libera o scroll
  limparErros();
}

// ── Troca entre as abas Login / Cadastro ──
function trocarAba(aba) {
  const formLogin    = document.getElementById('form-login');
  const formCadastro = document.getElementById('form-cadastro');
  const tabs         = document.querySelectorAll('.tab');

  formLogin.classList.toggle('hidden', aba !== 'login');
  formCadastro.classList.toggle('hidden', aba !== 'cadastro');

  tabs.forEach((tab, i) => {
    tab.classList.toggle('ativo',
      (i === 0 && aba === 'login') ||
      (i === 1 && aba === 'cadastro')
    );
  });

  limparErros();
}

// ── Validação e submit do Login ──
function submeterLogin() {
  const email = document.getElementById('login-email');
  const senha = document.getElementById('login-senha');
  let valido = true;

  limparErros();

  if (!email.value || !email.value.includes('@')) {
    marcarErro(email, 'E-mail inválido');
    valido = false;
  }

  if (!senha.value || senha.value.length < 6) {
    marcarErro(senha, 'Senha deve ter ao menos 6 caracteres');
    valido = false;
  }

  if (!valido) return;

  // ✅ Aqui você conecta com seu backend / Firebase / etc.
  console.log('Login:', { email: email.value, senha: senha.value });
  mostrarMensagem('form-login', 'Login realizado com sucesso!', 'sucesso');
}

// ── Validação e submit do Cadastro ──
function submeterCadastro() {
  const nome      = document.getElementById('cadastro-nome');
  const email     = document.getElementById('cadastro-email');
  const senha     = document.getElementById('cadastro-senha');
  const confirmar = document.getElementById('cadastro-confirmar');
  let valido = true;

  limparErros();

  if (!nome.value.trim()) {
    marcarErro(nome, 'Informe seu nome');
    valido = false;
  }

  if (!email.value || !email.value.includes('@')) {
    marcarErro(email, 'E-mail inválido');
    valido = false;
  }

  if (!senha.value || senha.value.length < 6) {
    marcarErro(senha, 'Senha deve ter ao menos 6 caracteres');
    valido = false;
  }

  if (confirmar.value !== senha.value) {
    marcarErro(confirmar, 'As senhas não coincidem');
    valido = false;
  }

  if (!valido) return;

  // ✅ Aqui você conecta com seu backend / Firebase / etc.
  console.log('Cadastro:', { nome: nome.value, email: email.value });
  mostrarMensagem('form-cadastro', 'Conta criada com sucesso!', 'sucesso');
}

// ── Marca campo com erro ──
function marcarErro(input, mensagem) {
  input.classList.add('erro');

  const msg = document.createElement('span');
  msg.className = 'campo-erro';
  msg.style.cssText = 'color:#ef4444; font-size:0.75rem; margin-top:-6px;';
  msg.textContent = mensagem;

  input.insertAdjacentElement('afterend', msg);
}

// ── Mostra mensagem geral no formulário ──
function mostrarMensagem(formId, texto, tipo) {
  const form = document.getElementById(formId);
  let msg = form.querySelector('.modal-msg');

  if (!msg) {
    msg = document.createElement('div');
    msg.className = 'modal-msg';
    form.appendChild(msg);
  }

  msg.textContent = texto;
  msg.className = `modal-msg ${tipo}`;
}

// ── Limpa todos os erros ──
function limparErros() {
  document.querySelectorAll('.modal-form input').forEach(i => i.classList.remove('erro'));
  document.querySelectorAll('.campo-erro').forEach(e => e.remove());
  document.querySelectorAll('.modal-msg').forEach(m => {
    m.className = 'modal-msg';
    m.textContent = '';
  });
}

// ── Fecha clicando fora do box ──
document.addEventListener('click', function (e) {
  const overlay = document.getElementById('modal-auth');
  if (e.target === overlay) fecharModal();
});

// ── Fecha com tecla ESC ──
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') fecharModal();
});
