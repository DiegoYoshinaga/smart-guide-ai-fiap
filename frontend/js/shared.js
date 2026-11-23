(function () {
  const navItems = [
    { id: 'assistant', label: 'Assistente', href: 'index.html' },
    { id: 'catalog', label: 'Catálogo', href: 'catalogo.html' },
    { id: 'map', label: 'Mapa da loja', href: 'mapa.html' },
    { id: 'list', label: 'Lista de compras', href: 'lista-compras.html', count: true }
  ];

  function renderHeader() {
    const target = document.getElementById('site-header');
    if (!target) return;
    const currentPage = document.body.dataset.page;
    const header = document.createElement('header');
    header.className = 'site-header';
    const inner = document.createElement('div');
    inner.className = 'header-inner';
    const brand = document.createElement('a');
    brand.className = 'brand-lockup';
    brand.href = 'index.html';
    const symbol = document.createElement('span');
    symbol.className = 'brand-symbol';
    symbol.setAttribute('aria-hidden', 'true');
    symbol.textContent = 'SG';
    const name = document.createElement('span');
    name.className = 'brand-name';
    name.appendChild(document.createTextNode('Smart Guide'));
    const assistant = document.createElement('small');
    assistant.textContent = 'ASSISTANT';
    name.appendChild(assistant);
    brand.append(symbol, name);
    inner.appendChild(brand);
    const store = document.createElement('div');
    store.className = 'store-wordmark';
    store.textContent = 'LEROY MERLIN';
    inner.appendChild(store);
    const nav = document.createElement('nav');
    nav.className = 'main-nav';
    nav.setAttribute('aria-label', 'Navegação principal');
    navItems.forEach(function (item) {
      const link = document.createElement('a');
      link.className = 'nav-link';
      link.href = item.href;
      if (item.id === currentPage) link.setAttribute('aria-current', 'page');
      link.appendChild(document.createTextNode(item.label));
      if (item.count) {
        const count = document.createElement('span');
        count.className = 'nav-count';
        count.id = 'shopping-count';
        count.textContent = '0';
        count.setAttribute('aria-label', '0 produtos na lista');
        link.appendChild(count);
      }
      nav.appendChild(link);
    });
    inner.appendChild(nav);
    header.appendChild(inner);
    target.appendChild(header);
    updateCount();
  }

  function updateCount() {
    const count = document.getElementById('shopping-count');
    if (!count) return;
    try {
      const amount = window.SmartGuideList.getCount();
      count.textContent = String(amount);
      count.setAttribute('aria-label', amount + ' produtos na lista');
    } catch (error) {
      console.error('Não foi possível ler a lista de compras.', error);
      count.textContent = '!';
      count.setAttribute('aria-label', 'Não foi possível carregar a lista');
    }
  }

  function formatPrice(price) {
    if (price === undefined || price === null || price === '' || !Number.isFinite(Number(price))) return 'Preço não informado';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(price));
  }

  function normalizeSearchText(value) {
    return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');
  }

  function notify(message) {
    let region = document.querySelector('.toast-region');
    if (!region) {
      region = document.createElement('div');
      region.className = 'toast-region';
      region.setAttribute('aria-live', 'polite');
      document.body.appendChild(region);
    }
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    region.appendChild(toast);
    window.setTimeout(function () { toast.remove(); }, 3200);
  }

  function addProduct(product) {
    try {
      window.SmartGuideList.add(product);
      notify('Produto adicionado à sua lista.');
    } catch (error) {
      console.error('Não foi possível adicionar o produto à lista.', error);
      notify('Não foi possível salvar o produto. Verifique o armazenamento do navegador.');
    }
  }

  function createProductCard(product, options) {
    const settings = options || {};
    const card = document.createElement('article');
    card.className = 'product-card';
    const imageWrap = document.createElement('div');
    imageWrap.className = 'product-image-wrap';
    const image = document.createElement('img');
    image.className = 'product-image';
    image.src = product.image || 'assets/images/product-placeholder.svg';
    image.alt = product.name;
    image.loading = 'lazy';
    image.addEventListener('error', function () { image.src = 'assets/images/product-placeholder.svg'; }, { once: true });
    imageWrap.appendChild(image);
    if (product.category) {
      const category = document.createElement('span');
      category.className = 'category-tag';
      category.textContent = product.category;
      imageWrap.appendChild(category);
    }
    card.appendChild(imageWrap);
    const body = document.createElement('div');
    body.className = 'product-card-body';
    const name = document.createElement('h3');
    name.textContent = product.name;
    const description = document.createElement('p');
    description.className = 'product-description';
    description.textContent = product.description || 'Consulte os detalhes deste produto.';
    const price = document.createElement('p');
    price.className = 'product-price';
    price.textContent = formatPrice(product.price);
    body.append(name, description, price);
    if (settings.showMeta) {
      const meta = document.createElement('div');
      meta.className = 'product-meta';
      const availability = document.createElement('span');
      availability.className = 'availability' + (product.available === false ? ' unavailable' : '');
      availability.textContent = product.available === false ? 'Indisponível' : (product.available === true ? 'Disponível' : 'Disponibilidade não informada');
      meta.appendChild(availability);
      if (product.aisle) meta.appendChild(document.createTextNode('Corredor ' + product.aisle));
      body.appendChild(meta);
    }
    const actions = document.createElement('div');
    actions.className = 'product-actions';
    const details = document.createElement('button');
    details.type = 'button';
    details.className = 'button button-outline button-small';
    details.textContent = 'Ver detalhes';
    details.addEventListener('click', function () {
      if (typeof settings.onDetails === 'function') settings.onDetails(product);
      else window.location.href = 'catalogo.html?produto=' + encodeURIComponent(product.id);
    });
    const add = document.createElement('button');
    add.type = 'button';
    add.className = 'button button-primary button-small';
    add.textContent = 'Adicionar à lista';
    add.addEventListener('click', function () { addProduct(product); });
    const locate = document.createElement('a');
    locate.className = 'button button-soft button-small';
    locate.href = 'mapa.html?produto=' + encodeURIComponent(product.id);
    locate.textContent = 'Ver localização';
    actions.append(details, add, locate);
    body.appendChild(actions);
    card.appendChild(body);
    return card;
  }

  async function loadProductsWithDemo(onDemo) {
    try {
      return { products: await window.SmartGuideAPI.getProducts(), isDemo: false };
    } catch (error) {
      console.error('Falha ao carregar o catálogo da API.', error);
      if (!(error instanceof window.SmartGuideAPI.ApiError) || error.status !== 0) {
        throw error;
      }
      if (typeof onDemo === 'function') onDemo(error);
      return { products: window.SmartGuideDemo.products.map(window.SmartGuideAPI.normalizeProduct), isDemo: true };
    }
  }

  document.addEventListener('DOMContentLoaded', renderHeader);
  window.addEventListener('smartguide:listchange', updateCount);
  window.addEventListener('storage', updateCount);

  window.SmartGuideUI = {
    formatPrice: formatPrice,
    normalizeSearchText: normalizeSearchText,
    notify: notify,
    createProductCard: createProductCard,
    addProduct: addProduct,
    loadProductsWithDemo: loadProductsWithDemo
  };
}());
