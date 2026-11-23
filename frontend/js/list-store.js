(function () {
  const STORAGE_KEY = 'smart-guide-shopping-list';

  function readItems() {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return [];
    const items = JSON.parse(serialized);
    if (!Array.isArray(items)) throw new Error('A lista salva possui um formato inválido.');
    return items;
  }

  function writeItems(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('smartguide:listchange', { detail: { items: items } }));
  }

  function productKey(product) {
    return String(product.id);
  }

  window.SmartGuideList = {
    getItems: readItems,
    add: function (product) {
      if (!product || product.id === undefined || product.id === null) {
        throw new Error('Não é possível adicionar um produto sem identificação.');
      }
      const items = readItems();
      const existing = items.find(function (item) { return productKey(item.product) === productKey(product); });
      if (existing) existing.quantity += 1;
      else items.push({ product: window.SmartGuideAPI.normalizeProduct(product), quantity: 1 });
      writeItems(items);
      return items;
    },
    setQuantity: function (id, quantity) {
      const items = readItems();
      const item = items.find(function (entry) { return productKey(entry.product) === String(id); });
      if (!item) return items;
      item.quantity = Math.max(1, Math.floor(Number(quantity) || 1));
      writeItems(items);
      return items;
    },
    remove: function (id) {
      writeItems(readItems().filter(function (item) { return productKey(item.product) !== String(id); }));
    },
    clear: function () { writeItems([]); },
    getCount: function () {
      return readItems().reduce(function (total, item) { return total + Math.max(0, Number(item.quantity) || 0); }, 0);
    },
    getTotal: function () {
      return readItems().reduce(function (total, item) {
        return total + (Number(item.product.price) || 0) * (Number(item.quantity) || 0);
      }, 0);
    }
  };
}());
