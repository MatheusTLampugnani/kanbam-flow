# 🚀 KanbanFlow - Gestão de Projetos e Fluxo de Trabalho

Uma plataforma corporativa full-stack de **Kanban Premium** projetada para gerenciar fluxos de trabalho, tarefas, colaboradores e prazos de forma robusta e altamente customizável. O **KanbanFlow** foi desenvolvido sob conceitos modernos de design de produto (SaaS), trazendo uma estética de vidro fosco (*glassmorphism*), tema escuro profundo (*sleek dark*), alto nível de responsividade móvel e controle total de propriedades dinâmicas.

---

## 🛠️ Stack Tecnológica

O projeto é estruturado em uma arquitetura monorepo segregada entre **Backend** e **Frontend**:

### 💻 Frontend (Cliente)
- **Core:** [React 19](https://react.dev/) + [Vite](https://vite.dev/) (Compilação ultra-rápida em menos de 500ms).
- **Drag & Drop:** [@hello-pangea/dnd](https://github.com/hello-pangea/dnd) (Fork moderno, estável e otimizado do React-Beautiful-DnD com suporte completo a React 18 e 19).
- **Estilização & Temas:** Vanilla CSS3 + Custom CSS Tokens (HSL) integrado ao [Bootstrap 5](https://getbootstrap.com/) com suporte dinâmico a Temas Claro e Escuro nativos.
- **Ícones:** [Lucide React](https://lucide.dev/).
- **Comunicação API:** Axios com tratamento centralizado de tokens de autenticação (JWT) e redirecionamento de segurança.

### ⚙️ Backend (Servidor)
- **Runtime:** [Node.js](https://nodejs.org/) com [Express](https://expressjs.com/).
- **Banco de Dados & ORM:** [Sequelize](https://sequelize.org/) integrado de forma rígida ao **PostgreSQL** (hospedado no Supabase).
- **Autenticação:** JWT (JSON Web Tokens) com decodificação automática base64 no cliente e criptografia de senhas via `bcrypt`.

---

## 💎 Recursos de Destaque (Premium Features)

### 1. Painel 100% Personalizável (Campos Customizados Dinâmicos)
Diferente dos kanbans rígidos tradicionais, o KanbanFlow inicia com um **painel de detalhes do cartão limpo e minimalista**. Os gestores possuem total liberdade para criar a estrutura que melhor se adapta à sua empresa:
- Crie propriedades personalizadas como: *Patrimônio, Setor, Custos, Datas de Manutenção, URLs e Checkboxes*.
- Os campos criados sincronizam-se instantaneamente em todos os cartões do quadro ativo.
- Suporte a múltiplos tipos de dados estruturados com validação de exibição.

### 2. Dashboard de Métricas do Quadro (Métricas em Tempo Real)
Um dashboard gerencial integrado com estatísticas agregadas do quadro ativo:
- **KPIs de Resumo:** Volume total de tarefas, contagem de urgências pendentes, percentual de subtarefas concluídas e colaborador destaque da semana.
- **Distribuição por Lista:** Gráficos de barras dinâmicos mostrando a densidade de tarefas em cada coluna.
- **Grelha de Prioridades:** Resumo analítico das tarefas categorizadas por prioridade (*Urgente, Alta, Média, Baixa*).
- **Tabela de Desempenho:** Líder de performance corporativa listando as tarefas ativas de cada colaborador, progresso de subtarefas e taxa individual de entrega de tarefas.

### 3. Múltiplos Quadros (Múltiplos Depósitos/Projetos)
- Barra lateral deslizante contendo a listagem de todos os quadros criados ou compartilhados.
- Criação instantânea de novos quadros com colunas padrão.
- Opção para renomear inline ou excluir quadros com remoção em cascata segura.

### 4. Responsividade Avançada de Dispositivos (Mobile Snapping UX)
Garante que a gerência possa acompanhar o fluxo diretamente da tela do celular de forma ergonômica:
- **Sidebar Drawer:** A barra lateral oculta-se por completo no celular, agindo como gaveta flutuante acionada por um botão Hamburger.
- **Scroll Snapping Magnetizado:** No celular, cada coluna ocupa **85vw** da tela. O gesto de arrastar horizontalmente "encaixa" (magnetiza) a coluna no centro exato da tela.
- **Sub-header de Busca:** Linha de ferramentas secundária móvel dedicada para buscas rápidas sem esmagar o topo.
- **Modais sem Rolagem Aninhada:** Adaptação vertical contínua das duas colunas de propriedades no celular, evitando barras de rolagem duplas.

### 5. Estética Refinada & Correções Visuais
- **Identidade HSL:** Paleta Slate-Indigo profunda (`#090d16`) em modo escuro com sombras premium difusas que evitam reflexos cansativos.
- **Bordas Arredondadas (16px):** Acabamento curvado de alto padrão em todos os modais.
- **Filtro de Contraste Automático:** O logotipo se adapta ao tema ativo (invertendo fontes de texto preto para branco em modo escuro, mantendo as cores teal originais da logo via rotação de matiz `hue-rotate(180deg)`).

---

## 🔧 Como Executar o Projeto Localmente

### Pré-requisitos
Certifique-se de ter o [Node.js](https://nodejs.org/) instalado em sua máquina.

### 1. Configurando o Banco de Dados (Supabase / PostgreSQL)
Caso o backend apresente erro de conexão de banco (`ENOTFOUND` ou projeto pausado no Supabase):
1. Acesse o seu painel do **Supabase** (`https://supabase.com/dashboard`).
2. Clique em **"Restore Project"** no projeto correspondente.
3. Aguarde alguns segundos para o banco de dados estar 100% online.

---

### 2. Inicializando o Servidor (Backend)

Abra um terminal na pasta raíz do projeto:

```bash
# Entre na pasta do backend
cd backend

# Instale as dependências
npm install

# Inicie o servidor em modo de desenvolvimento (Porta 3000)
npm run dev
```

---

### 3. Inicializando o Cliente (Frontend)

Abra outro terminal na pasta raíz do projeto:

```bash
# Entre na pasta do frontend
cd frontend

# Instale as dependências
npm install

# Inicie o servidor Vite de desenvolvimento (Porta 5173)
npm run dev
```

O aplicativo estará acessível em **[http://localhost:5173](http://localhost:5173)**.

---

## 📦 Comandos Úteis do Git

Para salvar suas alterações e enviar para o repositório remoto Git:

```bash
# Adicionar todas as alterações
git add .

# Criar commit com as atualizações
git commit -m "feat: melhorias visuais premium e responsividade mobile"

# Configurar a branch principal (caso não esteja)
git branch -M main

# Enviar as alterações para o GitHub
git push -u origin main
```
