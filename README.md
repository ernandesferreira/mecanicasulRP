# Auto Car Sul - Calculadora de Oficina

Uma aplicação web para calculadora de oficina mecânica no GTA RP. Permite cadastrar Produtos, Serviços e Boxes com valores de venda, e criar um carrinho de compras para calcular o total a ser cobrado.

## Tecnologias

- Next.js 16
- TypeScript
- Tailwind CSS
- PostgreSQL (planejado para Vercel)

## Funcionalidades

- Cadastro de Produtos, Serviços e Boxes
- Carrinho de compras
- Cálculo de total
- Interface app-like

## Como executar

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

3. Abra [http://localhost:3000](http://localhost:3000) no navegador.

## Deploy

### Vercel (pronto para deploy)

Este projeto ja esta preparado para subir no Vercel com Next.js 16.

Requisitos:
- Node.js 20.9+ (definido em `engines` no `package.json`)

Passo a passo:
1. Suba o codigo para um repositorio no GitHub.
2. No Vercel, clique em `Add New Project`.
3. Importe o repositorio `mecanicasulRP`.
4. Framework detectado: `Next.js`.
5. Build command: `npm run build`.
6. Output: `.next` (automatico do Next.js no Vercel).
7. Clique em `Deploy`.

Observacoes:
- Atualmente os dados de cadastro e autenticacao usam `localStorage` no navegador.
- Isso funciona no Vercel normalmente, mas os dados ficam por dispositivo/navegador.
- Se quiser persistencia centralizada, o proximo passo e migrar para banco (ex.: Vercel Postgres).
