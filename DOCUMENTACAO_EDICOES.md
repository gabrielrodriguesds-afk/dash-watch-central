# Documentação - Como Fazer Edições Futuras

## 📁 Estrutura do Projeto

```
src/
├── components/                 # Componentes React
│   ├── ui/                    # Componentes base (shadcn/ui)
│   ├── Dashboard.tsx          # Componente principal do dashboard
│   ├── MetricCard.tsx         # Card para métricas numéricas
│   ├── MetricCardText.tsx     # Card para métricas de texto
│   └── MessagePanel.tsx       # Painel lateral de mensagens
├── pages/                     # Páginas da aplicação
│   ├── Index.tsx             # Página principal
│   └── NotFound.tsx          # Página 404
├── types/                     # Tipos TypeScript
│   └── api.ts                # Tipos da API e dados
├── utils/                     # Utilitários
│   └── apiClient.ts          # Cliente para comunicação com API
├── hooks/                     # Hooks customizados
├── contexts/                  # Contextos React
└── index.css                 # Estilos globais e design system
```

## 🎨 Sistema de Design

### Cores e Temas
Todas as cores são definidas no arquivo `src/index.css` usando tokens semânticos:

```css
:root {
  --primary: [cor principal]
  --secondary: [cor secundária]
  --dashboard-card: [cor dos cards]
  --metric-primary: [cor dos cards primários]
  --metric-success: [cor dos cards de sucesso]
  --metric-danger: [cor dos cards de perigo]
  --metric-warning: [cor dos cards de aviso]
}
```

**❌ NUNCA faça isso:**
```tsx
<div className="bg-blue-500 text-white">
```

**✅ SEMPRE faça isso:**
```tsx
<div className="dashboard-card text-foreground">
```

## 📊 Modificando o Dashboard

### 1. Adicionando Novos Cards de Métricas

Para adicionar um novo card no dashboard, você tem duas opções:

#### MetricCard (para números)
```tsx
<MetricCard
  title="Nova Métrica"
  value={42}
  icon={TrendingUp}
  variant="primary"
  subtitle="descrição"
/>
```

#### MetricCardText (para texto/strings)
```tsx
<MetricCardText
  title="Tempo Médio"
  value="15 min"
  icon={Clock}
  variant="success"
  subtitle="tempo"
/>
```

### 2. Variantes Disponíveis
- `default`: Cor padrão
- `primary`: Azul
- `success`: Verde
- `danger`: Vermelho
- `warning`: Amarelo

### 3. Modificando Layout dos Cards

#### Seção Superior (3 cards principais)
```tsx
{/* Localização: ~linha 200 */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
  {/* Seus cards aqui */}
</div>
```

#### Seção dos Responsáveis (cards dinâmicos)
```tsx
{/* Localização: ~linha 250 */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Cards gerados automaticamente */}
</div>
```

#### Seção Inferior (3 cards)
```tsx
{/* Localização: ~linha 290 */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {/* Card de tempo médio ocupa 2 colunas */}
  <div className="md:col-span-2">
    <MetricCardText ... />
  </div>
  {/* Outros 2 cards */}
</div>
```

## 🔗 Conectando com seu Backend

### 1. Configuração da URL
Edite o arquivo `.env`:
```env
VITE_API_URL="http://SEU_IP:3000"
```

### 2. Estrutura de Dados Esperada
Seu backend deve retornar dados no formato definido em `src/types/api.ts`:

```typescript
interface DashboardData {
  totalOpen: number;              // Total de tickets abertos
  overdue: number;                // Tickets em atraso
  serverAlerts: number;           // Alertas do servidor
  avgServiceTime: string | number; // Tempo médio (pode ser string ou número)
  resolutionRate: number;         // Taxa de resolução
  ticketsAbertosHoje?: number;    // Novos tickets hoje
  ticketsFechadosHoje?: number;   // Tickets fechados hoje
  byResponsible: Array<{          // Tickets por responsável
    name: string;
    tickets: number;
    color?: string;
  }>;
  nextUpdate?: string;
  lastUpdate?: string;
  error?: string;
}
```

### 3. Adicionando Novos Campos
Para adicionar um novo campo:

1. **Atualize o tipo** em `src/types/api.ts`:
```typescript
interface DashboardData {
  // ... campos existentes
  novoCampo?: number;
}
```

2. **Use no Dashboard** em `src/components/Dashboard.tsx`:
```tsx
<MetricCard
  title="Novo Campo"
  value={dashboardData.novoField || 0}
  icon={NovoIcon}
  variant="primary"
/>
```

