
// ========================================
// QUANTIDADES
// ========================================

const quantidades = {
    agua: 0,
    gas: 0
};


// ========================================
// FORMATAR MOEDA
// ========================================

function formatarMoeda(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}


// ========================================
// ALTERAR QUANTIDADE
// ========================================

function alterarQuantidade(produto, quantidade) {

    if (!quantidades.hasOwnProperty(produto)) {
        return;
    }

    quantidades[produto] += quantidade;

    // Nunca permitir quantidade negativa
    if (quantidades[produto] < 0) {
        quantidades[produto] = 0;
    }

    const elemento = document.getElementById(
        `quantidade-${produto}`
    );

    if (elemento) {
        elemento.textContent = quantidades[produto];
    }

    atualizarTotal();
    atualizarAvisoEntrega();
}


// ========================================
// PEGAR PREÇO DO PRODUTO
// ========================================

function obterPreco(produtoId) {

    const produto = CONFIG.produtos.find(
        produto => produto.id === produtoId
    );

    return produto ? produto.preco : 0;
}


// ========================================
// PEGAR LOCAL SELECIONADO
// ========================================

function obterLocalSelecionado() {

    const local = document.querySelector(
        'input[name="local"]:checked'
    );

    return local ? local.value : null;
}


// ========================================
// PEGAR PAGAMENTO SELECIONADO
// ========================================

function obterPagamentoSelecionado() {

    const pagamento = document.querySelector(
        'input[name="pagamento"]:checked'
    );

    return pagamento ? pagamento.value : null;
}


// ========================================
// ATUALIZAR TOTAL
// ========================================

function atualizarTotal() {

    const totalAgua =
        quantidades.agua * obterPreco("agua");

    const totalGas =
        quantidades.gas * obterPreco("gas");

    const total =
        totalAgua + totalGas;

    const elementoTotal =
        document.getElementById("total");

    if (elementoTotal) {
        elementoTotal.textContent =
            formatarMoeda(total);
    }
}


// ========================================
// ATUALIZAR SELEÇÃO VISUAL
// ========================================

function atualizarSelecaoVisual(
    nomeInput,
    classe
) {

    const opcoes = document.querySelectorAll(
        `input[name="${nomeInput}"]`
    );

    opcoes.forEach(input => {

        const label = input.closest(`.${classe}`);

        if (!label) {
            return;
        }

        if (input.checked) {
            label.classList.add("selecionada");
        } else {
            label.classList.remove("selecionada");
        }

    });
}


// ========================================
// ATUALIZAR AVISO RIACHÃO DE CIMA
// ========================================

function atualizarAvisoEntrega() {

    const local = obterLocalSelecionado();

    const aviso =
        document.getElementById(
            "aviso-riachao-cima"
        );

    if (!aviso) {
        return;
    }

    if (
        local === "Riachão de Cima" &&
        quantidades.agua < 2
    ) {

        aviso.style.display = "block";

    } else {

        aviso.style.display = "none";

    }
}


// ========================================
// CONFIGURAR SELEÇÕES
// ========================================

function configurarSelecoes() {

    const locais =
        document.querySelectorAll(
            'input[name="local"]'
        );

    locais.forEach(input => {

        input.addEventListener(
            "change",
            () => {

                atualizarSelecaoVisual(
                    "local",
                    "opcao-entrega"
                );

                atualizarAvisoEntrega();
            }
        );

    });


    const pagamentos =
        document.querySelectorAll(
            'input[name="pagamento"]'
        );

    pagamentos.forEach(input => {

        input.addEventListener(
            "change",
            () => {

                atualizarSelecaoVisual(
                    "pagamento",
                    "opcao-pagamento"
                );
            }
        );

    });


    atualizarSelecaoVisual(
        "local",
        "opcao-entrega"
    );


    atualizarSelecaoVisual(
        "pagamento",
        "opcao-pagamento"
    );


    atualizarAvisoEntrega();
}


// ========================================
// MOSTRAR ANIMAÇÃO DE SUCESSO
// ========================================

function mostrarAnimacaoSucesso() {

    const modal =
        document.getElementById(
            "sucesso-modal"
        );

    if (!modal) {
        return;
    }

    modal.classList.add("ativo");
}


// ========================================
// FINALIZAR PEDIDO
// ========================================

