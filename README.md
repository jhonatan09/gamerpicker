# 🎮 Game Picker

Aplicação web construída com React 19 + Redux Toolkit + TailwindCSS, que permite aos usuários visualizar e filtrar jogos gratuitos por gênero, plataforma e requisitos mínimos de RAM.

---

## 🔧 Tecnologias Utilizadas

- [React 19](https://react.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vitest](https://vitest.dev/) para testes unitários
- [Axios](https://axios-http.com/) para requisições HTTP
- [Vite](https://vitejs.dev/) como bundler
- [React Router v7](https://reactrouter.com/en/main)
- [Redux Persist](https://github.com/rt2zz/redux-persist)
- [Storybook](https://storybook.js.org/) para documentação de componentes

---

## 🚀 Como rodar o projeto localmente

### Pré-requisitos

- Node.js (v18 ou superior)
- NPM ou Yarn

---

### 💻 Frontend

1. Clone este repositório:

   ```bash
   git clone https://github.com/seu-usuario/game-picker.git
   cd game-picker
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Execute o projeto:

   ```bash
   npm run dev
   ```

   A aplicação estará disponível em `http://localhost:5173`

---

### ✅ Rodar testes:

```bash
npm run test
```

---

### 📚 Rodar Storybook:

```bash
npm run storybook
```

---

## 📁 Estrutura do Projeto

```
src/
│
├── components/           # Componentes reutilizáveis como GameCard, GameGrid, Header
├── pages/                # Páginas principais: Home, GameDetails
├── store/                # Redux: slices, store e tipos
│   └── game/             # Slice específico para lógica dos jogos
├── utils/                # Funções utilitárias (ex: mocks para testes)
├── tests/                # Testes unitários com Vitest
├── App.tsx               # Componente raiz com Router
├── main.tsx              # Entrada da aplicação
└── index.css             # CSS global com Tailwind
```

---

## 🧠 Funcionalidades

- ✅ Listagem de jogos via API pública [FreeToGame](https://www.freetogame.com/)
- ✅ Filtros manuais por:
  - Gênero
  - Plataforma
  - RAM mínima (via scraping do site original)
- ✅ Detalhes do jogo com informações técnicas adicionais
- ✅ Skeleton loading enquanto carrega
- ✅ Design responsivo com Tailwind

---

## ✅ Testes

- Testes unitários com [Vitest](https://vitest.dev/)
- Utiliza [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/)
- Testes cobrem:
  - Renderização de componentes
  - Lógica de exibição dos filtros
  - Simulação de requisições com mocks

---

## 📦 Build

Para gerar a versão final de produção:

```bash
npm run build
```

Arquivos finais estarão na pasta `dist/`.

---

## 📖 Observações

- O estado global da aplicação (tema e filtros) é persistido com `redux-persist`.
- Scroll infinito está desativado por decisão de estabilidade.
- O projeto possui integração com Storybook para documentação dos componentes.
- A estrutura de i18n está iniciada, mas **a funcionalidade de múltiplos idiomas ainda não está implementada**.

---

## 📬 Contato

Caso deseje discutir este projeto em uma entrevista ou tenha sugestões:

**Jhonatan Cardoso Moreira**  
[LinkedIn](https://www.linkedin.com/in/jhonatan-cardoso-moreira/)  
[GitHub (Frontend)](https://github.com/seu-usuario/game-picker)  
[GitHub (Backend)](https://github.com/jhonatan09/gamerpickerapi)
