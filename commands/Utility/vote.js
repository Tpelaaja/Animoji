const { Command } = require('klasa');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ["dbl", "upvote", "support"],
            description: "Vote for the bot in support"
        });
    }
    async run(message) {
      message.channel.send(`<:dblSmile:376811626197811200> Upvote the bot at <https://discordbots.org/bot/448527818855284756/vote>.`)
    }
};
