(function () {
  const STORAGE_KEY = 'smart-guide-shopping-list';

  function readState() {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return { listId: null, itens: [] };
    const data = JSON.parse(serialized);
    const array = Array.isArray(data);
    const itens = Array.isArray(data) ? data : (data.itens || []);
    const listId = Array.isArray(data) ? null : (data.listId || null);
    return { listId: listId, itens: itens };
  }

  function writeState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent('smartguide:listchange', { detail: { items: state.itens } }));
  }

  function getItems() {
    return readState().itens;
  }

  function getCount() {
    const state = readState();
    return state.itens.reduce(function (total, item) { return total + Math.max(0, Number(item.quantity) || 0); }, 0);
  }

  function getTotal() {
    const state = readState();
    return state.itens.reduce(function (total, item) {
      return total + (Number(item.product.price) || 0) * (Number(item.quantity) || 0);
    }, 0);
  }

  async function criarLista() {
    const lista = await window.SmartGuideAPI.createShoppingList('Minha lista de compras');
    const listId = lista && lista.id ? lista.id : null;
    const state = readState();
    state.listId = listId;
    writeState(state);
    return listId;
  }

  async function sincronizar(listId, produto, quantidadeFinal) {
    try {
      const itens = await window.SmartGuideAPI.getShoppingItems(listId);
      const item = (itens || []).find(function (entry) { return String(entry.produtoId) === String(produto.id); });
      if (item) {
        await window.SmartGuideAPI.updateShoppingItem(listId, item.id, quantidadeFinal);
      } else {
        await window.SmartGuideAPI.addShoppingItem(listId, produto.id, quantidadeFinal);
      }
    } catch (error) {
      console.warn('Não foi possível sincronizar a lista de compras com o backend.', error);
    }
  }

  async function add(product, quantidade) {
    if (!product || product.id === undefined || product.id === null) {
      throw new Error('Não é possível adicionar um produto sem identificação.');
    }
    const quantidadeFinal = Math.max(1, Math.floor(Number(quantidade) || 1));
    const state = readState();
    const items = state.itens;
    const existing = items.find(function (item) {
      return String(item.product && item.product.id) === String(product.id);
    });

    if (existing) {
      existing.quantity += 1;
    } else {
      items.push({ product: product, quantity: quantidadeFinal });
    }

    if (!state.listId) {
      state.listId = await criarLista();
    }
    writeState(state);

    const finalQuantity = existing ? existing.quantity : quantidadeFinal;
    if (state.listId) {
      await sincronizar(state.listId, product, finalQuantity);
    }
    return items;
  }

  async function setQuantity(id, quantity) {
    const valor = Math.max(1, Math.floor(Number(quantity) || 1));
    const state = readState();
    const item = state.itens.find(function (entry) {
      return String(entry.product && entry.product.id) === String(id);
    });
    if (!item) {
      return state.itens;
    }
    item.quantity = valor;
    writeState(state);

    if (state.listId) {
      try {
        const itens = await window.SmartGuideAPI.getShoppingItems(state.listId);
        const alvo = (itens || []).find(function (entry) { return String(entry.produtoId) === String(id); });
        if (alvo) {
          await window.SmartGuideAPI.updateShoppingItem(state.listId, alvo.id, valor);
        } else {
          await window.SmartGuideAPI.addShoppingItem(state.listId, id, valor);
        }
      } catch (error) {
        console.warn('Não foi possível atualizar a quantidade no backend.', error);
      }
    }
    return state.itens;
  }

  async function remove(id) {
    const state = readState();
    const itens = state.itens.filter(function (entry) {
      return String(entry.product && entry.product.id) !== String(id);
    });
    writeState({ listId: state.listId, itens: itens });

    if (state.listId) {
      try {
        await window.SmartGuideAPI.removeProductFromShoppingList(state.listId, id);
      } catch (error) {
        console.warn('Não foi possível remover o produto no backend.', error);
      }
    }
    return itens;
  }

  async function clear() {
    const state = readState();
    writeState({ listId: state.listId, itens: [] });

    if (state.listId) {
      try {
        await window.SmartGuideAPI.clearShoppingList(state.listId);
      } catch (error) {
        console.warn('Não foi possível limpar a lista no backend.', error);
      }
    }
    return [];
  }

  window.SmartGuideList = {
    getItems: getItems,
    add: add,
    setQuantity: setQuantity,
    remove: remove,
    clear: clear,
    getCount: getCount,
    getTotal: getTotal
  };
}());
