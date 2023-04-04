require('dotenv').config();

const { OPENAI_API_KEY } = process.env;
const { TELEGRAM_BOT_API_KEY } = process.env;
const { PORT = '3000' } = process.env;
const { NODE_ENV } = process.env;

module.exports = {
  OPENAI_API_KEY,
  TELEGRAM_BOT_API_KEY,
  PORT,
  NODE_ENV,
};
