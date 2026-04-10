
const botoesComprar = document.querySelectorAll(".comprar");

botoesComprar.forEach(botao => {
    botao.addEventListener("click", () => {
        const card = botao.closest(".cartao");

        const nome = card.querySelector("h3").innerText;
        const precoTexto = card.querySelector(".preco").innerText;
        const preco = parseFloat(precoTexto.replace("R$", "").replace(",", "."));

        adicionarAoCarrinho(nome, preco);
    });
});

function adicionarAoCarrinho(nome, preco) { 
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

    const existente = carrinho.find(p => p.nome === nome);

    if (existente) {
        existente.quantidade++;
    } else {
        carrinho.push({
            nome,
            preco,
            quantidade: 1
        });
    }

    localStorage.setItem("carrinho", JSON.stringify(carrinho));

    atualizarCarrinhoUI();
    atualizarContador();
}

// Atualiza a interface do carrinho

function atualizarCarrinhoUI() {
    const lista = document.getElementById("lista-carrinho");
    const totalEl = document.getElementById("total");

    if (!lista || !totalEl) return;

    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

    lista.innerHTML = "";
    let total = 0;

    carrinho.forEach(produto => {
        const li = document.createElement("li");

       li.innerHTML = `
    ${produto.nome} (x${produto.quantidade}) - R$ ${produto.preco * produto.quantidade}
    <button onclick="removerItem('${produto.nome}')">❌</button>
`;

        lista.appendChild(li);

        total += produto.preco * produto.quantidade;
    });

    totalEl.innerText = "Total: R$ " + total;
}

window.addEventListener("DOMContentLoaded", () => {
    atualizarCarrinhoUI();
    atualizarContador();
});




function removerItem(nome) {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

    carrinho = carrinho.filter(produto => produto.nome !== nome);

    localStorage.setItem("carrinho", JSON.stringify(carrinho));

    atualizarCarrinhoUI();
    atualizarContador();
}




// CEP
const btnBuscar = document.querySelector(".btn-buscar");
const inputCep = document.querySelector(".input-cep input");
const resultado = document.getElementById("resultado-cep");

if (btnBuscar && inputCep && resultado) {
    btnBuscar.addEventListener("click", () => {
        const cep = inputCep.value.replace(/\D/g, "");

        if (cep.length !== 8) {
            resultado.innerText = "❌ Digite um CEP válido!";
            return;
        }

        resultado.innerText = "Buscando...";

        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(res => res.json())
            .then(data => {
                if (data.erro) {
                    resultado.innerText = "❌ CEP não encontrado!";
                } else {
                    resultado.innerText =
                        `✔ ${data.logradouro}, ${data.bairro} - ${data.localidade}/${data.uf}`;
                }
            })
            .catch(() => {
                resultado.innerText = "Erro ao buscar CEP";
            });
    });
}

inputCep.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        btnBuscar.click();
    }
});


// FORM
const form = document.getElementById("cadastro-form");

if (form) {
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const nome = form.nome.value.trim();
        const cep = form.cep.value.trim();
        const contato = form.contato.value.trim();

        if (!nome || !cep || !contato) {
            alert("Preencha todos os campos!");
            return;
        }

        if (!contato.includes("@") && contato.length < 8) {
            alert("Digite um e-mail ou telefone válido!");
            return;
        }

        alert("✅ Cadastro efetuado com sucesso!");
        form.reset();
    });
}


// FILTRO
const categorias = document.querySelectorAll(".categorias a");
const cartoes = document.querySelectorAll(".cartao");

categorias.forEach(cat => {
    cat.addEventListener("click", (e) => {
        e.preventDefault();

        const tipo = cat.dataset.categoria;

        cartoes.forEach(cartao => {
            if (tipo === "todos" || cartao.dataset.categoria === tipo) {
                cartao.style.display = "";
            } else {
                cartao.style.display = "none";
            }
        });
    });
});


// ANIMAÇÃO
const elementos = document.querySelectorAll(".cartao");


window.addEventListener("scroll", animarScroll);


// CONTADOR
const contador = document.getElementById("contador");

if (contador) {
    let valor = 0;

    const intervalo = setInterval(() => {
        valor++;
        contador.innerText = valor;

        if (valor === 140) {
            clearInterval(intervalo);
        }
    }, 40);
}

function atualizarContador() {
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    const totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);

    document.getElementById("contador-carrinho").innerText = totalItens;
}

const cartao = document.querySelectorAll(".cartao");

window.addEventListener("scroll", () => {
    cartoes.forEach(cartao => {
        const pos = cartao.getBoundingClientRect().top;

        if (pos < window.innerHeight - 100) {
            cartao.classList.add("show");
        }
    });
});


function favoritar(elemento) {
    elemento.classList.toggle("ativo");
}

function toggleTema() {
  document.body.classList.toggle("light");

  const temaAtual = document.body.classList.contains("light") ? "light" : "dark";
  localStorage.setItem("tema", temaAtual);
};


