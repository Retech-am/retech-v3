
# RETECH - Sistema de Gestão de Operações Retech

## Visão Geral do Projeto

RETECH é um sistema de gestão de operações comerciais projetado para simplificar e organizar processos comerciais, como:
- Cadastro de veículos, clientes, e vendedores.
- Registro de compras, vendas e pedidos.
- Gestão de operações com montadoras.
- Controle detalhado de status de veículos.

## Tecnologias Utilizadas
- **Frontend:** React.js
- **Backend:** Node.js com Express
- **Banco de Dados:** MariaDB
- **Gerenciamento de Containers:** Docker
- **Autenticação:** JWT (JSON Web Token)

## Configuração do Ambiente
Aqui estão as dependências principais que devem ser instaladas antes de rodar o projeto:

Dependências para o Backend:
1. Express: Framework para construir APIs.
2. MySQL2: Cliente para acessar o banco de dados.
3. jsonwebtoken (JWT): Para autenticação.
4. Cors: Para habilitar requisições entre origens diferentes.

Dependências para o Frontend:
1. React: Biblioteca para a interface.
2. Axios: Para fazer requisições HTTP.
3. React Router DOM: Para navegação no frontend.

### Pré-requisitos
Certifique-se de que as seguintes ferramentas estão instaladas:
- Docker
- Docker Compose
- Node.js
- npm ou yarn

### Configurando o Banco de Dados com Docker
1. Crie uma rede Docker (se ainda não existir):
   ```bash
   docker network create retech-network
   ```
2. Suba o container do MariaDB:
   ```bash
   docker run --name mariadb-container -e MYSQL_ROOT_PASSWORD=root123 -e MYSQL_DATABASE=retech_db -e MYSQL_USER=retech_user -e MYSQL_PASSWORD=senhaUsuario --network retech-network -p 3306:3306 -d mariadb:latest
   ```
3. Conecte-se ao banco de dados:
   ```bash
   docker exec -it mariadb-container mysql -u root -p
   ```

4. Execute o script SQL fornecido para criar as tabelas e configurar o banco de dados. O script está localizado no arquivo `database_setup.sql`.

### Rodando o Projeto
1. Clone este repositório:
   ```bash
   git clone https://github.com/seu-usuario/retech-v3.git
   cd retech_v3
   ```
2. Instale as dependências:
   ```bash
   cd backend
   npm install express mysql2 jsonwebtoken cors
   ```
   ```bash
   cd frontend
   npm install react axios react-router-dom
   ```
3. Inicie o backend:
   ```bash
   cd backend
   npm start
   ```
4. Abra o frontend:
   ```bash
   cd frontend
   npm start
   ```

### Estrutura do Banco de Dados
O script `database_setup.sql` cria todas as tabelas necessárias para o funcionamento do sistema.

