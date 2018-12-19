const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ["emoji-list", 'list'],
            description: "Get a list of emojis in this server",
            runIn: ["text"],
            usage: "[type:string]"
        });
    }
    async run(msg, [ type ]) {
      if (!type) type = "regular";
      let response;
  		const emojis = msg.guild.emojis.filter(emoji => type === 'animated' ? emoji.animated : !emoji.animated);
  		if (!emojis.size) response = `This server has no ${type} custom emoji.`
  		else response = emojis.map(emoji => emoji.toString()).join(' '), { split: { char: ' ' } };

      let e = new MessageEmbed()
      .setColor(process.env.theme)
      .setDescription(response)

      msg.channel.send(e);
    }
};
