const history = {};
const messages = {};

const emoji = {
  start: String.fromCharCode(0x25B6),
  bin: String.fromCharCode(0x267B),
  laptop: String.fromCharCode(0x1F4BB),
  smile: String.fromCharCode(0x1F603),
  questionMark: String.fromCharCode(0x2753),
  exclamationMark: String.fromCharCode(0x2757),
};

const commands = [
  {
    command: '/start',
    description: `Начать заново  ${emoji.start}`,
  },
  {
    command: '/clear',
    description: `Очистить контекст ${emoji.bin}`,
  },
  {
    command: '/help',
    description: `Помощь ${emoji.questionMark}`,
  },
];

const toolTips = {
  start: (firstName) => `Добро пожаловать, ${firstName}.

Я - нейросеть, созданная компанией OpenAI, которая способна вести диалог, искать ошибки в коде, сочинять стихи, писать сценарии и даже спорить.

Введите ваш вопрос, чтобы получить ответ от меня.

/help - помощь в использовании.`,
  help: (userName) => `Модель ChatGPT: 3.5
Ваш никнейм: ${userName}

Чтобы начать диалог, просто отправьте ваш запрос в сообщении. Получение ответа может занимать какое-то время.

Чат хранит историю сообщений, руководствуясь которой может давать дальнейшие ответы. Для очистки контекста используйте команду
/clear в главном меню.

${emoji.exclamationMark} Обратите внимание, что данная модель чата способна держать в истории не более 4097 токенов (фрагментов текста),
соответственно, во избежание ошибок, рекомендуется периодически очищать контекст. Помимо этого, максимальная длина сообщения Telegram равна 4096 символов. По умолчанию, при превышении количества токенов или допустимой длины сообщения, контекст будет очищен автоматически.

Если у вас возникла проблема с ботом, напишите разработчику: @uzornakovre_official`,
  clear: 'Контекст очищен. Можете начать новый диалог.',
  waitMessage: 'Думаю...',

};

const errorMessages = {
  DEFAULT: (status, message) => `Ошибка ${status}.\n${message}\n
  Что делать в такой ситуации: /help`,
  TOKEN_LENGTH: `Длина текста моего ответа превышает либо лимит токенов, либо допустимый размер сообщения Telegram. Контекст очищен.
Для получения ответа вам необходимо сделать новый запрос
Почему так случилось${emoji.questionMark} - /help `,
  TOO_MANY_REQUESTS: (status) => `Ошибка ${status}.\n
Cлишком много запросов на сервер в данный момент времени,
подождите немного и отправьте ваш вопрос заново`,
};

const alerts = {
  TEST: 'Тестовое оповещение от @uzornakovre_official. Приношу извинения за беспокойство.',
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
  alerts,
};
