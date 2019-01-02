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
    async run(message, [Emoji]) {
      if (!Emoji)
        return message.channel.send(`<a:crossanimated:441425622187769877> Specify an emoji to download.`);
      let match = /<a?:[\w_]+:(\d{17,20})>/g;
      let found = Emoji.match(match);
      if (!found)
        return message.channel.send(`<a:crossanimated:441425622187769877> Specify an emoji to download.`);
      found = found[0];
      let id = found.split(':')[2].replace('>', '').replace(' ', '')
      let url = found.startsWith('<a') ? `https://cdn.discordapp.com/emojis/${id}.gif` : `https://cdn.discordapp.com/emojis/${id}.png`
      let e = new MessageEmbed()
      .setColor(process.env.theme)
      .setImage(url)
      message.channel.send(e)
    }
};
