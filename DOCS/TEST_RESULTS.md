# SAAP — Resultado dos Testes E2E (Playwright)

> Data: 03/07/2026
> Framework: Playwright + Chromium
> URL: http://localhost:5173
> Conta admin: john.nobody@email.com

## Resultado Geral

```
29 passed (1.3m)
```

## Detalhes por Módulo

| # | Módulo | Testes | Status |
|---|--------|--------|--------|
| 1 | Login (form, valid, invalid, validação) | 4 | ✅ |
| 2 | Dashboard (greeting, stats, quick actions) | 2 | ✅ |
| 3 | Sidebar (nav items, collapse toggle) | 2 | ✅ |
| 4 | Agendamentos (tabela, modal, filtros, detalhe) | 4 | ✅ |
| 5 | Pacientes (tabela, busca, criação) | 3 | ✅ |
| 6 | Profissionais (tabela, criação) | 2 | ✅ |
| 7 | Serviços (tabela, criação) | 2 | ✅ |
| 8 | Usuários (tabela, criação) | 2 | ✅ |
| 9 | Auditoria (tabela, filtros) | 1 | ✅ |
| 10 | Fila (live indicator, filtro profissional) | 2 | ✅ |
| 11 | Detalhe Agendamento (navegação ida/volta) | 1 | ✅ |
| 12 | Logout (redirect login) | 1 | ✅ |
| 13 | Confirmação Pública (token inválido, params) | 2 | ✅ |
| 14 | Proteção de Rotas (não autenticado → login) | 1 | ✅ |

## Testes Individuais

```
✓  1  Login › renders login form (1.7s)
✓  2  Login › valid credentials → dashboard (2.0s)
✓  3  Login › wrong password → error (1.9s)
✓  4  Login › empty submit → validation (1.7s)
✓  5  Dashboard › shows greeting and stat cards (2.3s)
✓  6  Dashboard › quick actions navigate (2.4s)
✓  7  Sidebar › all admin nav items visible (2.0s)
✓  8  Sidebar › collapse toggle (2.4s)
✓  9  Appointments › page loads with table (3.1s)
✓ 10  Appointments › open modal (2.7s)
✓ 11  Appointments › filters toggle (2.8s)
✓ 12  Appointments › click row → detail (3.5s)
✓ 13  Patients › page loads (2.9s)
✓ 14  Patients › search filters (3.4s)
✓ 15  Patients › create patient (3.0s)
✓ 16  Professionals › page loads (2.8s)
✓ 17  Professionals › create professional (3.3s)
✓ 18  Services › page loads (3.9s)
✓ 19  Services › create service (3.8s)
✓ 20  Users › page loads (2.8s)
✓ 21  Users › create user (3.4s)
✓ 22  Audit Logs › page loads with filters (2.7s)
✓ 23  Queue › loads with live indicator (2.8s)
✓ 24  Queue › professional filter (2.4s)
✓ 25  Appointment Detail › navigate from list and back (4.3s)
✓ 26  Logout › redirects to login (2.3s)
✓ 27  Public Confirm › invalid token (3.1s)
✓ 28  Public Confirm › missing params (1.3s)
✓ 29  Route Protection › unauthenticated → login (1.5s)
```

## Bugs Corrigidos Durante os Testes

1. **Endpoints API** — Todos alterados de `/resource` para `/api/v1/resource`
2. **Formulários vee-validate** — Schema movido para `:validation-schema` no `<Form>` em vez de `handleSubmit`
3. **CheckInRequest** — Campo corrigido de `verifiedPriority` para `verifiedLevel`
4. **Dashboard stats** — Filtro por data corrigido (antes contava todos, agora filtra por hoje)
5. **AppointmentActions** — "Chamar" agora só aparece para status `ARRIVED`
6. **live-pulse animation** — Nome corrigido no CSS
7. **QueryClient** — retry desabilitado para 401/403/409

## Como Rodar

```bash
pnpm exec playwright test --reporter=list
```

## Arquivo de Testes

`tests/saap.spec.ts`
