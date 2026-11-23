(function () {
  const intents = [
    {
      name: 'pintura',
      keywords: ['pintar', 'pintura', 'parede', 'tinta', 'pincel', 'rolo'],
      response: 'Para pintar uma parede, em geral você pode precisar de tinta e acessórios de aplicação. Confira os produtos disponíveis no catálogo; a preparação depende da superfície e do acabamento desejado.',
      categories: ['pintura']
    },
    {
      name: 'hidraulica',
      keywords: ['torneira', 'vazando', 'vazamento', 'cano', 'encanamento', 'hidraulica', 'vedar', 'vedacao'],
      response: 'Para verificar um vazamento, podem ser úteis itens de vedação e ferramentas para conexões. O reparo necessário depende da origem do problema. Veja algumas opções cadastradas no catálogo.',
      categories: ['hidraulica']
    },
    {
      name: 'eletrica',
      keywords: ['eletrica', 'eletrico', 'lampada', 'tomada', 'fio', 'interruptor', 'iluminacao'],
      response: 'Para um projeto elétrico, consulte os materiais disponíveis abaixo. Antes de qualquer manutenção, desligue a energia e procure um profissional qualificado quando necessário.',
      categories: ['eletrica']
    },
    {
      name: 'ferramentas',
      keywords: ['ferramenta', 'ferramentas', 'furadeira', 'chave', 'montar', 'montagem', 'movel', 'parafuso', 'prateleira'],
      response: 'Para montar um móvel ou instalar uma prateleira, ferramentas e itens de fixação podem ajudar. Confira abaixo os produtos cadastrados que podem ser relevantes.',
      categories: ['ferramentas', 'organizacao', 'construcao']
    },
    {
      name: 'construcao',
      keywords: ['construcao', 'cimento', 'argamassa', 'tijolo', 'reforma', 'alvenaria', 'bucha'],
      response: 'Para obras e pequenos reparos, os materiais adequados dependem do tipo de superfície e do serviço. Veja os itens relacionados encontrados no catálogo.',
      categories: ['construcao']
    },
    {
      name: 'jardinagem',
      keywords: ['jardim', 'jardinagem', 'planta', 'regar', 'mangueira', 'vaso', 'grama'],
      response: 'Para cuidar do jardim, há produtos de irrigação e outros itens que podem atender ao seu projeto. Confira as opções cadastradas abaixo.',
      categories: ['jardinagem']
    },
    {
      name: 'organizacao',
      keywords: ['organizacao', 'organizar', 'prateleira', 'estante', 'guardar', 'armario'],
      response: 'Para organizar seus espaços, você pode explorar os produtos de armazenamento e organização disponíveis no catálogo.',
      categories: ['organizacao']
    }
  ];

  function normalizeText(value) {
    return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }

  function appendMessage(text, sender) {
    const log = document.getElementById('chat-log');
    const message = document.createElement('article');
    message.className = 'chat-message ' + (sender === 'user' ? 'user-message' : 'assistant-message');
    if (sender !== 'user') {
      const avatar = document.createElement('div');
      avatar.className = 'message-avatar';
      avatar.setAttribute('aria-hidden', 'true');
      avatar.textContent = '✦';
      message.appendChild(avatar);
    }
    const content = document.createElement('div');
    content.className = 'message-content';
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    content.appendChild(paragraph);
    message.appendChild(content);
    log.appendChild(message);
    log.scrollTop = log.scrollHeight;
    return message;
  }

  function findIntent(message) {
    const normalized = normalizeText(message);
    return intents.find(function (intent) {
      return intent.keywords.some(function (keyword) { return normalized.indexOf(keyword) !== -1; });
    });
  }

  function matchingProducts(products, intent) {
    const categories = intent.categories;
    return products.filter(function (product) {
      const category = normalizeText(product.category);
      return categories.some(function (term) { return category.indexOf(term) !== -1; });
    }).slice(0, 3);
  }

  async function respond(message) {
    const log = document.getElementById('chat-log');
    const intent = findIntent(message);
    if (!intent) {
      appendMessage('Ainda não consegui identificar o tipo de projeto. Conte um pouco mais: você precisa de materiais para pintura, hidráulica, eletrica, ferramentas, construção, jardinagem ou organização?', 'assistant');
      return;
    }
    const loading = appendMessage('Vou consultar os produtos disponíveis...', 'assistant');
    loading.classList.add('is-loading');
    let response;
    try {
      response = await window.SmartGuideAPI.sendChatMessage(message);
    } catch (error) {
      console.error('Falha ao gerar recomendações.', error);
      const fallback = await window.SmartGuideUI.loadProductsWithDemo(function () {
        // fallback para demonstracao, sem aviso ao usuario
      });
      response = {
        resposta: intent.response,
        intencao: intent.name,
        produtos: fallback.products || []
      };
    }
    loading.remove();
    appendMessage(response.resposta || intent.response, 'assistant');
    const recommended = matchingProducts(response.produtos || [], intent);
    if (!recommended.length) {
      appendMessage('Não encontrei produtos dessa categoria no catálogo disponível. Tente outra descrição ou consulte o catálogo completo.', 'assistant');
      return;
    }
    const recommendations = document.createElement('div');
    recommendations.className = 'recommendation-grid';
    recommendations.setAttribute('aria-label', 'Produtos recomendados');
    recommended.forEach(function (product) {
      recommendations.appendChild(window.SmartGuideUI.createProductCard(product));
    });
    const wrapper = document.createElement('article');
    wrapper.className = 'chat-message assistant-message recommendation-message';
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.setAttribute('aria-hidden', 'true');
    avatar.textContent = '✦';
    wrapper.append(avatar, recommendations);
    log.appendChild(wrapper);
    log.scrollTop = log.scrollHeight;
  }

  document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('chat-form');
    const input = document.getElementById('chat-input');
    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      const message = input.value.trim();
      if (!message) {
        input.focus();
        return;
      }
      appendMessage(message, 'user');
      input.value = '';
      input.focus();
      form.querySelector('button').disabled = true;
      try {
        await respond(message);
      } catch (error) {
        console.error('Falha ao gerar recomendações.', error);
        appendMessage('Ocorreu um problema ao consultar o catálogo. Tente novamente.', 'assistant');
      } finally {
        form.querySelector('button').disabled = false;
      }
    });
    document.querySelectorAll('.suggestion-chip').forEach(function (button) {
      button.addEventListener('click', function () {
        input.value = button.textContent;
        form.requestSubmit();
      });
    });
  });
}());
