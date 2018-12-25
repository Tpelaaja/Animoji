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
      .setDescription(`<:dblSmile:376811626197811200> Upvote the bot at <https://discordbots.org/bot/448527818855284756/vote>.\n
<:patreon:452871851409014824> Support the bot https://www.patreon.com/emojify`)
      message.channel.send(e)
    }
};
