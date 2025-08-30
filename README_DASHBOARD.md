# Frontend Dashboard - Monitoramento de Chamados

Dashboard React para monitoramento de chamados integrado com a API Milvus através de um backend proxy.

## Funcionalidades

- ✅ Dashboard responsivo com métricas em tempo real
- ✅ Visualização de tickets abertos, em atraso e alertas
- ✅ Distribuição de chamados por responsável
- ✅ Tempo médio de atendimento e taxa de resolução
- ✅ Interface moderna com Tailwind CSS e shadcn/ui
- ✅ Atualização automática dos dados

## Tecnologias

- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Lucide Icons
- React Router

## Instalação

```bash
npm install
```

## Uso

### Desenvolvimento
```bash
npm run dev
```

### Build para produção
```bash
npm run build
```

### Preview da build
```bash
npm run preview
```

## Configuração

Configure as variáveis de ambiente no arquivo `.env`:

```env
# URL da API do backend
VITE_API_URL=http://localhost:3000

# Configurações do dashboard
VITE_APP_TITLE=Dashboard de Monitoramento
VITE_REFRESH_INTERVAL=60000
```

## Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── ui/             # Componentes base (shadcn/ui)
│   ├── Dashboard.tsx   # Componente principal do dashboard
│   └── ...
├── utils/              # Utilitários
│   └── apiClient.ts    # Cliente para comunicação com API
├── types/              # Definições de tipos TypeScript
│   └── api.ts          # Tipos da API
└── pages/              # Páginas da aplicação
    └── Index.tsx       # Página principal
```

## Métricas Exibidas

1. **Total de Tickets Abertos** - Número total de chamados ativos
2. **Tickets em Atraso** - Chamados que passaram do prazo
3. **Alertas do Servidor** - Chamados críticos ou relacionados a servidor
4. **Tickets por Responsável** - Distribuição por técnico/atendente
5. **Tempo Médio de Atendimento** - Tempo médio para resolução
6. **Taxa de Resolução** - Percentual de chamados resolvidos

## Integração com Backend

O frontend se comunica com o backend através da classe `ApiClient` que:

- Faz requisições HTTP para o endpoint `/api/chamados`
- Trata erros de conexão
- Formata os dados para exibição no dashboard
- Implementa logs para debug

## Personalização

Para personalizar o dashboard:

1. **Cores e tema**: Edite `tailwind.config.ts`
2. **Componentes**: Modifique os arquivos em `src/components/`
3. **Métricas**: Ajuste a lógica em `src/utils/apiClient.ts`
4. **Layout**: Altere `src/components/Dashboard.tsx`

## Troubleshooting

### Erro de conexão com backend
- Verifique se o backend está rodando na porta 3000
- Confirme a URL em `VITE_API_URL`
- Verifique os logs do console do navegador

### Dados não aparecem
- Verifique se a API Milvus está respondendo
- Confirme os logs do backend
- Teste o endpoint `/api/chamados` diretamente

