/* eslint-disable no-restricted-syntax */
const mongoose = require('mongoose');
const TelegramApi = require('node-telegram-bot-api');
const { Configuration, OpenAIApi } = require('openai');
const {
  OPENAI_API_KEY,
  TELEGRAM_BOT_API_KEY,
  DB_ADDRESS,
  MESSAGE_ALERT,
  MESSAGE_HISTORY,
  MESSAGE_USERS,
} = require('./config');
const User = require('./models/user');
const {
  commands,
  history,
  messages,
  toolTips,
  errorMessages,
  images,
  alerts,
} = require('./utils/constants');

const bot = new TelegramApi(TELEGRAM_BOT_API_KEY, { polling: true });
const configuration = new Configuration({ apiKey: OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

mongoose.connect(DB_ADDRESS);

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
  const lastName = from.last_name;
  const userName = from.username;
  let waitMessageId;

  if (!history[chatId]) {
    history[chatId] = [];
    messages[chatId] = [];
  }
  if (text === '/help') {
    return bot.sendMessage(chatId, toolTips.help(userName));
  }
  if (text === MESSAGE_ALERT) {
    return User.find({}).then((users) => {
      users.forEach((user) => {
        bot.sendMessage(user.chatId, alerts.TEST);
      });
    });
  }
  if (text === '/clear') {
    history[chatId] = [];
    messages[chatId] = [];
    return bot.sendMessage(chatId, toolTips.clear);
  }
  if (text === '/start') {
    User.findOne({ chatId }).then((res) => {
      if (!res) {
        User.create({
          chatId,
          userName: userName || 'noName',
          firstName: firstName || '',
          lastName: lastName || '',
          date: Date(),
        });
      }
    });
    await bot.sendSticker(chatId, images.welcomeSticker);
    return bot.sendMessage(chatId, toolTips.start(firstName));
  }
  if (text === MESSAGE_HISTORY) {
    return bot.sendMessage(chatId, JSON.stringify(history[chatId]));
  }
  if (text === MESSAGE_USERS) {
    return User.find({}).then((users) => bot.sendMessage(chatId, JSON.stringify(users)));
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

    if (completion.data.choices[0].finish_reason === 'length' || output.length > 4096) {
      history[chatId] = [];
      messages[chatId] = [];
      await bot.deleteMessage(chatId, waitMessageId);
      return bot.sendMessage(chatId, errorMessages.TOKEN_LENGTH);
    }

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
