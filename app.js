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
      description: 'Информация о пользователе',
    },
  ]);
};

bot.on('message', async (msg) => {
  const { text, chat } = msg;
  const chatId = chat.id;
  const completion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${text}.\n`,
    temperature: 1,
    max_tokens: 4000,
  });
  const output = completion.data.choices.pop();

  if (text === '/start') {
    await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/22c/b26/22cb267f-a2ab-41e4-8360-fe35ac048c3b/7.webp');
    return bot.sendMessage(chatId, `Добро пожаловать, ${msg.from.first_name}. Введите ваш вопрос, чтобы получить ответ от нейросети`);
  }
  if (text === '/info') {
    return bot.sendMessage(
      chatId,
      `Ваше имя: ${msg.from.first_name}\nВаш никнейм: ${msg.from.username}`,
    );
  }

  return bot.sendMessage(chatId, output.text);
});

start();