function finalizarPedido() {

    // ------------------------------------
    // PRODUTOS
    // ------------------------------------

    if (
        quantidades.agua === 0 &&
        quantidades.gas === 0
    ) {

        alert(
            "Selecione pelo menos um produto."
        );

        return;
    }


    // ------------------------------------
    // LOCAL
    // ------------------------------------

    const local =
        obterLocalSelecionado();

    if (!local) {

        alert(
            "Selecione o local de entrega."
        );

        return;
    }


    // ------------------------------------
    // REGRA RIACHÃO DE CIMA
    // ------------------------------------

    if (
        local === "Riachão de Cima" &&
        quantidades.agua < 2
    ) {

        alert(
            "Para Riachão de Cima, o pedido deve ter no mínimo 2 águas."
        );

        return;
    }


    // ------------------------------------
    // DADOS DO CLIENTE
    // ------------------------------------

    const nome =
        document
            .getElementById("nome")
            .value
            .trim();

    const whatsapp =
        document
            .getElementById("whatsapp")
            .value
            .trim();

    const referencia =
        document
            .getElementById("referencia")
            .value
            .trim();

    const observacao =
        document
            .getElementById("observacao")
            .value
            .trim();


    // ------------------------------------
    // NOME
    // ------------------------------------

    if (!nome) {

        alert(
            "Digite seu nome ou apelido."
        );

        return;
    }


    // ------------------------------------
    // WHATSAPP
    // ------------------------------------

    if (!whatsapp) {

        alert(
            "Digite seu WhatsApp."
        );

        return;
    }


    // ------------------------------------
    // PAGAMENTO
    // ------------------------------------

    const pagamento =
        obterPagamentoSelecionado();

    if (!pagamento) {

        alert(
            "Selecione uma forma de pagamento."
        );

        return;
    }


    // ====================================
    // DAQUI PARA BAIXO:
    // TUDO ESTÁ CORRETO
    // ====================================


    const totalAgua =
        quantidades.agua *
        obterPreco("agua");

    const totalGas =
        quantidades.gas *
        obterPreco("gas");

    const total =
        totalAgua + totalGas;


    // ------------------------------------
    // MONTAR PEDIDO
    // ------------------------------------

    let mensagem =
        "🛵 *NOVO PEDIDO - DISK ENTREGAS*%0A%0A";


    mensagem +=
        "🛒 *PEDIDO:*%0A";


    if (quantidades.agua > 0) {

        mensagem +=
            `💧 Água Mineral 20L: ${quantidades.agua}x%0A`;

    }


    if (quantidades.gas > 0) {

        mensagem +=
            `🔥 Gás P13: ${quantidades.gas}x%0A`;

    }


    mensagem +=
        `%0A📍 *LOCAL:* ${local}%0A`;


    mensagem +=
        `💳 *PAGAMENTO:* ${pagamento}%0A`;


    mensagem +=
        `💰 *TOTAL:* ${formatarMoeda(total)}%0A`;


    mensagem +=
        `%0A👤 *CLIENTE:* ${nome}%0A`;


    mensagem +=
        `📱 *WHATSAPP:* ${whatsapp}%0A`;


    if (referencia) {

        mensagem +=
            `📍 *REFERÊNCIA:* ${referencia}%0A`;

    }


    if (observacao) {

        mensagem +=
            `📝 *OBSERVAÇÃO:* ${observacao}%0A`;

    }


    // ------------------------------------
    // VERIFICAR NÚMERO DO DONO
    // ------------------------------------

    if (
        !CONFIG.whatsappDono ||
        CONFIG.whatsappDono ===
        "SEU_NUMERO_AQUI"
    ) {

        alert(
            "O número do WhatsApp do dono ainda não foi configurado."
        );

        return;
    }


    // ------------------------------------
    // URL DO WHATSAPP
    // ------------------------------------

    const url =
        `https://wa.me/${CONFIG.whatsappDono}?text=${mensagem}`;


    // ====================================
    // TUDO CERTO!
    // MOSTRA A ANIMAÇÃO
    // ====================================

    mostrarAnimacaoSucesso();


    // ------------------------------------
    // ABRIR WHATSAPP
    // ------------------------------------

    setTimeout(() => {

        window.open(
            url,
            "_blank"
        );

    }, 1800);

}


// ========================================
// INICIALIZAÇÃO
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        atualizarTotal();

        configurarSelecoes();

    }
);
