const TelegramApi = require('node-telegram-bot-api');
const { Configuration, OpenAIApi } = require('openai');
const { OPENAI_API_KEY, TELEGRAM_BOT_API_KEY } = require('./config');

const bot = new TelegramApi(TELEGRAM_BOT_API_KEY, { polling: true });

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const start = () => {
  bot.setMyCommands([
    {
      command: '/start',
      description: 'Начать заново',
    },
    {
      command: '/info',
      description: 'Информация',
    },
  ]);
};

bot.on('message', async (msg) => {
  const { text, chat } = msg;
  const chatId = chat.id;
  const waitMessage = 'Думаю...';
  let waitMessageId;

  bot.sendMessage(chatId, waitMessage)
    .then((message) => {
      waitMessageId = message.message_id;
    });

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: text }],
    });
    const output = completion.data.choices[0].message.content;
    const options = {
      chat_id: chatId,
      message_id: waitMessageId,
    };

    if (text === '/start') {
      await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/22c/b26/22cb267f-a2ab-41e4-8360-fe35ac048c3b/7.webp');
      return bot.editMessageText(
        `Добро пожаловать, ${msg.from.first_name}. Введите ваш вопрос, чтобы получить ответ от нейросети`,
        options,
      );
    }
    if (text === '/info') {
      return bot.editMessageText(
        `Версия ChatGPT: 3.5\nВаше имя: ${msg.from.first_name}\nВаш никнейм: ${msg.from.username}`,
        options,
      );
    }

    return bot.editMessageText(output, options);
  } catch (err) {
    return bot.sendMessage(chatId, `Произошла ошибка: ${err}`);
  }
});

start();
