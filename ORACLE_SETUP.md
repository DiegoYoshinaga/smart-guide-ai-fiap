# 🗄️ Configuração do Oracle Database — Smart Guide AI Assistant

Documento de preparação para a integração final com o banco Oracle da FIAP.

---

## 1. Pré-requisitos

- JDK 17 ou superior.
- Maven 3.9 ou superior.
- Oracle Database em execução (por exemplo, XE na FIAP), com listener ativo.
- Script SQL do Smart Guide AI Assistant aplicado no schema desejado.

---

## 2. Dependências necessárias

O backend já contém as dependências necessárias no `backend/pom.xml`:

- `spring-boot-starter-web` — API REST.
- `spring-boot-starter-data-jpa` — Spring Data JPA / Hibernate.
- `com.oracle.database.jdbc:ojdbc11:23.5.0.24.07` — driver JDBC do Oracle Database (escopo `runtime`).

Não é necessário adicionar nenhuma dependência adicional para o funcionamento da conexão.

---

## 3. Configuração do Spring Boot

As configurações ficam em:

- `backend/src/main/resources/application.properties`
- `backend/src/main/resources/application-demo.properties` (perfil local com H2)

### 3.1. Conexão com o Oracle

O backend lê as credenciais e a URL de conexão por meio de variáveis de ambiente:

```properties
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.datasource.driver-class-name=oracle.jdbc.OracleDriver
```

Nenhuma credencial é mantida no código.

### 3.2. Hibernate / JPA

- `spring.jpa.hibernate.ddl-auto=none` — o Hibernate não cria nem altera o schema.
- `spring.jpa.open-in-view=false`
- `spring.sql.init.mode=never`

O schema continua sendo responsabilidade do script SQL fornecido.

### 3.3. Perfis

- Perfil padrão: `demo` — usa H2 em memória no modo Oracle, para desenvolvimento local sem credenciais.
- Perfil para Oracle: `oracle` — utiliza a configuração de conexão acima.

---

## 4. Variáveis de ambiente

Exemplos com valores fictícios:

```bash
export DB_URL='jdbc:oracle:thin:@localhost:1521/XEPDB1'
export DB_USERNAME='smartguide'
export DB_PASSWORD='smartguide'
```

Ou, no Windows (PowerShell):

```powershell
$env:DB_URL = 'jdbc:oracle:thin:@localhost:1521/XEPDB1'
$env:DB_USERNAME = 'smartguide'
$env:DB_PASSWORD = 'smartguide'
```

---

## 5. Instruções de execução

1. **Aplique o script SQL** no Oracle (ver seção 6).
2. **Inicie o backend** com o perfil `oracle`:

   ```bash
   cd backend
   export DB_URL='jdbc:oracle:thin:@localhost:1521/XEPDB1'
   export DB_USERNAME='smartguide'
   export DB_PASSWORD='smartguide'
   mvn spring-boot:run -Dspring-boot.run.profiles=oracle
   ```

   Alternativas:

   ```bash
   SPRING_PROFILES_ACTIVE=oracle mvn spring-boot:run
   ```

   Ou com o JAR executável:

   ```bash
   java -jar target/smart-guide-backend-0.0.1-SNAPSHOT.jar --spring.profiles.active=oracle
   ```

3. **Inicie o frontend** com o Live Server, na pasta `frontend`.

4. **Verifique a conexão** no log do backend:

   ```text
   Started SmartGuideApplication in ... seconds
   HikariPool-1 - Start completed.
   ```

5. **Teste a API** em `http://localhost:8080/api/status`.

---

## 6. Ordem de execução do script SQL

O script SQL fornecido contém, nesta ordem:

1. Criação das tabelas:
   - `CATEGORIA`
   - `PRODUTO`
   - `PRODUTO_COMPLEMENTAR`
   - `LISTA_COMPRAS`
   - `ITEM_LISTA`
2. Índices criados:
   - `IDX_PRODUTO_CATEGORIA`
   - `IDX_PRODUTO_NOME`
   - `IDX_ITEM_LISTA_LISTA`
   - `IDX_ITEM_LISTA_PRODUTO`
3. População das tabelas.
4. Consultas demonstrativas (sem efeitos colaterais).
5. `COMMIT;`

---

## 7. Procedimento para validação com Oracle

Após o script SQL e a conexão configurados:

1. Confirmar no boot que o `HikariPool` criou a conexão com o Oracle.
2. Testar o endpoint de produtos:
   - `GET /api/produtos`
3. Testar o endpoint de categorias:
   - `GET /api/categorias`
4. Testar o endpoint de localização:
   - `GET /api/mapa/produto/{id}`
5. Testar o assistente:
   - `POST /api/chat`
6. Testar a lista de compras:
   - `POST /api/lista-compras`
   - `GET /api/lista-compras/{id}`
   - `POST /api/lista-compras/{id}/itens`

---

## 8. Compatibilidade entre entidades e Oracle

As entidades JPA foram mapeadas conforme o script SQL:

| Entidade | Tabela | Campos principais |
|---|---|---|
| `Categoria` | `CATEGORIA` | `ID_CATEGORIA`, `NOME`, `DESCRICAO` |
| `Produto` | `PRODUTO` | `ID_PRODUTO`, `ID_CATEGORIA`, `NOME`, `DESCRICAO`, `PRECO`, `IMAGEM_URL`, `QUANTIDADE_DISPONIVEL`, `CORREDOR`, `SECAO`, `PRATELEIRA`, `ATIVO` |
| `ProdutoComplementar` | `PRODUTO_COMPLEMENTAR` | Chave composta `ID_PRODUTO` / `ID_PRODUTO_COMPLEMENTAR` |
| `ListaCompra` | `LISTA_COMPRAS` | `ID_LISTA`, `DATA_CRIACAO`, `NOME_LISTA` |
| `ItemLista` | `ITEM_LISTA` | `ID_ITEM`, `ID_LISTA`, `ID_PRODUTO`, `QUANTIDADE` |

Os tipos Java utilizados são compatíveis com os tipos Oracle:

- `NUMBER(10,2)` → `BigDecimal` (precisão 10, escala 2).
- `VARCHAR2(n)` → `String`.
- `CHAR(1)` → `String` com valores `'S'`/`'N'`.
- `NUMBER` → `Integer`.
- `TIMESTAMP` → `LocalDateTime`.

---

## 9. Observações

- O schema Oracle **não** deve ser criado/alterado pelo Hibernate: `ddl-auto=none`.
- O script SQL é a fonte da verdade e não deve ser alterado.
- A integração com o Oracle será concluída quando a conexão for habilitada com credenciais reais.
