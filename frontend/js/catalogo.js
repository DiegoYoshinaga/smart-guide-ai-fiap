(function () {
  let allProducts = [];
  const grid = document.getElementById('product-grid');
  const status = document.getElementById('catalog-status');
  const search = document.getElementById('product-search');
  const categoryFilter = document.getElementById('category-filter');
  const dialog = document.getElementById('product-dialog');
  const dialogContent = document.getElementById('dialog-content');
  let isDemo = false;
  let categoriesWarning = '';

  function statusSuffix() {
    return [isDemo ? 'catálogo demonstrativo local' : '', categoriesWarning].filter(Boolean).join(' · ');
  }

  function showEmpty(message) {
    grid.replaceChildren();
    const empty = document.createElement('div');
    empty.className = 'empty-state panel';
    const title = document.createElement('h2');
    title.textContent = 'Nenhum produto encontrado';
    const description = document.createElement('p');
    description.textContent = message;
    empty.append(title, description);
    grid.appendChild(empty);
  }

  function renderProducts() {
    const query = window.SmartGuideUI.normalizeSearchText(search.value.trim());
    const category = categoryFilter.value;
    const visibleProducts = allProducts.filter(function (product) {
      const matchesText = !query || window.SmartGuideUI.normalizeSearchText(product.name + ' ' + product.description).includes(query);
      const matchesCategory = !category || product.category === category;
      return matchesText && matchesCategory;
    });
    grid.replaceChildren();
    if (!visibleProducts.length) {
      showEmpty('Altere a pesquisa ou o filtro de categoria para ver outros produtos.');
      status.textContent = '0 produtos encontrados' + (statusSuffix() ? ' · ' + statusSuffix() : '');
      return;
    }
    visibleProducts.forEach(function (product) {
      grid.appendChild(window.SmartGuideUI.createProductCard(product, {
        showMeta: true,
        onDetails: showDetails
      }));
    });
    status.textContent = visibleProducts.length +
      (visibleProducts.length === 1 ? ' produto encontrado' : ' produtos encontrados') +
      (statusSuffix() ? ' · ' + statusSuffix() : '');
  }

  function showDetails(product) {
    dialogContent.replaceChildren();
    const image = document.createElement('img');
    image.className = 'dialog-product-image';
    image.src = product.image || 'assets/images/product-placeholder.svg';
    image.alt = product.name;
    image.addEventListener('error', function () { image.src = 'assets/images/product-placeholder.svg'; }, { once: true });
    const body = document.createElement('div');
    body.className = 'dialog-product-body';
    const category = document.createElement('span');
    category.className = 'eyebrow';
    category.textContent = product.category || 'PRODUTO';
    const title = document.createElement('h2');
    title.id = 'dialog-title';
    title.textContent = product.name;
    const description = document.createElement('p');
    description.textContent = product.description || 'Sem descrição adicional cadastrada.';
    const price = document.createElement('p');
    price.className = 'product-price';
    price.textContent = window.SmartGuideUI.formatPrice(product.price);
    const meta = document.createElement('div');
    meta.className = 'product-meta';
    meta.textContent = (product.available === false ? 'Indisponível' : (product.available === true ? 'Disponível' : 'Disponibilidade não informada')) +
      (product.aisle ? ' · Corredor ' + product.aisle : '') +
      (product.section ? ' · Seção ' + product.section : '') +
      (product.shelf ? ' · Prateleira ' + product.shelf : '');
    const actions = document.createElement('div');
    actions.className = 'product-actions';
    const add = document.createElement('button');
    add.type = 'button';
    add.className = 'button button-primary';
    add.textContent = 'Adicionar à lista';
    add.addEventListener('click', function () { window.SmartGuideUI.addProduct(product); });
    const locate = document.createElement('a');
    locate.className = 'button button-outline';
    locate.href = 'mapa.html?produto=' + encodeURIComponent(product.id);
    locate.textContent = 'Ver localização';
    actions.append(add, locate);
    body.append(category, title, description, price, meta, actions);
    dialogContent.append(image, body);
    if (!dialog.open) dialog.showModal();
  }

  function populateCategories(categories) {
    const values = Array.from(new Set(categories.filter(Boolean))).sort(function (a, b) { return a.localeCompare(b, 'pt-BR'); });
    values.forEach(function (category) {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    });
  }

  async function initialize() {
    status.textContent = 'Carregando produtos...';
    const result = await window.SmartGuideUI.loadProductsWithDemo(function () {
      status.textContent = 'Backend indisponível — exibindo o catálogo demonstrativo local.';
    });
    allProducts = result.products;
    isDemo = result.isDemo;
    try {
      const categories = result.isDemo
        ? window.SmartGuideDemo.categories
        : await window.SmartGuideAPI.getCategories();
      populateCategories(categories.length ? categories : allProducts.map(function (product) { return product.category; }));
    } catch (error) {
      console.error('Falha ao carregar categorias.', error);
      categoriesWarning = 'categorias não puderam ser carregadas; filtros derivados dos produtos';
      populateCategories(allProducts.map(function (product) { return product.category; }));
    }
    renderProducts();
    const requestedId = new URLSearchParams(window.location.search).get('produto');
    if (requestedId) {
      const selected = allProducts.find(function (product) { return String(product.id) === requestedId; });
      if (selected) showDetails(selected);
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    search.addEventListener('input', renderProducts);
    categoryFilter.addEventListener('change', renderProducts);
    document.querySelector('.dialog-close').addEventListener('click', function () { dialog.close(); });
    dialog.addEventListener('click', function (event) {
      if (event.target === dialog) dialog.close();
    });
    initialize().catch(function (error) {
      console.error('Falha ao inicializar o catálogo.', error);
      status.textContent = 'Não foi possível carregar o catálogo. Atualize a página e tente novamente.';
    });
  });
}());
