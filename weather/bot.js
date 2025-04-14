const { Telegraf } = require('telegraf');
const axios = require('axios');


const bot = new Telegraf('7815928434:AAGfzzihAb8KFL_4jf7wRNMRJGa5SxMpYSI');

bot.start((ctx) => ctx.reply('Welcome'));
bot.on('message', async (ctx) => {
    if (ctx.message.location) {
        console.log(ctx.message.location);
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${ctx.message.location.latitude}&lon=${ctx.message.location.longitude}&appid=cd2840f7135a0d0dccdb6964d4e8b5ba`;
        
        try {
            // Запрос к API для получения данных о погоде
            const response = await axios.get(url);
            console.log(response.data);

            // Проверка на существование данных для температуры
            if (response.data && response.data.main && response.data.main.temp) {
                // Преобразование температуры из Кельвинов в Цельсии
                const tempInCelsius = (response.data.main.temp - 273.15).toFixed(1);

                // Отправка сообщения с правильной температурой
                ctx.reply(`${response.data.name}: ${tempInCelsius}°C`);
            } else {
                ctx.reply('Не удалось получить температуру');
            }
        } catch (error) {
            console.error('Ошибка получения данных:', error);
            ctx.reply('Не удалось получить данные о погоде');
        }
    }
    else if (ctx.message.text) {
        const city = ctx.message.text.trim();
        console.log(`City received: ${city}`);
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=cd2840f7135a0d0dccdb6964d4e8b5ba`;

        
    
        try {
            const response = await axios.get(url);
            console.log(response.data); // Посмотреть, что приходит от API
    
            if (response.data.cod === 200) {
                ctx.reply(`Погода в ${response.data.name}: ${response.data.main.temp}°C, ${response.data.weather[0].description}`);
            } else {
                ctx.reply(`Ошибка: ${response.data.message}`);
            }
        } catch (error) {
            console.error('Ошибка API:', error.response ? error.response.data : error);
            ctx.reply('Не удалось найти город. Проверь правильность написания.');
        }
    }
    
    
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
