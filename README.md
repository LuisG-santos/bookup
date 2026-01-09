# Belivio — Plataforma SaaS de Agendamentos Multi-Tenant

Belivio é uma plataforma SaaS de agendamentos desenvolvida para negócios locais (como barbearias), com foco em **arquitetura escalável**, **multi-tenancy**, **experiência do usuário** e **padrões modernos de desenvolvimento web**.

O sistema permite que múltiplos estabelecimentos utilizem a mesma aplicação de forma isolada, cada um com sua própria agenda, serviços, identidade visual e base de clientes.

> Projeto em produção, desenvolvido com foco em cenários reais de mercado.

---

## Funcionalidades

### 👤 Para clientes
- Agendamento online de serviços
- Acompanhamento do status do agendamento
- Visualização de horários disponíveis em tempo real
- Interface responsiva (mobile-first)
- Suporte a PWA (instalação como aplicativo)

### 💈 Para estabelecimentos
- Painel administrativo por tenant
- Agenda global compartilhada
- Visualização e controle de agendamentos
- Personalização visual por tenant (cores, textos e branding)
- Isolamento total de dados entre estabelecimentos

---

## Arquitetura e Conceitos

- Multi-tenancy com isolamento de dados por tenant
- Estrutura preparada para subdomínios
- Agenda dinâmica baseada em intervalos contínuos de tempo
- Disponibilidade calculada dinamicamente no backend
- Separação clara entre frontend e backend
- Uso de Server Components e Server Actions
- Autenticação e autorização por tenant

---

## Tecnologias Utilizadas

### Frontend
- ![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white) (App Router)
- ![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB) 
- ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white) 
- ![TailWind CSS](https://img.shields.io/badge/Tailwind-38B2AC?style=flat&logo=tailwindcss&logoColor=white)
- ![shadcn/ui](https://img.shields.io/badge/shadcn/ui-000000?style=flat) 
- ![PWA](https://img.shields.io/badge/PWA-Supported-5A0FC8?style=flat) Progressive Web App (PWA)

### Backend
- ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
- ![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white) API Routes / Server Actions
- ![Prisma](https://img.shields.io/badge/Prisma-0C344B?style=flat&logo=prisma&logoColor=white) ORM
- ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=flat&logo=postgresql&logoColor=white) PostgreSQL

### Infraestrutura
- Vercel (deploy)
- PostgreSQL (Neon)
- BunnyCDN (assets e imagens)
- Autenticação via OAuth (Google)

---

## Lógica de Agendamentos

- Agenda global por tenant e por dia
- Cada agendamento possui:
  - `date` (início)
  - `endDate` (fim)
- A disponibilidade:
  - É calculada dinamicamente no backend
  - Utiliza uma granularidade mínima interna (ex.: 5 minutos)
  - Considera todos os agendamentos ativos do dia
- O frontend apenas consome a API de disponibilidade, não gera horários

---

## Autenticação e Segurança

- Autenticação via OAuth (Google)
- Sessões validadas no backend
- Validação de pertencimento ao tenant em rotas sensíveis
- Proteção contra acesso cruzado entre tenants

---

## Progressive Web App (PWA)

- Aplicação instalável em dispositivos móveis
- Manifest e ícones configurados
- Experiência otimizada para uso como aplicativo

---

## Status do Projeto

- MVP finalizado
- Em produção
- Em evolução contínua

### Próximas melhorias
- Pagamentos recorrentes
- Planos por assinatura
- Métricas e relatórios
- Notificações automáticas

---

## Autor

Desenvolvido por **Luis Gustavo**  
Estudante de Ciência da Computação e desenvolvedor web fullstack.

---

## 📄 Licença

Este projeto é proprietário.  
O código não está licenciado para redistribuição ou uso comercial sem autorização.
