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

      let voted = await this.bfdvoted(message);
      if (!voted) return;

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

    async bfdvoted(message) {
      let data = await fetch(`https://botsfordiscord.com/api/bot/448527818855284756/votes`, {headers: {Authorization: "3e546f0ffbefb15e77b95b8485c2eb29cbe05c72cdc5e6f7f293f3a9b286963dd1a8d94a539deb16e79c3d3a140c7c8879ce7fd0802e15b6e1d7b1860af121c7"}})
      data = await data.json()
      if (data.hasVoted24.includes(message.author.id)) return true
      else {
        message.channel.send(`🔒 This command is upvote locked. Upvote the bot today at <https://botsfordiscord.com/bots/448527818855284756/vote> and try again in a few minutes.`);
        return false;
      }
    }
};
