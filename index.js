require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");
const axios = require("axios");

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const OLLAMA_MODEL_NAME = process.env.OLLAMA_MODEL_NAME || "llama2";
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";

const BOT_PREFIX = process.env.BOT_PREFIX || "!estagiario ";

if (!DISCORD_BOT_TOKEN) {
  console.error(
    "ERRO: O token do bot do Discord não foi encontrado. Verifique seu arquivo .env.",
  );
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once("ready", () => {
  console.log(`Bot do Discord conectado como ${client.user.tag}!`);
  console.log(
    `Usando modelo Ollama: ${OLLAMA_MODEL_NAME} na URL: ${OLLAMA_BASE_URL}`,
  );
  console.log(`Prefixo do bot: "${BOT_PREFIX}"`); // Informa o prefixo usado
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  // Usa a variável BOT_PREFIX aqui
  if (!message.content.startsWith(BOT_PREFIX)) {
    return;
  }

  const userPrompt = message.content.slice(BOT_PREFIX.length).trim();

  if (!userPrompt) {
    message.reply(
      `Por favor, digite sua pergunta depois de \`${BOT_PREFIX.trim()}\`. Ex: \`${BOT_PREFIX}qual a capital da França?\``,
    );
    return;
  }

  console.log(`Mensagem recebida de ${message.author.tag}: "${userPrompt}"`);

  await message.channel.sendTyping();

  try {
    let fullResponse = "";
    const responseMessage = await message.reply("Pensando...");

    const ollamaApiUrl = `${OLLAMA_BASE_URL}/api/generate`;

    const axiosResponse = await axios.post(
      ollamaApiUrl,
      {
        model: OLLAMA_MODEL_NAME,
        prompt: userPrompt,
        stream: true,
      },
      {
        responseType: "stream",
      },
    );

    const stream = axiosResponse.data;
    let lastUpdateTime = Date.now();
    const updateInterval = 1000;
    const maxDiscordMessageLength = 2000;

    stream.on("data", (chunk) => {
      const lines = chunk.toString().split("\n");
      for (const line of lines) {
        if (line.trim() === "") continue;
        try {
          const data = JSON.parse(line);
          if (data.response) {
            fullResponse += data.response;
          }
          if (data.done) {
            stream.destroy();
            return;
          }
        } catch (e) {
          // console.error('Erro ao fazer parse do JSON do stream:', e);
        }
      }

      const now = Date.now();
      if (
        now - lastUpdateTime > updateInterval ||
        fullResponse.length >= maxDiscordMessageLength - 50
      ) {
        if (fullResponse.length > 0) {
          const displayResponse =
            fullResponse.length > maxDiscordMessageLength
              ? fullResponse.substring(0, maxDiscordMessageLength - 3) + "..."
              : fullResponse;
          responseMessage.edit(displayResponse);
        }
        lastUpdateTime = now;
      }
    });

    stream.on("end", () => {
      if (fullResponse.length > 0) {
        const finalDisplayResponse =
          fullResponse.length > maxDiscordMessageLength
            ? fullResponse.substring(0, maxDiscordMessageLength)
            : fullResponse;
        responseMessage.edit(finalDisplayResponse);
      } else {
        responseMessage.edit(
          "Desculpe, não consegui obter uma resposta completa.",
        );
      }
      console.log("Stream encerrado. Resposta completa.");
    });

    stream.on("error", (err) => {
      console.error("Erro no stream do Ollama:", err);
      responseMessage.edit(
        "Ocorreu um erro ao obter a resposta do Ollama. Tente novamente mais tarde.",
      );
    });
  } catch (error) {
    console.error("Erro ao conectar ou processar Ollama:", error);
    message.reply(
      "Ocorreu um erro ao tentar conectar com o Ollama. Verifique se ele está rodando e o modelo está disponível.",
    );
  }
});

client.login(DISCORD_BOT_TOKEN);
