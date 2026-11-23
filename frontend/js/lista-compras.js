(function () {
  const content = document.getElementById('list-content');
  const clearButton = document.getElementById('clear-list');

  function createItem(entry) {
    const product = entry.product;
    const item = document.createElement('article');
    item.className = 'shopping-item panel';
    const image = document.createElement('img');
    image.className = 'shopping-item-image';
    image.src = product.image || 'assets/images/product-placeholder.svg';
    image.alt = product.name;
    image.addEventListener('error', function () { image.src = 'assets/images/product-placeholder.svg'; }, { once: true });
    const details = document.createElement('div');
    const title = document.createElement('h2');
    title.textContent = product.name;
    const location = document.createElement('p');
    location.className = 'shopping-item-location';
    location.textContent = product.aisle
      ? 'Corredor ' + product.aisle + (product.section ? ' · ' + product.section : '') + (product.shelf ? ' · Prateleira ' + product.shelf : '')
      : 'Localização não informada';
    const price = document.createElement('p');
    price.className = 'shopping-unit-price';
    price.textContent = window.SmartGuideUI.formatPrice(product.price) + ' / unidade';
    const quantity = document.createElement('div');
    quantity.className = 'quantity-control';
    quantity.setAttribute('aria-label', 'Quantidade');
    const decrease = document.createElement('button');
    decrease.type = 'button';
    decrease.textContent = '−';
    decrease.setAttribute('aria-label', 'Diminuir quantidade');
    decrease.disabled = entry.quantity <= 1;
    decrease.addEventListener('click', function () {
      if (entry.quantity <= 1) window.SmartGuideList.remove(product.id);
      else window.SmartGuideList.setQuantity(product.id, entry.quantity - 1);
    });
    const amount = document.createElement('span');
    amount.className = 'quantity-value';
    amount.textContent = String(entry.quantity);
    const increase = document.createElement('button');
    increase.type = 'button';
    increase.textContent = '+';
    increase.setAttribute('aria-label', 'Aumentar quantidade');
    increase.addEventListener('click', function () { window.SmartGuideList.setQuantity(product.id, entry.quantity + 1); });
    quantity.append(decrease, amount, increase);
    details.append(title, location, price, quantity);

    const end = document.createElement('div');
    end.className = 'shopping-item-end';
    const subtotal = document.createElement('strong');
    subtotal.className = 'item-subtotal';
    subtotal.textContent = product.price === null || product.price === undefined
      ? '—'
      : window.SmartGuideUI.formatPrice(product.price * entry.quantity);
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'remove-item';
    remove.textContent = 'Remover';
    remove.addEventListener('click', function () { window.SmartGuideList.remove(product.id); });
    end.append(subtotal, remove);
    item.append(image, details, end);
    return item;
  }

  function renderEmpty() {
    const empty = document.createElement('section');
    empty.className = 'empty-state panel';
    const title = document.createElement('h2');
    title.textContent = 'Sua lista está vazia';
    const description = document.createElement('p');
    description.textContent = 'Adicione produtos pelo assistente ou pelo catálogo para organizar sua próxima visita.';
    const link = document.createElement('a');
    link.className = 'button button-primary';
    link.href = 'catalogo.html';
    link.textContent = 'Explorar catálogo';
    empty.append(title, description, link);
    content.replaceChildren(empty);
    clearButton.disabled = true;
  }

  function render() {
    let items;
    try {
      items = window.SmartGuideList.getItems();
    } catch (error) {
      console.error('Não foi possível carregar a lista de compras.', error);
      const message = document.createElement('p');
      message.className = 'status-banner';
      message.textContent = 'Não foi possível ler sua lista salva. Verifique o armazenamento do navegador.';
      content.replaceChildren(message);
      return;
    }
    if (!items.length) {
      renderEmpty();
      return;
    }
    clearButton.disabled = false;
    const layout = document.createElement('div');
    layout.className = 'shopping-layout';
    const list = document.createElement('section');
    list.className = 'shopping-items';
    list.setAttribute('aria-label', 'Produtos na lista');
    items.forEach(function (entry) { list.appendChild(createItem(entry)); });
    const summary = document.createElement('aside');
    summary.className = 'shopping-summary panel';
    const heading = document.createElement('h2');
    heading.textContent = 'Resumo da lista';
    const quantity = document.createElement('p');
    quantity.className = 'summary-line';
    const quantityLabel = document.createElement('span');
    quantityLabel.textContent = 'Itens';
    const quantityValue = document.createElement('strong');
    quantityValue.textContent = String(items.reduce(function (sum, entry) { return sum + entry.quantity; }, 0));
    quantity.append(quantityLabel, quantityValue);
    const total = document.createElement('div');
    total.className = 'summary-total';
    const totalLabel = document.createElement('span');
    const hasUnknownPrices = items.some(function (entry) {
      return entry.product.price === null || entry.product.price === undefined;
    });
    totalLabel.textContent = hasUnknownPrices ? 'Total dos preços informados' : 'Total estimado';
    const totalValue = document.createElement('strong');
    totalValue.textContent = window.SmartGuideUI.formatPrice(window.SmartGuideList.getTotal());
    total.append(totalLabel, totalValue);
    const note = document.createElement('p');
    note.className = 'summary-note';
    note.textContent = hasUnknownPrices
      ? 'Itens sem preço cadastrado não entram no total. Consulte a loja para confirmar preços e disponibilidade.'
      : 'Valores estimados a partir dos preços cadastrados. Consulte a loja para confirmar preços e disponibilidade.';
    const actions = document.createElement('div');
    actions.className = 'summary-actions';
    const browse = document.createElement('a');
    browse.className = 'button button-primary';
    browse.href = 'catalogo.html';
    browse.textContent = 'Continuar explorando';
    actions.appendChild(browse);
    summary.append(heading, quantity, total, note, actions);
    layout.append(list, summary);
    content.replaceChildren(layout);
  }

  document.addEventListener('DOMContentLoaded', function () {
    clearButton.addEventListener('click', function () {
      if (!window.SmartGuideList.getCount()) return;
      if (window.confirm('Deseja remover todos os produtos da lista?')) window.SmartGuideList.clear();
    });
    window.addEventListener('smartguide:listchange', render);
    render();
  });
}());
