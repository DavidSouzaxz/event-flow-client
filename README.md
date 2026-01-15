# EventFlow

EventFlow é uma aplicação web moderna para gerenciamento de eventos. Com ela, os usuários podem criar, editar, visualizar e gerenciar eventos, além de se registrar e fazer login para acessar funcionalidades exclusivas.

## Funcionalidades

- **Autenticação de Usuário**: Login e registro de usuários com autenticação segura.
- **Gerenciamento de Eventos**: Criação, edição e exclusão de eventos.
- **Visualização de Eventos**: Exibição de eventos disponíveis e detalhes de cada evento.
- **Gerenciamento de Ingressos**: Visualização e gerenciamento de ingressos adquiridos.

## Tecnologias Utilizadas

- **Frontend**:

  - React.js
  - Vite.js
  - Tailwind CSS

- **Backend** (não incluído neste repositório):

  - Node.js
  - Express.js

- **Outras Dependências**:
  - Axios
  - react-router-dom
  - react-qr-code

## Estrutura do Projeto

```
client/
├── public/                # Arquivos públicos (imagens, favicon, etc.)
├── src/                   # Código-fonte principal
│   ├── assets/            # Recursos estáticos
│   ├── components/        # Componentes reutilizáveis
│   │   ├── EventDetails.jsx
│   │   ├── MyTickets.jsx
│   │   └── Navbar.jsx
│   ├── context/           # Contextos globais (ex.: autenticação)
│   └── pages/             # Páginas principais da aplicação
│       ├── CreateEvent.jsx
│       ├── Dashboard.jsx
│       ├── EditEvent.jsx
│       ├── Home.jsx
│       ├── Login.jsx
│       ├── MyTickets.jsx
│       └── Register.jsx
│   ├── App.jsx            # Componente principal
│   ├── main.jsx           # Ponto de entrada do React
│   ├── App.css            # Estilos globais
│   └── index.css          # Estilos base
├── .gitignore             # Arquivos e pastas ignorados pelo Git
├── package.json           # Dependências e scripts do projeto
├── vite.config.js         # Configuração do Vite
└── README.md              # Documentação do projeto
```

## Instalação e Configuração

Siga os passos abaixo para rodar o projeto localmente:

### Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn

### Passos

1. Clone o repositório:

   ```bash
   git clone https://github.com/Davidsouzaxz/event-flow.git
   ```

2. Navegue até o diretório do projeto:

   ```bash
   cd event-flow/client
   ```

3. Instale as dependências:

   ```bash
   npm install
   ```

4. Inicie o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

5. Acesse a aplicação no navegador:
   ```
   http://localhost:5173
   ```

## Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento.
- `npm run build`: Gera a build de produção.
- `npm run preview`: Visualiza a build de produção localmente.

## Contribuição

Contribuições são bem-vindas! Siga os passos abaixo para contribuir:

1. Faça um fork do repositório.
2. Crie uma branch para sua feature ou correção de bug:
   ```bash
   git checkout -b minha-feature
   ```
3. Faça as alterações necessárias e commit:
   ```bash
   git commit -m "Minha nova feature"
   ```
4. Envie suas alterações:
   ```bash
   git push origin minha-feature
   ```
5. Abra um Pull Request no repositório original.

## Licença

Este projeto está licenciado sob a licença MIT. Consulte o arquivo LICENSE para mais informações.

---

Feito com 🍵 por [David Souza](https://github.com/Davidsouzaxz).
