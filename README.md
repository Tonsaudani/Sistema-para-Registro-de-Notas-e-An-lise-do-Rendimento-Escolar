# Sistema de Desempenho Escolar

Projeto Integrador — aplicação web para registro, acompanhamento e análise do rendimento escolar.

## Tecnologias
- React + Vite
- JavaScript
- Node.js + Express
- PostgreSQL
- Git/GitHub
- Vitest

## Estrutura
```text
sistema-desempenho-escolar/
├── backend/
│   ├── src/
│   │   ├── db/
│   │   ├── routes/
│   │   ├── services/
│   │   └── server.js
│   └── tests/
├── database/
│   └── schema.sql
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── App.jsx
│       └── main.jsx
└── package.json
```

## Como iniciar

Pré-requisitos: Node.js 20+, PostgreSQL 15+ e Git.

1. Copie `.env.example` para `.env`.
2. Crie o banco `sistema_desempenho` no PostgreSQL.
3. Execute `database/schema.sql` no banco.
4. Execute `npm run install:all`.
5. Execute `npm run dev`.

Frontend: http://localhost:5173
API: http://localhost:3001/api/health

## Git
```bash
git init
git add .
git commit -m "chore: estrutura inicial do projeto"
```
