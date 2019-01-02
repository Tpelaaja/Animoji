const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ["image", "png", "jpg", "gif", "file", "raw"],
            description: "Make an emoji into an image that you can download.",
            usage: "[Emoji:string]"
        });
    }
    async run(message) {
      if (!Emoji)
        return message.channel.send(`<a:crossanimated:441425622187769877> Specify an emoji to download.`);
      let found = message.guild.emojis.find(e => e.name.toLowerCase() === Emoji.toLowerCase());
      if (!found || !found.url)
        return message.channel.send(`<a:crossanimated:441425622187769877> There is no emoji in the server called \`${Emoji}\`.`);

      let e = new MessageEmbed()
      .setColor(process.env.theme)
      .setImage(found.url)
      message.channel.send(e)
    }
};
