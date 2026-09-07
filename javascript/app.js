// =====================================================
// VARIÁVEIS
// =====================================================

// Guarda a quantidade de cada produto
const quantidades = {
    agua: 0,
    gas: 0
};


// =====================================================
// FUNÇÃO PARA FORMATAR DINHEIRO
// =====================================================

function formatarMoeda(valor) {

    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

}


// =====================================================
// ALTERAR QUANTIDADE
// =====================================================

// Essa função é chamada pelos botões + e -

function alterarQuantidade(produtoId, valor) {

    // Verifica se o produto existe
    if (!(produtoId in quantidades)) {
        return;
    }

    // Adiciona ou remove a quantidade
    quantidades[produtoId] += valor;

    // Não permite quantidade negativa
    if (quantidades[produtoId] < 0) {
        quantidades[produtoId] = 0;
    }

    // Pega o elemento que mostra a quantidade
    const elementoQuantidade =
        document.getElementById(`quantidade-${produtoId}`);

    // Atualiza a quantidade na tela
    if (elementoQuantidade) {
        elementoQuantidade.textContent =
            quantidades[produtoId];
    }

    // Atualiza o preço total
    atualizarTotal();
}


// =====================================================
// PEGAR PREÇO DO PRODUTO
// =====================================================

function obterPreco(produtoId) {

    const produto = CONFIG.produtos.find(
        item => item.id === produtoId
    );

    if (produto) {
        return produto.preco;
    }

    return 0;
}


// =====================================================
// PEGAR LOCAL SELECIONADO
// =====================================================

function obterLocalSelecionado() {

    return document.querySelector(
        'input[name="local"]:checked'
    );

}


// =====================================================
// PEGAR PAGAMENTO SELECIONADO
// =====================================================

function obterPagamentoSelecionado() {

    return document.querySelector(
        'input[name="pagamento"]:checked'
    );

}


// =====================================================
// ATUALIZAR TOTAL
// =====================================================

function atualizarTotal() {

    // Calcula o valor das águas
    const valorAgua =
        quantidades.agua * obterPreco("agua");


    // Calcula o valor dos gases
    const valorGas =
        quantidades.gas * obterPreco("gas");


    // Soma os produtos
    const subtotal =
        valorAgua + valorGas;


    // Começa com entrega grátis
    let taxaEntrega = 0;


    // Pega o local escolhido
    const localSelecionado =
        obterLocalSelecionado();


    // Se existe um local selecionado
    if (localSelecionado) {

        // Procura o local na configuração
        const local =
            CONFIG.locais.find(
                item =>
                    item.nome === localSelecionado.value
            );


        // Se encontrou o local
        if (local) {
            taxaEntrega = local.taxa;
        }

    }


    // Calcula o total
    const total =
        subtotal + taxaEntrega;


    // Atualiza subtotal
    const elementoSubtotal =
        document.getElementById("subtotal");

    if (elementoSubtotal) {
        elementoSubtotal.textContent =
            formatarMoeda(subtotal);
    }


    // Atualiza taxa de entrega
    const elementoTaxa =
        document.getElementById("taxa-entrega");

    if (elementoTaxa) {
        elementoTaxa.textContent =
            formatarMoeda(taxaEntrega);
    }


    // Atualiza total
    const elementoTotal =
        document.getElementById("total");

    if (elementoTotal) {
        elementoTotal.textContent =
            formatarMoeda(total);
    }

}


// =====================================================
// ATUALIZAR VISUAL DAS OPÇÕES
// =====================================================

function atualizarSelecaoVisual(tipo) {

    let opcoes = [];


    // Se for local
    if (tipo === "local") {

        opcoes =
            document.querySelectorAll(
                ".opcao-entrega"
            );

    }


    // Se for pagamento
    if (tipo === "pagamento") {

        opcoes =
            document.querySelectorAll(
                ".opcao-pagamento"
            );

    }


    // Atualiza cada opção
    opcoes.forEach(opcao => {

        const input =
            opcao.querySelector("input");


        if (input && input.checked) {

            opcao.classList.add("selecionada");

        } else {

            opcao.classList.remove("selecionada");

        }

    });

}


// =====================================================
// ATUALIZAR AVISO DE RIACHÃO DE CIMA
// =====================================================

function atualizarAvisoEntrega() {

    // Pega o local selecionado
    const localSelecionado =
        obterLocalSelecionado();


    // Pega o aviso
    const aviso =
        document.getElementById(
            "aviso-riachao-cima"
        );


    // Se o aviso não existir, para aqui
    if (!aviso) {
        return;
    }


    // Se escolheu Riachão de Cima
    if (
        localSelecionado &&
        localSelecionado.value === "Riachão de Cima"
    ) {

        // Mostra o aviso
        aviso.style.display = "block";

    } else {

        // Esconde o aviso
        aviso.style.display = "none";

    }

}


// =====================================================
// CONFIGURAR OS RADIOS
// =====================================================

function configurarSelecoes() {

    // -------------------------------------------------
    // LOCAIS
    // -------------------------------------------------

    const locais =
        document.querySelectorAll(
            'input[name="local"]'
        );


    locais.forEach(input => {

        input.addEventListener(
            "change",
            function () {

                // Atualiza o visual
                atualizarSelecaoVisual("local");

                // Atualiza o preço
                atualizarTotal();

                // Atualiza o aviso
                atualizarAvisoEntrega();

            }
        );

    });


    // -------------------------------------------------
    // PAGAMENTOS
    // -------------------------------------------------

    const pagamentos =
        document.querySelectorAll(
            'input[name="pagamento"]'
        );


    pagamentos.forEach(input => {

        input.addEventListener(
            "change",
            function () {

                atualizarSelecaoVisual(
                    "pagamento"
                );

            }
        );

    });


    // -------------------------------------------------
    // ESTADO INICIAL
    // -------------------------------------------------

    atualizarSelecaoVisual("local");

    atualizarSelecaoVisual("pagamento");

    atualizarAvisoEntrega();

}


