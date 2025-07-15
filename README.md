# README - Chatbot do Discord com JavaScript e Ollama

## Descrição do Projeto

Este projeto é um **chatbot** para o Discord desenvolvido com **JavaScript** e a biblioteca `discord.js`, integrado à API do **Ollama** para processamento de linguagem natural. O bot responde a comandos enviados em canais do Discord, utilizando qualquer modelo de IA disponível no Ollama (por padrão, configurado para `deepseek-r1`, com `llama2` como fallback). As respostas são processadas em tempo real via streaming, e a configuração do bot é feita por meio do arquivo `.env`. **Observação**: O histórico de mensagens não é salvo em um banco de dados ou armazenamento persistente; as mensagens são processadas apenas durante a interação atual.

---

## Funcionalidades

- **Interação via Comandos**: O bot responde a mensagens que começam com um prefixo configurável (ex.: `!estagiario`).
- **Streaming de Respostas**: As respostas do Ollama são exibidas em tempo real no Discord, com atualizações dinâmicas.
- **Configuração Personalizável**: O prefixo do bot, o modelo Ollama, a URL base e o token do Discord podem ser configurados no arquivo `.env`.
- **Feedback de Processamento**: O bot exibe um status de "digitando" enquanto processa a resposta.
- **Tratamento de Erros**: Exibe mensagens de erro no Discord em caso de falhas na conexão com o Ollama ou no processamento.
- **Limite de Mensagens**: Respeita o limite de 2000 caracteres do Discord, truncando respostas longas.

---

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução para JavaScript.
- **discord.js**: Biblioteca para interação com a API do Discord.
- **Axios**: Biblioteca para chamadas HTTP à API do Ollama.
- **Ollama**: Plataforma de IA para processamento de linguagem natural.
- **dotenv**: Para carregar variáveis de ambiente do arquivo `.env`.

---

## Estrutura do Projeto

```
├── index.js                # Arquivo principal do bot
├── .env                    # Configurações de ambiente
├── README.md               # Documentação do projeto
├── package.json            # Dependências e scripts
```

---

## Pré-requisitos

