const { Telegraf } = require('telegraf');
const axios = require('axios');

// Ваш OpenAI API ключ
const openaiApiKey = 'sk-jmVx5iLtkZ-OjGEBsMXEPpv1CxSRLWXVWaThkijJE1T3BlbkFJKNLXQnvSk1FsnhK2x3yUWYeal6F1j4vqETMi1pwm4A'; 

// API ключ для прокси
const proxyApiKey = 'sk-daBZgpgXOHfKdQwo7PEyj2NHA87cXi8G'; 

// Telegram бот
const bot = new Telegraf('7935549476:AAGOf4gabMDj6KYU5Jvg5thuhBRgywmYyP8');

// Настроим прокси через axios
const axiosInstance = axios.create({
  baseURL: 'https://api.openai.com/v1',  // Базовый URL для OpenAI API
  headers: {
    'Authorization': `Bearer ${openaiApiKey}`,  // Используем ваш ключ API OpenAI
    'Content-Type': 'application/json',
  },
  proxy: {
    host: 'proxy.server.com', // Замените на адрес вашего прокси-сервера
    port: 8080,  // Порт вашего прокси-сервера (если нужен)
    auth: {
      username: 'user',  // Логин для прокси, если требуется
      password: 'password',  // Пароль для прокси, если требуется
    },
  },
});

// Ответ на команды от пользователей
bot.start((ctx) => ctx.reply('Hello! I can help you with OpenAI GPT-3'));

// Ответ на текстовые сообщения
bot.on('text', async (ctx) => {
  try {
    const userMessage = ctx.message.text;

    // Запрос к OpenAI через прокси
    const chatResponse = await axiosInstance.post('/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: userMessage }],
    });

    // Ответ пользователю через Telegram-бота
    ctx.reply(chatResponse.data.choices[0].message.content);
  } catch (error) {
    console.error('Error interacting with OpenAI:', error);
    ctx.reply('Sorry, there was an error with the OpenAI service.');
  }
});

// Запуск бота
bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
