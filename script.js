let carrinho = [];
let total = 0;

document.querySelectorAll('.add-carrinho').forEach(botao => {
    botao.addEventListener('click', () => {
        let nome = botao.getAttribute('data-nome');
        let preco = parseFloat(botao.getAttribute('data-preco'));

        carrinho.push({ nome, preco });
        total += preco;

        atualizarCarrinho();
    });
});

function atualizarCarrinho() {
    let lista = document.getElementById('lista-carrinho');
    let totalSpan = document.getElementById('total');
    
    lista.innerHTML = '';
    carrinho.forEach((item, index) => {
        let li = document.createElement('li');
        li.textContent = `${item.nome} - R$ ${item.preco.toFixed(2)}`;
        let remover = document.createElement('button');
        remover.textContent = "❌";
        remover.onclick = () => removerItem(index);
        li.appendChild(remover);
        lista.appendChild(li);
    });

    totalSpan.textContent = total.toFixed(2);
}

function removerItem(index) {
    total -= carrinho[index].preco;
    carrinho.splice(index, 1);
    atualizarCarrinho();
}

document.getElementById('finalizar-pedido').addEventListener('click', () => {
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    let mensagem = "🛒 *Meu Pedido:*\n";
    carrinho.forEach(item => {
        mensagem += `🍧 ${item.nome} - R$ ${item.preco.toFixed(2)}\n`;
    });

    mensagem += `\n💰 *Total:* R$ ${total.toFixed(2)}\n`;
    mensagem += "📍 *Endereço:* (inserir endereço aqui)\n\n";
    mensagem += "🚀 Enviar agora para confirmar o pedido!";

    let numeroWhatsApp = "seunumerowhatsapp"; // Altere para seu número
    let url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;

    window.open(url, '_blank');
});

document.getElementById('pagar-online').addEventListener('click', () => {
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    let totalPago = total.toFixed(2);
    
    fetch('https://api.mercadopago.com/checkout/preferences', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer SEU_ACCESS_TOKEN' // Substitua pelo seu token do Mercado Pago
        },
        body: JSON.stringify({
            items: carrinho.map(item => ({
                title: item.nome,
                unit_price: item.preco,
                quantity: 1,
                currency_id: "BRL"
            })),
            payer: {
                email: "cliente@email.com"
            },
            back_urls: {
                success: "https://seusite.com/sucesso",
                failure: "https://seusite.com/erro",
                pending: "https://seusite.com/pendente"
            },
            auto_return: "approved"
        })
    })
    .then(response => response.json())
    .then(data => {
        window.location.href = data.init_point; // Redireciona para o checkout do Mercado Pago
    })
    .catch(error => console.error('Erro ao processar pagamento:', error));
});
