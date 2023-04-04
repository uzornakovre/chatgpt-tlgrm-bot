const TelegramApi = require('node-telegram-bot-api');
const { Configuration, OpenAIApi } = require('openai');
const { OPENAI_API_KEY, TELEGRAM_BOT_API_KEY } = require('./config');

const bot = new TelegramApi(TELEGRAM_BOT_API_KEY, { polling: true });

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

bot.on('message', async(msg) => {
  const text = msg.text;
  const chatId = msg.chat.id;
  const completion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: 'Hello world',
  });

  return bot.sendMessage(chatId, 'test');
});
