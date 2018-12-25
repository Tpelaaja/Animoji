const { Command } = require('klasa');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ["custom"],
            description: "Upload your own custom emoji to add to the server",
      			runIn: ['text']
        });
    }
    async run(message) {
      if (!message.member.hasPermission('MANAGE_EMOJIS'))
          return message.channel.send(`<a:crossanimated:441425622187769877> You don't have enough permissions to add emojis. You need \`Manage Emojis\`.`)
      if (message.attachments.size >= 2 || message.attachments.size < 1) return message.channel.send(`Attach only **one** image.`)
      if (!message.attachments.first().width) return message.channel.send(`Attach an **image** only.`);

      message.channel.send(`<a:typing:517028426813538305> Pick a name for this emoji or type \`cancel\` to cancel this.`);

      let image = message.attachments.first().attachment;
      const filter = m => m.author.id == message.author.id;
      let response;
      try {
        response = await message.channel.awaitMessages(filter, { max: 1});
        response = response.first().content;
      } catch (e) {
        message.channel.send(`<a:crossanimated:441425622187769877> File too large`)
      }
      if (response.toLowerCase() === "cancel") return message.channel.send(`<a:crossanimated:441425622187769877> Cancelled emoji upload.`);

      let newEmoji = await message.guild.emojis.create(image, response);
      message.channel.send(`<a:checkanimated:520306348613828609> Emoji added: ${newEmoji}.`)
    }
};
