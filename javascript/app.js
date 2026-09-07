const quantidades = {
    agua: 0,
    gas: 0
};


// =====================================================
// FORMATAR DINHEIRO
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

function alterarQuantidade(produtoId, valor) {

    if (!(produtoId in quantidades)) {
        return;
    }

    quantidades[produtoId] += valor;

    if (quantidades[produtoId] < 0) {
        quantidades[produtoId] = 0;
    }

    const elementoQuantidade =
        document.getElementById(`quantidade-${produtoId}`);

    if (elementoQuantidade) {
        elementoQuantidade.textContent =
            quantidades[produtoId];
    }

    atualizarTotal();
}


// =====================================================
// PEGAR PREÇO
// =====================================================

function obterPreco(produtoId) {

    const produto = CONFIG.produtos.find(
        item => item.id === produtoId
    );

    return produto ? produto.preco : 0;
}


// =====================================================
// PEGAR LOCAL
// =====================================================

function obterLocalSelecionado() {

    return document.querySelector(
        'input[name="local"]:checked'
    );
}


// =====================================================
// PEGAR PAGAMENTO
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

    const valorAgua =
        quantidades.agua * obterPreco("agua");

    const valorGas =
        quantidades.gas * obterPreco("gas");

    const subtotal =
        valorAgua + valorGas;

    // Sem taxa de entrega
    const total = subtotal;

    const elementoSubtotal =
        document.getElementById("subtotal");

    if (elementoSubtotal) {
        elementoSubtotal.textContent =
            formatarMoeda(subtotal);
    }

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

    if (tipo === "local") {
        opcoes =
            document.querySelectorAll(
                ".opcao-entrega"
            );
    }

    if (tipo === "pagamento") {
        opcoes =
            document.querySelectorAll(
                ".opcao-pagamento"
            );
    }

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
// AVISO RIACHÃO DE CIMA
// =====================================================

function atualizarAvisoEntrega() {

    const localSelecionado =
        obterLocalSelecionado();

    const aviso =
        document.getElementById(
            "aviso-riachao-cima"
        );

    if (!aviso) {
        return;
    }

    if (
        localSelecionado &&
        localSelecionado.value === "Riachão de Cima"
    ) {
        aviso.style.display = "block";
    } else {
        aviso.style.display = "none";
    }
}


// =====================================================
// CONFIGURAR RADIOS
// =====================================================

function configurarSelecoes() {

    const locais =
        document.querySelectorAll(
            'input[name="local"]'
        );

    locais.forEach(input => {

        input.addEventListener(
            "change",
            function () {

                atualizarSelecaoVisual("local");
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
            function () {

                atualizarSelecaoVisual(
                    "pagamento"
                );
            }
        );
    });


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
    // DADOS DO CLIENTE
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
    // VALIDAR WHATSAPP
    // -------------------------------------------------

    if (!whatsapp) {

        alert(
            "Informe seu WhatsApp."
        );

        return;
    }


    // -------------------------------------------------
    // PAGAMENTO
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
    // CALCULAR TOTAL
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

    const total = subtotal;


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
        `💵 *TOTAL:* ${formatarMoeda(total)}\n\n`;

    mensagem +=
        `👤 *Cliente:* ${nome}\n`;

    mensagem +=
        `📱 *WhatsApp:* ${whatsapp}\n`;

    if (referencia) {

        mensagem +=
            `📌 *Referência:* ${referencia}\n`;
    }

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
// INICIAR SITE
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        configurarSelecoes();
        atualizarTotal();

    }
);
