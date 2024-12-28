# EduControl  

> Sistema de gerenciamento para instituições de ensino, centralizando professores, turmas, alunos e eventos em uma plataforma única e segura.  

**EduControl** é uma plataforma moderna desenvolvida para facilitar a gestão acadêmica, oferecendo recursos avançados e uma interface intuitiva para instituições de ensino e professores.  

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

O **EduControl** organiza de maneira eficiente o gerenciamento de professores, turmas, alunos e eventos, com foco na segurança e na facilidade de uso.  

## Funcionalidades  

### Instituição  
- **Gestão de Professores:** Criação, edição e exclusão de perfis.  
- **Controle de Turmas e Alunos:** Adição e gerenciamento de alunos dentro das turmas.  
- **Destaques Visuais:** Upload de imagens para o _Swiper_.  
- **Calendário:** Organização e gerenciamento de eventos importantes.  

### Professor  
- **Acesso Restrito:** Professores podem apenas visualizar:  
  - Listagem de turmas e alunos.  
  - Calendário de eventos.  
  - Imagens de destaque no _Swiper_.  

### Segurança  
- Contas de professores têm permissões limitadas, garantindo controle e proteção das informações.  
- Autenticação e armazenamento de dados integrados ao Firebase.  

## Tecnologias Utilizadas  

- **Vite:** Ferramenta de build rápida para aplicações modernas.  
- **React:** Biblioteca para construção de interfaces dinâmicas.  
- **TypeScript:** Superset do JavaScript com tipagem estática.  
- **Tailwind CSS:** Framework de CSS para estilização rápida e consistente.  
- **Firebase:** Backend como serviço para autenticação e armazenamento.  
- **React Toastify:** Notificações elegantes para feedback visual.  
- **Zod:** Validação robusta de dados e formulários.  
- **Calendário Personalizado:** Gerenciamento de eventos.  

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

### 3. Configurar Variáveis de Ambiente  

Adicione as credenciais do Firebase ao arquivo `.env` na raiz do projeto:  

```env  
VITE_FIREBASE_API_KEY=SEU_API_KEY  
VITE_FIREBASE_AUTH_DOMAIN=SEU_AUTH_DOMAIN  
VITE_FIREBASE_PROJECT_ID=SEU_PROJECT_ID  
VITE_FIREBASE_STORAGE_BUCKET=SEU_STORAGE_BUCKET  
VITE_FIREBASE_MESSAGING_SENDER_ID=SEU_MESSAGING_SENDER_ID  
VITE_FIREBASE_APP_ID=SEU_APP_ID  
```  

### 4. Executar o Projeto  

```bash  
npm run dev  
```  

Acesse o projeto no navegador: `http://localhost:5173`.  

## Scripts Disponíveis  

- **`npm run dev`**: Inicia o servidor de desenvolvimento.  
- **`npm run build`**: Gera os arquivos para produção.  
- **`npm run preview`**: Visualiza a aplicação após o build.  

## Estrutura do Projeto  

- **`src/components`**: Componentes reutilizáveis.  
- **`src/pages`**: Páginas principais da aplicação.  
- **`src/services`**: Configuração de serviços externos, como Firebase.  
- **`src/styles`**: Estilos globais e específicos.  
- **`src/utils`**: Funções utilitárias.  

## Futuras Implementações  

- **Relatórios Detalhados:** Geração de relatórios de desempenho e frequência.  
- **Painel Administrativo Avançado:** Mais filtros e visualizações para dados de professores e alunos.  
- **Chat Interno:** Comunicação entre professores e administração.  

## Contato  

Desenvolvido por [Yuri Souza](https://github.com/yurisdevops). Entre em contato para dúvidas ou sugestões!  

---

### 🎓 **Simplifique a gestão acadêmica com o EduControl!**  
```  