### 4. CORS no Backend
Seu backend Express precisa permitir requisições do Lovable:

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'https://id-preview--45c947fe-abcf-4331-8eb1-7f6bf79a9ae5.lovable.app',
    'http://localhost:5173'
  ],
  credentials: true
}));
```

## 🖱️ Usando Visual Edits (Recomendado)

Para mudanças visuais simples, use o **Visual Edits** em vez do chat:

1. Clique no botão "Edit" no canto inferior esquerdo
2. Selecione o elemento que quer modificar
3. Edite diretamente ou use prompts
4. Clique em "Save"

**Vantagens:**
- ✅ Gratuito (não consome créditos)
- ✅ Mais rápido
- ✅ Ideal para textos, cores, fontes

## 🎯 Ícones (Lucide React)

### Importando Novos Ícones
```tsx
import { 
  NomeDoIcon,
  OutroIcon 
} from "lucide-react";
```

### Ícones Comuns Disponíveis
- `Activity`, `AlertTriangle`, `CheckCircle`
- `Clock`, `Users`, `Server`, `Plus`
- `TrendingUp`, `TrendingDown`, `BarChart`
- `Settings`, `Home`, `User`, `Mail`

## 🔧 Troubleshooting Comum

### 1. Erro de Conexão com Backend
- ✅ Verifique se o backend está rodando
- ✅ Confirme a URL no arquivo `.env`
- ✅ Verifique as configurações de CORS
- ✅ Teste o endpoint diretamente no navegador

### 2. Cards Não Aparecem
- ✅ Verifique se os dados estão chegando no formato correto
- ✅ Use o console do navegador para ver erros
- ✅ Verifique se todos os campos obrigatórios estão presentes

### 3. Estilos Não Funcionam
- ✅ Use apenas tokens semânticos (evite cores diretas)
- ✅ Verifique se o Tailwind CSS está compilando
- ✅ Use `className` em vez de `style` quando possível

### 4. Ícones Não Aparecem
- ✅ Verifique se o ícone foi importado corretamente
- ✅ Certifique-se de que o nome está correto (case-sensitive)

## 🚀 Adicionando Novas Páginas

### 1. Criar o Componente da Página
```tsx
// src/pages/NovaPagina.tsx
const NovaPagina = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <h1 className="text-2xl font-bold">Nova Página</h1>
    </div>
  );
};

export default NovaPagina;
```

### 2. Adicionar Rota
Edite `src/App.tsx` ou arquivo de rotas:
```tsx
import NovaPagina from "@/pages/NovaPagina";

// Adicione a rota
<Route path="/nova-pagina" element={<NovaPagina />} />
```

### 3. Adicionar Navegação
Adicione links na navegação existente:
```tsx
<Link to="/nova-pagina">Nova Página</Link>
```

## 📱 Responsividade

### Classes Tailwind para Responsividade
```tsx
{/* Mobile-first approach */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* 1 coluna no mobile, 2 no tablet, 3 no desktop */}
</div>

{/* Breakpoints */}
{/* sm: 640px+ */}
{/* md: 768px+ */}
{/* lg: 1024px+ */}
{/* xl: 1280px+ */}
```

## 🎨 Personalizando Componentes

### Modificando MetricCard
Para adicionar novos estilos ou variantes:

```tsx
// Em src/components/MetricCard.tsx
const getVariantClasses = () => {
  switch (variant) {
    case "nova-variante":
      return "bg-purple-500 text-white";
    // ... outras variantes
  }
};
```

### Criando Novos Componentes
```tsx
// src/components/NovoComponente.tsx
import { cn } from "@/lib/utils";

interface NovoComponenteProps {
  className?: string;
  // outras props
}

export const NovoComponente = ({ className, ...props }: NovoComponenteProps) => {
  return (
    <div className={cn("base-styles", className)}>
      {/* conteúdo */}
    </div>
  );
};
```

## 📝 Boas Práticas

1. **Sempre use tipos TypeScript** - Defina interfaces para novos dados
2. **Use tokens semânticos** - Evite cores e estilos diretos
3. **Componentes pequenos** - Crie componentes focados e reutilizáveis
4. **Responsividade** - Teste em diferentes tamanhos de tela
5. **Acessibilidade** - Use alt text em imagens e aria-labels
6. **Performance** - Evite re-renders desnecessários

## 🔄 Atualizações e Deploy

### Deploy
1. Clique no botão "Publish" no canto superior direito
2. Seu app será publicado automaticamente

### Conectar Domínio Personalizado
1. Vá em Project > Settings > Domains
2. Adicione seu domínio personalizado
3. Configure os DNS conforme instruções

---

## 📞 Precisa de Ajuda?

- 📚 [Documentação Oficial Lovable](https://docs.lovable.dev/)
- 💬 [Discord da Comunidade](https://discord.com/channels/1119885301872070706/1280461670979993613)
- 🎥 [Playlist YouTube](https://www.youtube.com/watch?v=9KHLTZaJcR8&list=PLbVHz4urQBZkJiAWdG8HWoJTdgEysigIO)

**Dica:** Para mudanças pequenas, sempre prefira usar o Visual Edits em vez do chat - é mais rápido e gratuito!