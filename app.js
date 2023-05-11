/* eslint-disable no-restricted-syntax */
const TelegramApi = require('node-telegram-bot-api');
const { Configuration, OpenAIApi } = require('openai');
const { OPENAI_API_KEY, TELEGRAM_BOT_API_KEY } = require('./config');
const {
  commands,
  history,
  messages,
  toolTips,
  errorMessages,
  images,
  users,
} = require('./utils/constants');

const bot = new TelegramApi(TELEGRAM_BOT_API_KEY, { polling: true });
const configuration = new Configuration({ apiKey: OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

function start() {
  bot.setMyCommands(commands);
}

function pushMessages(chatId) {
  for (const [text, output] of history[chatId]) {
    messages[chatId].push({ role: 'user', content: text });
    messages[chatId].push({ role: 'assistant', content: output });
  }
}

bot.on('message', async (msg) => {
  const { text, chat, from } = msg;
  const chatId = chat.id;
  const firstName = from.first_name;
  const userName = from.username;
  let waitMessageId;

  if (!history[chatId]) {
    history[chatId] = [];
    messages[chatId] = [];
  }

  if (text === '/help') {
    return bot.sendMessage(chatId, toolTips.help(userName));
  }
  if (text === '/clear') {
    history[chatId] = [];
    messages[chatId] = [];
    return bot.sendMessage(chatId, toolTips.clear);
  }
  if (text === '/start') {
    users.push({ [chatId]: userName, date: Date() });
    await bot.sendSticker(chatId, images.welcomeSticker);
    return bot.sendMessage(chatId, toolTips.start(firstName));
  }
  if (text === '/history') {
    return bot.sendMessage(chatId, JSON.stringify(history[chatId]));
  }
  if (text === '/users') {
    return bot.sendMessage(chatId, JSON.stringify(users));
  }

  pushMessages(chatId);

  bot.sendMessage(chatId, toolTips.waitMessage)
    .then((message) => {
      waitMessageId = message.message_id;
    }).then(() => bot.sendChatAction(chatId, 'typing'));

  messages[chatId].push({ role: 'user', content: text });

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: messages[chatId],
    });
    const output = completion.data.choices[0].message.content;

    messages[chatId].push({ role: 'assistant', content: output });
    history[chatId].push([text, output]);

    await bot.deleteMessage(chatId, waitMessageId);
    return bot.sendMessage(chatId, output);
  } catch (err) {
    if (err.response.status === 429) {
      return bot.sendMessage(chatId, errorMessages[429](err.response.status));
    }
    return bot.sendMessage(
      chatId,
      errorMessages.DEFAULT(err.response.status, err.response.data.error.message),
    );
  }
});

start();
