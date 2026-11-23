(function () {
  const BASE_URL = 'http://localhost:8080';

  class ApiError extends Error {
    constructor(message, status) {
      super(message);
      this.name = 'ApiError';
      this.status = status || 0;
    }
  }

  function toUrl(path, params) {
    const url = new URL(path, BASE_URL);
    Object.keys(params || {}).forEach(function (key) {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        url.searchParams.set(key, params[key]);
      }
    });
    return url.toString();
  }

  async function request(path, options) {
    let response;
    try {
      response = await fetch(toUrl(path), Object.assign({
        headers: { Accept: 'application/json' }
      }, options || {}));
    } catch (error) {
      throw new ApiError('Não foi possível conectar ao servidor. Verifique se o backend está em execução.', 0);
    }

    if (!response.ok) {
      let detail = '';
      try {
        detail = await response.text();
      } catch (error) {
        detail = '';
      }
      throw new ApiError(detail || 'O servidor não conseguiu concluir a solicitação.', response.status);
    }
    if (response.status === 204) return null;
    const contentType = response.headers.get('content-type') || '';
    return contentType.indexOf('application/json') !== -1 ? response.json() : response.text();
  }

  function normalizeProduct(raw) {
    const product = raw || {};
    const location = product.location || product.localizacao || {};
    const rawPrice = product.price !== undefined ? product.price : product.preco;
    const priceText = rawPrice === undefined || rawPrice === null
      ? ''
      : String(rawPrice).replace(/[^\d,.-]/g, '');
    const normalizedPrice = priceText.indexOf(',') !== -1
      ? priceText.replace(/\./g, '').replace(',', '.')
      : priceText;
    const parsedPrice = typeof rawPrice === 'number' ? rawPrice : Number(normalizedPrice);
    const price = rawPrice !== undefined && rawPrice !== null && rawPrice !== '' && priceText !== '' && Number.isFinite(parsedPrice)
      ? parsedPrice
      : null;
    const rawCategory = product.category !== undefined ? product.category : product.categoria;
    const category = typeof rawCategory === 'object' && rawCategory
      ? rawCategory.name || rawCategory.nome || ''
      : (rawCategory || '');
    return {
      id: product.id !== undefined ? product.id : (product.codigo !== undefined ? product.codigo : product.productId),
      name: product.name || product.nome || product.title || 'Produto sem nome',
      description: product.description || product.descricao || '',
      price: price,
      category: category,
      available: product.available !== undefined ? product.available : (product.disponivel !== undefined ? product.disponivel : product.ativo),
      aisle: location.aisle || location.corredor || product.aisle || product.corredor || '',
      section: location.section || location.secao || product.section || product.secao || '',
      shelf: location.shelf || location.prateleira || product.shelf || product.prateleira || '',
      image: product.image || product.imagem || product.imageUrl || product.urlImagem || 'assets/images/product-placeholder.svg',
      visualPosition: location.position || location.posicao || product.position || ''
    };
  }

  function unwrapList(data, keys) {
    if (Array.isArray(data)) return data;
    for (let index = 0; index < keys.length; index += 1) {
      if (data && Array.isArray(data[keys[index]])) return data[keys[index]];
    }
    return [];
  }

  window.SmartGuideAPI = {
    ApiError: ApiError,
    normalizeProduct: normalizeProduct,
    getProducts: async function (filters) {
      const data = await request(toUrl('/api/produtos', filters));
      return unwrapList(data, ['content', 'produtos', 'items']).map(normalizeProduct);
    },
    getProduct: async function (id) {
      return normalizeProduct(await request('/api/produtos/' + encodeURIComponent(id)));
    },
    searchProducts: async function (name) {
      const data = await request(toUrl('/api/produtos', { nome: name }));
      return unwrapList(data, ['content', 'produtos', 'items']).map(normalizeProduct);
    },
    getCategories: async function () {
      const data = await request('/api/categorias');
      return unwrapList(data, ['content', 'categorias', 'items']).map(function (item) {
        return typeof item === 'string' ? item : (item.name || item.nome || '');
      }).filter(Boolean);
    },
    sendChatMessage: async function (message) {
      const data = await request('/api/chat', {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensagem: message, message: message })
      });
      return data;
    },
    getProductLocation: async function (id) {
      const data = await request('/api/mapa/produto/' + encodeURIComponent(id));
      return normalizeProduct(data.product || data.produto || data);
    },
    createShoppingList: async function (nome) {
      const data = await request('/api/lista-compras', {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: nome || 'Minha lista de compras' })
      });
      return data;
    },
    getShoppingLists: async function () {
      const data = await request('/api/lista-compras');
      return unwrapList(data, ['content', 'produtos', 'items', 'lista-compras', 'listas']);
    },
    getShoppingList: async function (id) {
      return request('/api/lista-compras/' + encodeURIComponent(id));
    },
    getShoppingItems: async function (listId) {
      return request('/api/lista-compras/' + encodeURIComponent(listId) + '/itens');
    },
    addShoppingItem: async function (listId, produtoId, quantidade) {
      const data = await request('/api/lista-compras/' + encodeURIComponent(listId) + '/itens', {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ produtoId: produtoId, quantidade: quantidade })
      });
      return data;
    },
    updateShoppingItem: async function (listId, itemId, quantidade) {
      const data = await request('/api/lista-compras/' + encodeURIComponent(listId) + '/itens/' + encodeURIComponent(itemId), {
        method: 'PUT',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantidade: quantidade })
      });
      return data;
    },
    removeShoppingItem: async function (listId, itemId) {
      const data = await request('/api/lista-compras/' + encodeURIComponent(listId) + '/itens/' + encodeURIComponent(itemId), {
        method: 'DELETE'
      });
      return data;
    },
    removeProductFromShoppingList: async function (listId, produtoId) {
      const data = await request('/api/lista-compras/' + encodeURIComponent(listId) + '/produtos/' + encodeURIComponent(produtoId), {
        method: 'DELETE'
      });
      return data;
    },
    clearShoppingList: async function (listId) {
      const data = await request('/api/lista-compras/' + encodeURIComponent(listId) + '/itens', {
        method: 'DELETE'
      });
      return data;
    },
    calculateShoppingTotal: async function (listId) {
      const data = await request('/api/lista-compras/' + encodeURIComponent(listId) + '/total');
      return data;
    },
    saveShoppingList: async function (items) {
      const lista = await request('/api/lista-compras', {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: 'Lista do assistente' })
      });
      const listId = lista && lista.id;
      const produtos = (items || []).map(function (item) { return item && item.product; });
      for (let index = 0; index < produtos.length; index += 1) {
        const produto = produtos[index];
        if (produto && produto.id !== undefined) {
          await request('/api/lista-compras/' + listId + '/itens', {
            method: 'POST',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ produtoId: produto.id, quantidade: (items[index] && items[index].quantity) || 1 })
          });
        }
      }
      return lista;
    }
  };
}());
