const log = require('./Modules/log.js');
const KeybaseBot = require('./Modules/KeybaseBot.js');
const WebServer = require('./Modules/WebServer.js');
const _ = require('lodash');

const httpPort = _.get(process, 'env.KBB_PORT', 80);
const username = _.get(process, 'env.KBB_USERNAME');
const paperKey = _.get(process, 'env.KBB_PAPER_KEY');
const apiKey   = _.get(process, 'env.KBB_API_KEY');

if (typeof username == 'undefined') {
    log.error('env.KBB_USERNAME not defined');
    process.exit(1);
}
if (typeof paperKey == 'undefined') {
    log.error('env.KBB_PAPER_KEY not defined');
    process.exit(1);
}
if (typeof apiKey == 'undefined') {
    log.error('env.KBB_API_KEY not defined');
    process.exit(1);
}

(async () => {

    log.info(`Initializing Keybase bot`);
    const myBot = new KeybaseBot(username, paperKey);
    await myBot.init();
    log.info('Keybase bot initialized.')

    log.info(`Starting WebServer server on xport ${httpPort}`);
    const myWebserver = new WebServer(httpPort, apiKey);
    myWebserver.init();
    myWebserver.onChatMessage((msg) => {
        log.info(msg);
        myBot.chatMessage(msg.team, msg.topic, msg.message);
    })
})();

