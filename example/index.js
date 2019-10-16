const TelegramBot = require('..');

const { TELEGRAM_BOT_TOKEN: token } = process.env;

const bot = new TelegramBot({
  token
});

bot.on('message', message => {
  const { from, chat, text } = message;
  console.log(`${from.username}:`, text);
  bot.sendMessage({ chat_id: chat.id, text });
});

(async () => {

  const { first_name, username } = await bot.getMe();
  console.log(`${first_name} (@${username}) is logged in.`);
  
  await bot.startPolling();

})();
