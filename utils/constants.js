const history = {};
const messages = {};

const commands = [
  {
    command: '/start',
    description: 'Начать заново',
  },
  {
    command: '/info',
    description: 'Информация',
  },
  {
    command: '/clear',
    description: 'Очистить контекст',
  },
  {
    command: '/help',
    description: 'Сообщить о проблеме',
  },
];

const toolTips = {
  start: (firstName) => `Добро пожаловать, ${firstName}. Введите ваш вопрос, чтобы получить ответ от нейросети`,
  info: (firstName, userName) => `Версия ChatGPT: 3.5\nВаше имя: ${firstName}\nВаш никнейм: ${userName}`,
  help: 'Если у вас возникла проблема с ботом, напишите разработчику: @uzornakovre_official',
  clear: 'Контекст очищен. Можете начать новый диалог.',
  waitMessage: 'Думаю...',

};

const errorMessages = {
  DEFAULT: (status, message) => `Ошибка ${status}.\n${message}\n
  Что делать в такой ситуации: /help`,
  TOO_MANY_REQUESTS: (status) => `Ошибка ${status}.\n
Cлишком много запросов на сервер в данный момент времени,
подождите немного и отправьте ваш вопрос заново`,
};

const images = {
  welcomeSticker: 'https://tlgrm.ru/_/stickers/22c/b26/22cb267f-a2ab-41e4-8360-fe35ac048c3b/7.webp',
};

module.exports = {
  history,
  messages,
  commands,
  toolTips,
  errorMessages,
  images,
};
