# UVV Achados & Perdidos

Sistema de achados e perdidos exclusivo para a Universidade de Vila Velha (UVV). Conecta alunos, professores e colaboradores para publicar e buscar objetos perdidos no campus.

## Stack

- **Backend**: Node.js + Express + TypeScript (Clean Architecture)
- **Frontend**: React + TypeScript + Tailwind CSS + Vite
- **Banco de Dados**: PostgreSQL (Docker)
- **ORM**: Prisma

## Pré-requisitos

- Node.js 20.x
- Docker e Docker Compose
- npm 10.x

## Como rodar o projeto

### 1. Clonar e configurar variáveis de ambiente

```bash
git clone <repo>
cd achados_e_perdidos
cp backend/.env.example backend/.env
```

Edite `backend/.env` com suas configurações:
```
DATABASE_URL=postgresql://achados_user:achados_pass@localhost:5433/achados_perdidos
JWT_SECRET=sua-chave-secreta-aqui
PORT=3333
```

> **Nota:** A porta 5433 é usada para evitar conflito com instalações locais do PostgreSQL.

### 2. Subir o banco de dados

```bash
docker compose up -d
```

Verifique que o PostgreSQL está rodando:
```bash
docker ps
```

### 3. Configurar e iniciar o backend

```bash
cd backend
npm install
npm run prisma:migrate    # Cria as tabelas no banco
npm run prisma:generate   # Gera o cliente Prisma
npm run dev               # Inicia em http://localhost:3333
```

### 4. Iniciar o frontend

```bash
cd frontend
npm install
npm run dev               # Inicia em http://localhost:5173
```

Acesse **http://localhost:5173** no navegador.

## Scripts do Backend

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia em modo desenvolvimento |
| `npm run build` | Compila TypeScript |
| `npm run start` | Inicia versão compilada |
| `npm run prisma:migrate` | Aplica migrações |
| `npm run prisma:generate` | Gera cliente Prisma |
| `npm run prisma:studio` | Abre interface visual do banco |

## Scripts do Frontend

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia em modo desenvolvimento |
| `npm run build` | Gera versão de produção |
| `npm run preview` | Visualiza build de produção |

## Rotas da API

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| POST | /auth/register | Não | Cadastro (@uvv.br obrigatório) |
| POST | /auth/login | Não | Login, retorna JWT |
| POST | /auth/recover-password | Não | Recuperação de senha |
| POST | /items | Sim | Publicar item perdido |
| GET | /items | Sim | Listar com filtros |
| GET | /items/my-items | Sim | Meus itens |
| GET | /items/:id | Sim | Detalhe de um item |
| PATCH | /items/:id/status | Sim | Alterar status (só dono) |

## Funcionalidades

- Cadastro restrito a e-mails @uvv.br
- Publicação de itens perdidos com foto, descrição, categoria e local
- Busca por texto, categoria, localização e status
- Alteração de status (Perdido → Encontrado) pelo dono da publicação
- Autenticação com JWT (token expira em 7 dias)

## Estrutura

```
achados_e_perdidos/
├── docker-compose.yml
├── .env.example
├── backend/              # Clean Architecture
│   ├── src/entities/     # Entidades do domínio
│   ├── src/usecases/     # Casos de uso
│   ├── src/adapters/     # Controllers, Repositories, Middlewares
│   └── src/infrastructure/ # Prisma, Express, Rotas
└── frontend/             # React + Tailwind
    └── src/
        ├── components/   # UI e Features
        ├── pages/        # Páginas
        ├── hooks/        # Custom hooks
        ├── services/     # Chamadas à API
        ├── contexts/     # AuthContext
        └── routes/       # Rotas protegidas
```
