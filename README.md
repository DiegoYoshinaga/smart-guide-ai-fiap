# 🛒 Smart Guide AI Assistant

**Assistente inteligente para localização e recomendação de produtos em lojas físicas da Leroy Merlin.**

## 📌 Sobre o projeto

O **Smart Guide AI Assistant** é um sistema demonstrativo desenvolvido com o objetivo de melhorar a experiência dos clientes dentro de lojas físicas da Leroy Merlin.

A aplicação permite que os clientes descrevam suas necessidades utilizando linguagem natural e recebam recomendações de produtos cadastrados no sistema.

Além disso, o usuário pode consultar o catálogo de produtos, visualizar a localização dos itens em um mapa simplificado da loja e organizar suas compras por meio de uma lista integrada.

O projeto simula o funcionamento de um assistente baseado em inteligência artificial, utilizando identificação de palavras-chave e respostas predefinidas, sem depender de serviços externos de IA.

## 🎯 Objetivo

Demonstrar como uma solução digital pode facilitar a busca por produtos e melhorar a experiência de autoatendimento dentro de lojas físicas.

O sistema busca proporcionar uma navegação simples, intuitiva e integrada, permitindo que o cliente encontre os produtos necessários e saiba exatamente onde localizá-los na loja.

## ✨ Funcionalidades

### 🤖 1. Assistente IA
- Interface conversacional para interação com o cliente.
- Campo para envio de mensagens em linguagem natural.
- Identificação de palavras-chave.
- Respostas predefinidas conforme a necessidade apresentada.
- Recomendações de produtos cadastrados no catálogo.
- Visualização dos detalhes dos produtos.
- Adição de produtos à lista de compras.
- Acesso à localização dos produtos.

### 🛍️ 2. Catálogo de Produtos
- Listagem dos produtos cadastrados.
- Pesquisa por nome ou descrição.
- Filtro por categoria.
- Exibição de imagens, descrições e preços.
- Informação de disponibilidade simulada.
- Consulta dos detalhes dos produtos.
- Identificação da localização na loja.
- Adição de produtos à lista de compras.

### 🗺️ 3. Mapa da Loja
- Representação visual simplificada da loja.
- Identificação dos corredores e seções.
- Pesquisa de produtos.
- Destaque da localização do produto selecionado.
- Exibição do corredor, seção e prateleira.
- Indicação visual de um caminho demonstrativo até o produto.

### 📝 4. Lista de Compras
- Adição de produtos selecionados.
- Remoção de produtos.
- Controle de quantidade.
- Cálculo automático de subtotais.
- Cálculo do valor total da lista.
- Exibição da localização dos produtos.
- Persistência dos dados entre páginas.

## 🛠️ Tecnologias utilizadas

### Frontend
- HTML5
- CSS3
- JavaScript (Vanilla JS)
- Fetch API
- LocalStorage

### Backend
- Java
- Spring Boot
- Spring Data JPA
- API REST

### Banco de dados
- Banco de dados relacional para armazenamento de produtos, categorias, localizações e listas de compras.

## 📂 Estrutura do projeto

```text
Smart-Guide-AI-Assistant/
│
├── frontend/
│   ├── index.html
│   ├── catalogo.html
│   ├── mapa.html
│   ├── lista-compras.html
│   │
│   ├── css/
│   │   ├── style.css
│   │   ├── catalogo.css
│   │   ├── mapa.css
│   │   └── lista-compras.css
│   │
│   ├── js/
│   │   ├── api.js
│   │   ├── chat.js
│   │   ├── catalogo.js
│   │   ├── mapa.js
│   │   └── lista-compras.js
│   │
│   └── assets/
│       ├── images/
│       └── icons/
│
└── backend/
    └── ...
```

*Observação: a estrutura apresentada representa a organização planejada do projeto. Os diretórios e arquivos podem variar conforme a implementação.*

## ⚙️ Como executar o projeto

### Pré-requisitos

- Navegador atualizado.
- Visual Studio Code.
- Extensão Live Server para executar o frontend.
- JDK compatível com a versão utilizada no projeto.
- Maven.
- Banco de dados configurado para o backend.

### 1. Clonar o repositório

```bash
git clone URL_DO_REPOSITORIO
```

### 2. Acessar o projeto

```bash
cd Smart-Guide-AI-Assistant
```

### 3. Executar o frontend

Abra a pasta `frontend` no Visual Studio Code.

Utilize a extensão Live Server para executar o arquivo:

```text
index.html
```

### 4. Executar o backend

Acesse a pasta `backend` e execute a aplicação Spring Boot.

Com Maven Wrapper, quando disponível:

Windows:

```bash
mvnw.cmd spring-boot:run
```

Linux/macOS:

```bash
./mvnw spring-boot:run
```

### 5. Acessar a aplicação

Com o frontend e o backend em execução, acesse a URL disponibilizada pelo Live Server.

O backend deverá estar disponível em:

```text
http://localhost:8080
```

*Importante: a execução completa depende da configuração do banco de dados e da implementação dos endpoints REST.*

## ✅ Funcionalidades implementadas

### Backend

