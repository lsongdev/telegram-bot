const https = require('https');
const EventEmitter = require('events');

const request = (method, url, payload, headers) => {
  return new Promise((resolve, reject) => {
    const req = https.request(url, {
      method,
      headers,
    }, resolve);
    req.once('error', reject);
    req.end(payload);
  });
};

const post = (url, payload, headers) =>
  request('post', url, payload, headers);

const readStream = stream => {
  const buffer = [];
  return new Promise((resolve, reject) => {
    stream
      .on('error', reject)
      .on('data', chunk => buffer.push(chunk))
      .on('end', () => resolve(Buffer.concat(buffer)))
  });
};

class TelegramBot extends EventEmitter {
  constructor(options) {
    super();
    // https://core.telegram.org/bots/api#authorizing-your-bot
    Object.assign(this, {
      api: 'https://api.telegram.org'
    }, options);
  }
  /**
   * Making requests
   * @docs https://core.telegram.org/bots/api#making-requests
   * @param {String} method 
   * @param {Object} params 
   */
  call(method, params) {
    const { api, token } = this;
    const url = `${api}/bot${token}/${method}`;
    const headers = {
      'content-type': 'application/json'
    };
    const payload = JSON.stringify(params);
    return Promise
    .resolve()
    .then(() => post(url, payload, headers))
    .then(readStream)
    .then(JSON.parse)
    .then(response => {
      const { ok, result, error_code, description } = response;
      if(ok === false) {
        const error = new Error();
        error.name = 'TelegramBot Error';
        error.code = error_code;
        error.message = description;
        error.response = response;
        throw error;
      }
      return result;
    })
  }
  /**
   * getMe
   * @docs https://core.telegram.org/bots/api#getme
   */
  getMe() {
    return this.call('getMe');
  }
  /**
   * sendMessage
   * @docs https://core.telegram.org/bots/api#sendmessage
   * @param {*} message 
   */
  sendMessage(message) {
    return this.call('sendMessage', message);
  }
  /**
   * sendPhoto
   * @docs https://core.telegram.org/bots/api#sendphoto
   * @param {*} message 
   */
  sendPhoto(message) {
    return this.call('sendPhoto', message);
  }
  /**
   * Getting updates
   * @docs https://core.telegram.org/bots/api#getting-updates
   * @param {Object} options 
   */
  getUpdates(options) {
    return this.call('getUpdates', options);
  }
  /**
   * Process update
   * @docs https://core.telegram.org/bots/api#update
   * @param {s} update 
   */
  processUpdate(update) {
    const { update_id, message } = update;
    this.offset = update_id + 1;
    this.emit('message', message);
    return this;
  }
  /**
   * setWebhook
   * @docs https://core.telegram.org/bots/api#setwebhook
   * @param {Object} hook 
   */
  setWebhook(hook) {
    return this.call('setWebhook', hook);
  }
  /**
   * deleteWebhook
   * @docs https://core.telegram.org/bots/api#deletewebhook
   */
  deleteWebhook() {
    return this.call('deleteWebhook');
  }
  /**
   * getWebhookInfo
   * @docs https://core.telegram.org/bots/api#getwebhookinfo
   */
  getWebhookInfo() {
    return this.call('getWebhookInfo');
  }
  /**
   * startPolling
   * @docs https://core.telegram.org/bots/api#getupdates
   */
  startPolling() {
    let pull;
    return (pull = async () => {
      const updates = await this.getUpdates(this);
      for(const update of updates) {
        await this.processUpdate(update);
      }
      process.nextTick(pull);
    })();
  }
}

module.exports = TelegramBot;