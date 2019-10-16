## telegram-bot

> Simple JavaScript API for Telegram Bot

### Installation

```bash
$ npm install telegram-bot
```

### Example

```js
const TelegramBot = require('telegram-bot');

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
```

### Contributing
- Fork this Repo first
- Clone your Repo
- Install dependencies by `$ npm install`
- Checkout a feature branch
- Feel free to add your features
- Make sure your features are fully tested
- Publish your local branch, Open a pull request
- Enjoy hacking <3

### MIT

This work is licensed under the [MIT license](./LICENSE).

---