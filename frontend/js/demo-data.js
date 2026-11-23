/* Dados locais para demonstração; nunca são usados quando a API responde. */
(function () {
  const image = 'assets/images/product-placeholder.svg';
  const products = [
    { id: 'demo-101', name: 'Fita veda-rosca 18 mm x 10 m', description: 'Fita para vedação de conexões roscadas em instalações hidráulicas.', price: 8.9, category: 'Hidráulica', available: true, aisle: '2', section: 'Conexões', shelf: 'A3', image },
    { id: 'demo-102', name: 'Torneira para banheiro cromada', description: 'Torneira de bancada com acabamento cromado para banheiro.', price: 89.9, category: 'Hidráulica', available: true, aisle: '2', section: 'Metais sanitários', shelf: 'B2', image },
    { id: 'demo-103', name: 'Chave inglesa ajustável 10 pol.', description: 'Ferramenta ajustável para apertar e soltar porcas e conexões.', price: 42.5, category: 'Ferramentas', available: true, aisle: '4', section: 'Chaves', shelf: 'C1', image },
    { id: 'demo-104', name: 'Tinta acrílica fosca branca 3,6 L', description: 'Tinta para pintura de paredes internas, com acabamento fosco.', price: 119.9, category: 'Pintura', available: true, aisle: '1', section: 'Tintas acrílicas', shelf: 'A1', image },
    { id: 'demo-105', name: 'Rolo para pintura 23 cm', description: 'Rolo para aplicação de tinta em superfícies lisas e paredes.', price: 24.9, category: 'Pintura', available: true, aisle: '1', section: 'Acessórios de pintura', shelf: 'B4', image },
    { id: 'demo-106', name: 'Kit de pincéis para pintura', description: 'Conjunto de pincéis para recortes e acabamento em pintura.', price: 18.9, category: 'Pintura', available: true, aisle: '1', section: 'Acessórios de pintura', shelf: 'B2', image },
    { id: 'demo-107', name: 'Furadeira de impacto 650 W', description: 'Furadeira elétrica para perfurações em madeira, metal e alvenaria.', price: 249.9, category: 'Ferramentas', available: true, aisle: '4', section: 'Ferramentas elétricas', shelf: 'D1', image },
    { id: 'demo-108', name: 'Kit de buchas e parafusos', description: 'Conjunto para fixação de objetos e instalação de prateleiras.', price: 16.9, category: 'Construção', available: true, aisle: '4', section: 'Fixadores', shelf: 'A4', image },
    { id: 'demo-109', name: 'Prateleira de madeira 60 cm', description: 'Prateleira para organização e decoração de ambientes internos.', price: 54.9, category: 'Organização', available: true, aisle: '6', section: 'Prateleiras', shelf: 'B1', image },
    { id: 'demo-110', name: 'Lâmpada LED bulbo 9 W', description: 'Lâmpada LED para iluminação residencial, luz branca.', price: 12.9, category: 'Elétrica', available: true, aisle: '3', section: 'Lâmpadas LED', shelf: 'A2', image },
    { id: 'demo-111', name: 'Extensão elétrica 5 m', description: 'Extensão para ampliar o alcance de tomadas em ambientes internos.', price: 39.9, category: 'Elétrica', available: true, aisle: '3', section: 'Extensões', shelf: 'B3', image },
    { id: 'demo-112', name: 'Mangueira para jardim 15 m', description: 'Mangueira flexível para rega e cuidados gerais com o jardim.', price: 69.9, category: 'Jardinagem', available: true, aisle: '5', section: 'Irrigação', shelf: 'A1', image },
    { id: 'demo-113', name: 'Kit de ferramentas manuais', description: 'Conjunto demonstrativo de ferramentas para pequenos reparos domésticos.', price: 74.9, category: 'Ferramentas', available: true, aisle: '4', section: 'Kits de ferramentas', shelf: 'C3', image }
  ];
  window.SmartGuideDemo = {
    products: products,
    categories: ['Construção', 'Elétrica', 'Ferramentas', 'Hidráulica', 'Jardinagem', 'Organização', 'Pintura']
  };
}());
