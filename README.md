# Educontrol

> Plataforma web para gerenciamento acadêmico de estudantes e professores.

O **Educontrol** é uma aplicação moderna desenvolvida para fornecer uma experiência simples e intuitiva para gerenciar atividades acadêmicas, professores, alunos e turmas. O projeto inclui recursos avançados para a criação e gerenciamento de atividades, com controle de visibilidade, calendário dinâmico e carrossel de imagens.

## Índice

- [Descrição do Projeto](#descrição-do-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Como Usar](#como-usar)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Futuras Implementações](#futuras-implementações)
- [Contato](#contato)

## Descrição do Projeto

O **Educontrol** permite que as escolas criem usuários, gerenciem atividades, quadros de professores e alunos, criem turmas e gerenciem eventos através de um calendário dinâmico. A escola é a única responsável por adicionar e excluir eventos e imagens no carrossel, e os professores têm acesso a esses dados. Além disso, para acessar o dashboard, os usuários (escola e professores) precisam preencher os dados de perfil para validar o acesso.

## Funcionalidades

- **Gerenciamento de Atividades:** Criação, edição e exclusão de atividades públicas e privadas.
- **Gerenciamento de Professores e Alunos:** Cadastro e exclusão de professores e alunos.
- **Criação de Turmas:** Organização dos alunos e professores em turmas.
- **Calendário de Atividades Dinâmico:** Adição de eventos apenas pela escola.
- **Carrossel de Imagens:** Adição e exclusão de imagens apenas pela escola.
- **Validação de Acesso:** Perfil deve ser preenchido para validar o acesso ao dashboard.
- **Integração de Banco de Dados:** Armazenamento e recuperação de dados no Firebase.
- **Interface Moderna:** Navegação responsiva com TailwindCSS.

## Tecnologias Utilizadas

- **Vite:** Ferramenta de build rápida.
- **ReactJS:** Biblioteca JavaScript para construção de interfaces.
- **Firebase:** Banco de dados NoSQL e autenticação.
- **TailwindCSS:** Framework CSS para estilização.
- **Zod:** Validação de esquemas.
- **React Hook Form:** Gerenciamento de formulários.

## Como Usar

### 1. Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/educontrol.git
cd educontrol
```

### 2. Instalar Dependências

Com `npm`:

```bash
npm install
```

Com `yarn`:

```bash
yarn install
```

### 3. Executar o Projeto

Com `npm`:

```bash
npm run dev
```

Com `yarn`:

```bash
yarn dev
```

Acesse a aplicação no navegador: [EduControl](https://educontrol.vercel.app).

## Scripts Disponíveis

- **`npm run dev`**: Inicia o servidor de desenvolvimento.
- **`npm run build`**: Gera os arquivos para produção.
- **`npm run start`**: Inicia a aplicação em produção.

## Estrutura do Projeto

- **`public`**: Arquivos públicos.
- **`src`**:
  - **`Components`**: Componentes reutilizáveis.
  - **`Context`**: Contexto da aplicação.
  - **`Error`**: Páginas de erro.
  - **`Images`**: Imagens do projeto.
  - **`Pages`**: Páginas principais.
  - **`Protected`**: Rotas protegidas.
  - **`Routes`**: Configuração de rotas.
  - **`Widgets/Calendar`**: Widgets e calendário.
  - **`services`**: Serviços da aplicação.

## Futuras Implementações

- **Categorias de Atividades:** Organização das atividades por categorias definidas pelo usuário.
- **Notificações em Tempo Real:** Alertas sobre novos comentários ou mudanças nas atividades públicas.
- **Modo Offline:** Acesso às atividades privadas mesmo sem conexão à internet.

## Contato

Desenvolvido por [Yuri Souza](https://github.com/yurisdevops). Entre em contato para dúvidas ou sugestões!

---

### ✅ **Gerencie suas atividades acadêmicas de maneira simples e interativa com o Educontrol!**

