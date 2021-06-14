const Bot = require('keybase-bot');
const log = require('./log.js');

class KeybaseBot {

    constructor(username, paperKey) {

        this.bot = new Bot();
        this.username = username;
        this.paperKey = paperKey;
        return this;
    }

    async init() {
        try {
            await this.bot.init(this.username, this.paperKey);
        } catch (error) {
            log.error(error);
        }
    }

    async chatMessage(team, topic, message) {
        try {
            const channel = {
                name: team,
                membersType: 'team',
                topicType: 'chat',
                topicName: topic
            };
            const msg = {
                body: message,
            };
            await this.bot.chat.send(channel, msg);
            return true;
        } catch (error) {
            log.error(error);
        }
        return false;
    }

}
module.exports = KeybaseBot;