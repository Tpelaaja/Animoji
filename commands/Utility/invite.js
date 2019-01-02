const { Command } = require('klasa');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ["inv"],
            description: "Invite the bot to your server"
        });
    }
    async run(message) {
      message.channel.send(`🔗Add me to your server: <https://discordapp.com/oauth2/authorize?client_id=448527818855284756&permissions=1074023488&scope=bot>`)
    }
};
