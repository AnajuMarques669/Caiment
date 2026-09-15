# CAIMENT — Frontend

Frontend completo do CAIMENT, plataforma de provador virtual inteligente.
Este é apenas o frontend: sem backend, sem banco de dados e sem integração
real com o Tripo AI. Tudo o que precisa desses recursos usa dados mockados
ou simulações locais.

## Como rodar

```bash
npm install
npm run dev
```

Abra o endereço mostrado no terminal (geralmente `http://localhost:5173`).

Para gerar o build de produção:

```bash
npm run build
npm run preview
```

## Stack

React · Vite · TypeScript · Tailwind CSS v4 · React Router · Lucide React ·
Three.js · React Three Fiber · @react-three/drei

## Estrutura

```
src/
├── components/   # componentes reutilizáveis (layout, ui, avatar, clothing, upload, dashboard, caia)
├── pages/        # uma pasta por tela
├── data/mock/    # todos os dados mockados, isolados dos componentes
├── types/        # tipos de domínio, incluindo os pontos de integração com o Tripo AI
├── services/     # simulações de geração de avatar e recomendação de tamanho
├── hooks/
└── utils/
```

## Fluxo de navegação

```
/  (Landing)
├── /login
├── /cadastro → /verificacao → /avatar-criacao
└── /dashboard
    ├── /avatar-criacao → /avatar-criacao/processando → /avatar
    ├── /avatar
    ├── /medidas
    ├── /provador
    ├── /guarda-roupa
    ├── /favoritos
    ├── /historico
    └── /configuracoes
```

## O que NÃO está implementado (de propósito)

- Integração real com o Tripo AI (os tipos e pontos de extensão já existem em `src/types` e `src/services/avatarService.ts`)
- Backend / Supabase / autenticação real
- Sistema real de recomendação de tamanho (mock em `src/services/recommendationService.ts`)
- Processamento real de imagens

## Preparação para as próximas etapas

- `AvatarViewer` (`src/components/avatar/AvatarViewer.tsx`) já aceita uma prop
  `modelUrl` — quando um `.glb` real existir, basta passá-la e o placeholder
  procedural é substituído automaticamente.
- `Clothing.clothingModelUrl` em `src/types/index.ts` está pronto para receber
  o modelo 3D de cada peça.
- `AvatarGenerationStatus` e `AvatarGenerationTask` em `src/types/index.ts`
  espelham o que uma resposta real do Tripo AI (taskId, status, modelUrl,
  previewUrl) deverá preencher.