- API REST Spring Boot com as camadas controller, service, repository, model, dto e config.
- Endpoints implementados:

| Método | Rota | Finalidade |
|---|---|---|
| GET | `/api/status` | Verificação de status da API |
| GET | `/api/produtos` | Listagem, com filtros `nome` e `categoria` |
| GET | `/api/produtos/{id}` | Detalhes do produto |
| GET | `/api/produtos/{id}/complementares` | Produtos complementares |
| GET | `/api/categorias` | Listagem de categorias |
| GET | `/api/mapa/produto/{id}` | Localização do produto no mapa |
| POST | `/api/chat` | Mensagem do assistente e recomendações |
| POST | `/api/lista-compras` | Criar lista de compras |
| GET | `/api/lista-compras` | Listar listas |
| GET | `/api/lista-compras/{id}` | Consultar lista e itens |
| GET | `/api/lista-compras/{id}/itens` | Consultar itens |
| GET | `/api/lista-compras/{id}/total` | Valor total da lista |
| POST | `/api/lista-compras/{id}/itens` | Adicionar produto |
| PUT | `/api/lista-compras/{id}/itens/{idItem}` | Atualizar quantidade |
| DELETE | `/api/lista-compras/{id}/itens/{idItem}` | Remover item |
| DELETE | `/api/lista-compras/{id}/produtos/{idProduto}` | Remover produto da lista |
| DELETE | `/api/lista-compras/{id}/itens` | Limpar lista |

### Frontend

- Consumo da API REST via Fetch API centralizado em `frontend/js/api.js`.
- Assistente com identificação de palavras-chave e recomendações.
- Catálogo com busca e filtro por categoria.
- Mapa simplificado com localização dos produtos.
- Lista de compras com quantidades e totalização.

## 🔌 Integração frontend ↔ backend

- O frontend consome os endpoints do backend em `http://localhost:8080`.
- Em execução, o backend responde e o frontend não utiliza dados simulados.

## ⚙️ Como executar o backend

```bash
cd backend
mvn spring-boot:run
```

Perfil padrão: `demo` (banco local em memória H2, sem credenciais).

Perfil para Oracle Database:

```bash
export DB_URL='jdbc:oracle:thin:@localhost:1521/XEPDB1'
export DB_USERNAME='seu_usuario'
export DB_PASSWORD='sua_senha'

cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=oracle
```

## 🗄️ Configuração Oracle

Documento completo em [`ORACLE_SETUP.md`](ORACLE_SETUP.md).

## ⏳ Pendências para a entrega

- Validação final com Oracle Database real (CRUD, relacionamentos, persistência).
- Configuração das credenciais do banco da FIAP.
- Execução do script SQL de forma definitiva.

## 🗄️ Estrutura do banco de dados

O banco de dados foi planejado para armazenar as informações necessárias ao funcionamento do sistema.

| Tabela | Descrição |
|---|---|
| PRODUTO | Armazena os produtos, preços, descrições e localizações. |
| CATEGORIA | Organiza os produtos por categoria. |
| PRODUTO_COMPLEMENTAR | Relaciona produtos que podem ser utilizados em conjunto. |
| LISTA_COMPRAS | Armazena as listas de compras. |
| ITEM_LISTA | Registra os produtos e suas quantidades em cada lista. |

## 🔄 Fluxo de funcionamento

1. O cliente acessa o Smart Guide AI Assistant.
2. Descreve sua necessidade no assistente.
3. O sistema identifica palavras-chave na mensagem.
4. O assistente seleciona uma resposta predefinida.
5. Os produtos relacionados são consultados no catálogo.
6. O cliente visualiza as recomendações.
7. Pode consultar os detalhes e a localização dos produtos.
8. Adiciona os itens desejados à lista de compras.
9. A lista é atualizada com os produtos selecionados.

## ⚠️ Limitações do MVP

Por se tratar de uma versão demonstrativa, algumas funcionalidades possuem implementação simplificada.

**Não fazem parte do escopo:**

- Integração com inteligência artificial real.
- Consumo de APIs externas de IA.
- Integração com estoque real da Leroy Merlin.
- Integração com sistemas internos da empresa.
- Rastreamento por GPS.
- Localização indoor em tempo real.
- Sensores de localização.
- Pagamentos e checkout.
- Gestão avançada de projetos e reformas.

As respostas do assistente, a disponibilidade dos produtos e as localizações são utilizadas exclusivamente para fins demonstrativos.

## 🚀 Resultado esperado

Ao final, o sistema deverá oferecer uma experiência integrada na qual o cliente consiga descrever o que precisa, receber recomendações de produtos, consultar onde encontrá-los na loja e organizar suas compras em uma única aplicação.

## 👥 Equipe de desenvolvimento

Projeto desenvolvido em grupo como uma solução demonstrativa voltada à inovação na experiência de compra em lojas físicas.

## 📄 Licença

Projeto acadêmico e demonstrativo. Não possui vínculo oficial com a Leroy Merlin e não representa um produto comercial da empresa.

---

**Smart Guide AI Assistant — Encontre o que precisa. Descubra onde está. Simplifique suas compras.**