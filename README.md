# UVV Achados & Perdidos

Sistema de achados e perdidos para a Universidade de Vila Velha (UVV), com backend em Clean Architecture e frontend React.

## Stack

- Backend: Node.js + Express + TypeScript + Prisma
- Frontend: React + TypeScript + Vite + Tailwind CSS
- Banco: PostgreSQL (Docker)

## Pré-requisitos

- Node.js 20+
- npm 10+
- Docker e Docker Compose

## Configuração de ambiente

### 1) Arquivos `.env`

Na raiz do projeto e no backend:

```bash
# na raiz
cp .env.example .env

# backend
cp backend/.env.example backend/.env
```

### 2) SMTP Gmail (recuperação de senha)

No `backend/.env`, configure:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=seuemail@gmail.com
SMTP_PASS=sua-app-password-do-google
SMTP_FROM="UVV Achados <seuemail@gmail.com>"
```

Observação: `SMTP_PASS` deve ser App Password (Google com 2FA ativo).

## Rodando o projeto

### 1) Subir banco

```bash
docker compose up -d
```

### 2) Backend

```bash
cd backend
npm install
npm run prisma:migrate
npm run prisma:generate
npm run dev
```

API em `http://localhost:3333`.

### 3) Frontend

```bash
cd frontend
npm install
npm run dev
```

App em `http://localhost:5173`.

## Scripts úteis

### Backend

- `npm run dev`: inicia com hot reload
- `npm run build`: compila TypeScript
- `npm run start`: roda build de produção
- `npm run prisma:migrate`: aplica migrações
- `npm run prisma:generate`: gera cliente Prisma
- `npm run prisma:studio`: abre Prisma Studio

### Frontend

- `npm run dev`: ambiente local
- `npm run build`: build de produção
- `npm run preview`: pré-visualização local do build
- `npm run lint`: validação de lint

## Rotas de autenticação

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/recover-password`
- `POST /auth/reset-password`

## Regras de e-mail institucional

Cadastro, login e recuperação aceitam:

- `@uvv.br`
- `@uvvnet.com.br`

## Estrutura do projeto

```text
.
├─ backend/
│  ├─ prisma/
│  └─ src/
│     ├─ entities/
│     ├─ usecases/
│     ├─ adapters/
│     └─ infrastructure/
├─ frontend/
│  └─ src/
│     ├─ components/
│     ├─ pages/
│     ├─ services/
│     ├─ contexts/
│     └─ routes/
├─ .env.example
└─ docker-compose.yml
```
