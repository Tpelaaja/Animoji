const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ["dbl", "upvote", "vote"],
            description: "Support the bot"
        });
    }
    async run(message) {
      let e = new MessageEmbed()
      .setColor(process.env.theme)
      .setDescription(`<:dblSmile:376811626197811200> Upvote me on [Discord Bot List](https://discordbots.org/bot/448527818855284756/vote).\n
<:botsfordiscord2:381674698993303553> Upvote me on [Bots for Discord](https://botsfordiscord.com/bots/448527818855284756/vote)
<:patreon:452871851409014824> Support me on [patreon](https://www.patreon.com/emojify)`)
      message.channel.send(e)
    }
};
