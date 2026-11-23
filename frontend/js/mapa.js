(function () {
  const search = document.getElementById('map-search');
  const results = document.getElementById('map-search-results');
  const floor = document.getElementById('map-floor');
  const panel = document.getElementById('location-panel');
  let products = [];
  let isDemo = false;
  let aisles = [];

  function aisleValue(value) {
    return String(value || '').trim();
  }

  function aisleKey(value) {
    return aisleValue(value).toLocaleLowerCase('pt-BR').replace(/^corredor\s*/, '');
  }

  function renderAisles() {
    floor.replaceChildren();
    const route = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    route.className = 'map-route';
    route.setAttribute('aria-hidden', 'true');
    route.setAttribute('preserveAspectRatio', 'none');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    route.appendChild(path);
    floor.appendChild(route);
    aisles = [];
    const seen = new Set();
    products.forEach(function (product) {
      const value = aisleValue(product.aisle);
      if (value && !seen.has(value)) {
        seen.add(value);
        aisles.push({
          value: value,
          label: product.section || product.category || 'Produtos'
        });
      }
    });
    aisles.sort(function (a, b) { return a.value.localeCompare(b.value, 'pt-BR', { numeric: true }); });
    aisles.forEach(function (aisle, index) {
      const element = document.createElement('div');
      element.className = 'map-aisle';
      element.dataset.aisle = aisleKey(aisle.value);
      const number = document.createElement('span');
      number.className = 'aisle-number';
      number.textContent = aisle.value.toLocaleUpperCase('pt-BR').startsWith('CORREDOR') ? aisle.value : 'CORREDOR ' + aisle.value;
      const name = document.createElement('span');
      name.className = 'aisle-name';
      name.textContent = aisle.label;
      element.append(number, name);
      floor.appendChild(element);
    });
    if (!aisles.length) {
      const empty = document.createElement('p');
      empty.className = 'map-no-location';
      empty.textContent = 'O catálogo não informa corredores para os produtos.';
      floor.appendChild(empty);
    }
  }

  function showPanel(message) {
    panel.replaceChildren();
    const empty = document.createElement('div');
    empty.className = 'empty-location';
    const icon = document.createElement('span');
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = '⌖';
    const title = document.createElement('h2');
    title.textContent = message || 'Encontre um produto';
    const description = document.createElement('p');
    description.textContent = 'Pesquise pelo nome para consultar sua localização na loja.';
    empty.append(icon, title, description);
    panel.appendChild(empty);
  }

  function renderProduct(product, location) {
    const targetAisle = Array.from(floor.querySelectorAll('.map-aisle')).find(function (aisle) {
      return aisle.dataset.aisle === aisleKey(location.aisle);
    });
    floor.querySelectorAll('.map-aisle').forEach(function (aisle) {
      aisle.classList.toggle('is-highlighted', aisle === targetAisle);
    });
    const route = floor.querySelector('.map-route');
    if (route) {
      route.classList.remove('is-visible');
      const path = route.querySelector('polyline');
      if (targetAisle) {
        const floorBounds = floor.getBoundingClientRect();
        const targetBounds = targetAisle.getBoundingClientRect();
        const startX = floorBounds.width / 2;
        const endX = targetBounds.left - floorBounds.left + targetBounds.width / 2;
        const endY = targetBounds.top - floorBounds.top + targetBounds.height / 2;
        route.setAttribute('viewBox', '0 0 ' + floorBounds.width + ' ' + floorBounds.height);
        path.setAttribute('points', startX + ',8 ' + startX + ',' + endY + ' ' + endX + ',' + endY);
        route.classList.add('is-visible');
      }
    }
    panel.replaceChildren();
    const image = document.createElement('img');
    image.className = 'location-product-image';
    image.src = product.image || 'assets/images/product-placeholder.svg';
    image.alt = product.name;
    image.addEventListener('error', function () { image.src = 'assets/images/product-placeholder.svg'; }, { once: true });
    const info = document.createElement('div');
    info.className = 'location-info';
    const category = document.createElement('span');
    category.className = 'location-category';
    category.textContent = product.category || 'Produto';
    const name = document.createElement('h2');
    name.textContent = product.name;
    const details = document.createElement('div');
    details.className = 'location-detail';
    [
      ['Corredor', location.aisle || 'Não informado'],
      ['Seção', location.section || 'Não informada'],
      ['Prateleira', location.shelf || 'Não informada'],
      ['Preço', window.SmartGuideUI.formatPrice(product.price)]
    ].forEach(function (pair) {
      const item = document.createElement('div');
      const label = document.createElement('span');
      label.textContent = pair[0];
      const value = document.createElement('strong');
      value.textContent = pair[1];
      item.append(label, value);
      details.appendChild(item);
    });
    info.append(category, name, details);
    if (location.aisle) {
      const routeInfo = document.createElement('p');
      routeInfo.className = 'route-callout';
      routeInfo.textContent = 'Caminho demonstrativo: siga pela entrada e procure o corredor ' + location.aisle + (location.section ? ', seção ' + location.section : '') + '.';
      info.appendChild(routeInfo);
    } else {
      const routeInfo = document.createElement('p');
      routeInfo.className = 'route-callout';
      routeInfo.textContent = 'O catálogo não possui informações de corredor para este produto.';
      info.appendChild(routeInfo);
    }
    const add = document.createElement('button');
    add.type = 'button';
    add.className = 'button button-primary button-small';
    add.textContent = 'Adicionar à lista';
    add.addEventListener('click', function () { window.SmartGuideUI.addProduct(product); });
    info.appendChild(add);
    panel.append(image, info);
  }

  async function selectProduct(product) {
    results.classList.remove('is-open');
    results.replaceChildren();
    search.value = product.name;
    showPanel('Consultando localização...');
    try {
      const location = isDemo ? product : await window.SmartGuideAPI.getProductLocation(product.id);
      const resolved = Object.assign({}, product, {
        aisle: location.aisle || product.aisle,
        section: location.section || product.section,
        shelf: location.shelf || product.shelf
      });
      renderProduct(product, resolved);
    } catch (error) {
      console.error('Falha ao consultar a localização do produto.', error);
      showPanel('Não foi possível consultar a localização. Tente novamente.');
    }
  }

  function renderResults() {
    const query = window.SmartGuideUI.normalizeSearchText(search.value.trim());
    results.replaceChildren();
    if (!query) {
      results.classList.remove('is-open');
      return;
    }
    const matches = products.filter(function (product) {
      return window.SmartGuideUI.normalizeSearchText(product.name + ' ' + product.description).includes(query);
    }).slice(0, 7);
    if (!matches.length) {
      const empty = document.createElement('p');
      empty.className = 'map-result-empty';
      empty.textContent = 'Nenhum produto encontrado no catálogo.';
      results.appendChild(empty);
    } else {
      matches.forEach(function (product) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'map-result';
        button.setAttribute('role', 'option');
        const name = document.createElement('strong');
        name.textContent = product.name;
        const location = document.createElement('small');
        location.textContent = product.aisle ? 'Corredor ' + product.aisle : 'Localização não informada';
        button.append(name, location);
        button.addEventListener('click', function () { selectProduct(product); });
        results.appendChild(button);
      });
    }
    results.classList.add('is-open');
  }

  document.addEventListener('DOMContentLoaded', function () {
    search.addEventListener('input', renderResults);
    document.addEventListener('click', function (event) {
      if (!event.target.closest('.map-search')) results.classList.remove('is-open');
    });
    window.SmartGuideUI.loadProductsWithDemo(function () {
      const warning = document.createElement('p');
      warning.className = 'status-banner';
      warning.textContent = 'Backend indisponível — exibindo localizações demonstrativas do catálogo local.';
      document.querySelector('.map-search').after(warning);
    }).then(function (result) {
      products = result.products;
      isDemo = result.isDemo;
      renderAisles();
      const requestedId = new URLSearchParams(window.location.search).get('produto');
      if (requestedId) {
        const selected = products.find(function (product) { return String(product.id) === requestedId; });
        if (selected) selectProduct(selected);
        else showPanel('Produto não encontrado no catálogo.');
      }
    }).catch(function (error) {
      console.error('Falha ao inicializar o mapa.', error);
      showPanel('Não foi possível carregar o mapa. Atualize a página e tente novamente.');
    });
  });
}());