- **Node.js** (versão 18 ou superior)
- **Ollama** instalado e rodando localmente (`http://localhost:11434`)
- Um modelo Ollama instalado (ex.: `deepseek-r1`, `llama2`, ou qualquer outro modelo compatível)
- **NPM** ou **Yarn** para gerenciamento de pacotes
- Um **token de bot do Discord** gerado no [Discord Developer Portal](https://discord.com/developers/applications)

---

## Instalação

1. **Clone o repositório**:
   ```bash
   git clone git@github.com:GaussNoob/Chatbot-Discord-Com-Ollama.git
   cd Chatbot-Discord-Com-Ollama
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   # ou
   yarn install
   ```
   As dependências principais incluem `discord.js`, `axios` e `dotenv`.

3. **Configure o arquivo `.env`**:
   Crie um arquivo `.env` na raiz do projeto e edite as variáveis para personalizar o token do bot, o prefixo, o modelo Ollama e a URL base. Qualquer modelo disponível no Ollama pode ser usado. Exemplo de configuração:
   ```env
   # Token do bot do Discord (obtido no Discord Developer Portal)
   DISCORD_BOT_TOKEN="SEU_TOKEN_AQUI"
   # Nome do modelo Ollama a ser usado (qualquer modelo instalado no Ollama)
   OLLAMA_MODEL_NAME="deepseek-r1"
   # URL base do seu servidor Ollama (geralmente não muda)
   OLLAMA_BASE_URL="http://localhost:11434"
   # Prefixo para chamar o bot no Discord (ex: "!ai ", "!bot ", "!estagiario ")
   BOT_PREFIX="!estagiario "
   ```

4. **Inicie o servidor Ollama**:
   Certifique-se de que o Ollama está rodando localmente e que o modelo especificado está instalado:
   ```bash
   ollama run <NOME_DO_MODELO>
   # Exemplo: ollama run deepseek-r1
   ```

5. **Inicie o bot**:
   ```bash
   node index.js
   ```

6. **Convide o bot para o servidor do Discord**:
   - No [Discord Developer Portal](https://discord.com/developers/applications), crie uma aplicação e adicione um bot.
   - Copie o token do bot e cole no arquivo `.env` (variável `DISCORD_BOT_TOKEN`).
   - Gere um link de convite com permissões de leitura e escrita de mensagens e adicione o bot ao seu servidor.
   - Certifique-se de habilitar as intents necessárias (`Guilds`, `GuildMessages`, `MessageContent`) no Discord Developer Portal.

---

## Como Usar

1. **Envie um comando**: No canal do Discord, digite uma mensagem começando com o prefixo configurado (ex.: `!estagiario Qual é a capital da França?`).
2. **Receba respostas**: O bot exibirá um status de "digitando" e responderá com a resposta do Ollama em tempo real.
3. **Feedback de erros**: Se houver problemas (ex.: modelo não encontrado ou servidor Ollama offline), o bot informará no canal.
4. **Personalização**: Edite o arquivo `.env` para alterar o prefixo do bot (ex.: `!ai`, `!bot`), o modelo Ollama (ex.: `llama2`, `mistral`) ou a URL base.

**Nota**: As mensagens não são salvas; cada interação é processada independentemente e perdida após a resposta.

---

## Código Principal

### `index.js`
- **Função**: Inicializa o bot do Discord, conecta-se ao Ollama e processa mensagens.
- **Características**:
  - Usa `discord.js` para interagir com o Discord.
  - Integra com a API do Ollama via `axios` com streaming.
  - Respeita o limite de 2000 caracteres do Discord.
  - Exibe mensagens de erro amigáveis no caso de falhas.

### Configuração via `.env`
- **DISCORD_BOT_TOKEN**: Token do bot obtido no Discord Developer Portal.
- **OLLAMA_MODEL_NAME**: Qualquer modelo instalado no Ollama (ex.: `deepseek-r1`, `llama2`).
- **OLLAMA_BASE_URL**: URL do servidor Ollama (padrão: `http://localhost:11434`).
- **BOT_PREFIX**: Prefixo para chamar o bot (ex.: `!estagiario`, `!ai`).

---

## Integração com Ollama

- O bot faz chamadas à API do Ollama (`/api/generate`) usando `axios` com método `POST` e streaming ativado.
- As respostas são processadas em tempo real e enviadas ao Discord com atualizações a cada segundo ou quando necessário.
- Erros (como modelo indisponível ou servidor offline) são capturados e exibidos no canal do Discord.

---

## Possíveis Melhorias

- **Persistência de Dados**: Adicionar suporte a armazenamento de mensagens em um banco de dados (ex.: Redis, SQLite) ou `localStorage` para manter o histórico.
- **Comandos Avançados**: Implementar comandos como `!help` ou `!model` para trocar modelos dinamicamente.
- **Suporte a Múltiplos Canais**: Gerenciar respostas em diferentes canais ou servidores.
- **Respostas Multimodais**: Permitir envio de imagens ou outros formatos de resposta.
- **Testes Unitários**: Adicionar testes com Jest para garantir robustez.

---

## Solução de Problemas

- **Erro "Modelo não encontrado"**: Verifique se o modelo especificado em `OLLAMA_MODEL_NAME` está instalado no Ollama (`ollama pull <NOME_DO_MODELO>`).
- **Erro de conexão com Ollama**: Confirme que o servidor Ollama está rodando em `http://localhost:11434` e que a URL está correta no `.env`.
- **Bot não responde**: Verifique se o token do bot no `.env` está correto e se o bot tem permissões de leitura/escrita no canal. Confirme também se as intents (`Guilds`, `GuildMessages`, `MessageContent`) estão habilitadas no Discord Developer Portal.
- **Mensagens truncadas**: Respostas maiores que 2000 caracteres são cortadas devido ao limite do Discord. Considere dividir respostas longas em múltiplas mensagens.

---

## Repositório

O código-fonte do projeto está disponível em:  
[git@github.com:GaussNoob/Chatbot-Discord-Com-Ollama.git](git@github.com:GaussNoob/Chatbot-Discord-Com-Ollama.git)

---

## Licença

Este projeto é de código aberto e licenciado sob [MIT License](LICENSE).

---

## Contato

Para dúvidas ou sugestões, entre em contato com o desenvolvedor ou abra uma issue no repositório.
