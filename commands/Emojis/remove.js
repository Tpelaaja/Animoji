const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const yes = ["yes", "yeah", "yep", "y", "ya", "ok"]

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ["delete"],
            description: "Remove an emoji from the server",
            runIn: ["text"],
            usage: "[Emoji:string]"
        });
    }
    async run(message, [ Emoji ]) {
      if (!message.member.hasPermission('MANAGE_EMOJIS'))
        return message.channel.send(`<a:crossanimated:441425622187769877> You don't have enough permissions to add emojis. You need \`Manage Emojis\`.`);
      if (!Emoji)
        return message.channel.send(`<a:crossanimated:441425622187769877> Specify an emoji to remove.`)
      let found = message.guild.emojis.find(e => e.name.toLowerCase() === Emoji.toLowerCase());
      if (!found || !found.url)
        return message.channel.send(`<a:crossanimated:441425622187769877> There is no emoji in the server called \`${Emoji}\`.`);

      let e = new MessageEmbed()
        .setTitle("Confirm?")
        .setThumbnail(found.url)
        .setDescription(`Are you sure you want to remove this emoji: ${found}?\n Reply with \`yes\` to confirm.`)
        .setColor(process.env.theme)
        .setTimestamp()
      message.channel.send(e)

      const filter = m => m.author.id === message.author.id;
      let response;
      try {
        response = await message.channel.awaitMessages(filter, { max: 1});
        response = response.first().content.toLowerCase();
      } catch (e) {console.log(e)}

      if (!yes.includes(response))
        return message.channel.send(`<a:crossanimated:441425622187769877> Cancelled emoji removal.`);
      found.delete();
      message.channel.send(`<a:checkanimated:520306348613828609> Removed emoji.`)
    }
};