// =====================================================
// FINALIZAR PEDIDO
// =====================================================

function finalizarPedido() {

    // -------------------------------------------------
    // VERIFICAR PRODUTOS
    // -------------------------------------------------

    if (
        quantidades.agua === 0 &&
        quantidades.gas === 0
    ) {

        alert(
            "Escolha pelo menos um produto."
        );

        return;
    }


    // -------------------------------------------------
    // PEGAR LOCAL
    // -------------------------------------------------

    const localSelecionado =
        obterLocalSelecionado();


    if (!localSelecionado) {

        alert(
            "Escolha o local de entrega."
        );

        return;
    }


    // -------------------------------------------------
    // REGRA DE RIACHÃO DE CIMA
    // -------------------------------------------------

    if (
        localSelecionado.value === "Riachão de Cima" &&
        quantidades.agua < 2
    ) {

        alert(
            "Para Riachão de Cima, o pedido mínimo é de 2 águas."
        );

        return;
    }


    // -------------------------------------------------
    // PEGAR DADOS DO CLIENTE
    // -------------------------------------------------

    const nome =
        document
            .getElementById("nome")
            .value
            .trim();


    const referencia =
        document
            .getElementById("referencia")
            .value
            .trim();


    const whatsapp =
        document
            .getElementById("whatsapp")
            .value
            .trim();


    const observacao =
        document
            .getElementById("observacao")
            .value
            .trim();


    // -------------------------------------------------
    // VALIDAR NOME
    // -------------------------------------------------

    if (!nome) {

        alert(
            "Informe seu nome ou apelido."
        );

        return;
    }


    // -------------------------------------------------
    // VALIDAR REFERÊNCIA
    // -------------------------------------------------

    if (!referencia) {

        alert(
            "Informe um ponto de referência."
        );

        return;
    }


    // -------------------------------------------------
    // VALIDAR WHATSAPP
    // -------------------------------------------------

    if (!whatsapp) {

        alert(
            "Informe seu WhatsApp."
        );

        return;
    }


    // -------------------------------------------------
    // PEGAR PAGAMENTO
    // -------------------------------------------------

    const pagamentoSelecionado =
        obterPagamentoSelecionado();


    if (!pagamentoSelecionado) {

        alert(
            "Escolha uma forma de pagamento."
        );

        return;
    }


    // -------------------------------------------------
    // CALCULAR SUBTOTAL
    // -------------------------------------------------

    const subtotal =
        (
            quantidades.agua *
            obterPreco("agua")
        ) +
        (
            quantidades.gas *
            obterPreco("gas")
        );


    // -------------------------------------------------
    // CALCULAR ENTREGA
    // -------------------------------------------------

    let taxaEntrega = 0;


    const localConfig =
        CONFIG.locais.find(
            item =>
                item.nome === localSelecionado.value
        );


    if (localConfig) {
        taxaEntrega = localConfig.taxa;
    }


    // -------------------------------------------------
    // TOTAL
    // -------------------------------------------------

    const total =
        subtotal + taxaEntrega;


    // -------------------------------------------------
    // MONTAR MENSAGEM
    // -------------------------------------------------

    let mensagem =
        "🛒 *NOVO PEDIDO*\n\n";


    mensagem +=
        "📦 *Produtos:*\n";


    if (quantidades.agua > 0) {

        mensagem +=
            `💧 Água Mineral 20L: ${quantidades.agua}\n`;

    }


    if (quantidades.gas > 0) {

        mensagem +=
            `🔥 Gás P13: ${quantidades.gas}\n`;

    }


    mensagem +=
        `\n📍 *Local:* ${localSelecionado.value}\n`;


    mensagem +=
        `💰 *Pagamento:* ${pagamentoSelecionado.value}\n`;


    mensagem +=
        `💵 *Subtotal:* ${formatarMoeda(subtotal)}\n`;


    mensagem +=
        `🚚 *Entrega:* ${formatarMoeda(taxaEntrega)}\n`;


    mensagem +=
        `💰 *TOTAL:* ${formatarMoeda(total)}\n\n`;


    mensagem +=
        `👤 *Cliente:* ${nome}\n`;


    mensagem +=
        `📱 *WhatsApp:* ${whatsapp}\n`;


    mensagem +=
        `📌 *Referência:* ${referencia}\n`;


    if (observacao) {

        mensagem +=
            `📝 *Observação:* ${observacao}\n`;

    }


    // -------------------------------------------------
    // VERIFICAR WHATSAPP DO DONO
    // -------------------------------------------------

    if (
        !CONFIG.whatsappDono ||
        CONFIG.whatsappDono === "SEU_NUMERO_AQUI"
    ) {

        alert(
            "Configure o número do WhatsApp do dono no arquivo config.js."
        );

        return;
    }


    // -------------------------------------------------
    // ABRIR WHATSAPP
    // -------------------------------------------------

    const url =
        `https://wa.me/${CONFIG.whatsappDono}?text=${encodeURIComponent(mensagem)}`;


    window.open(
        url,
        "_blank"
    );

}


// =====================================================
// INICIAR O SITE
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        // Configura os locais e pagamentos
        configurarSelecoes();

        // Calcula o total inicial
        atualizarTotal();

    }
);