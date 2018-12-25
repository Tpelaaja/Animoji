const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const EmojiLib = require('emojilib')

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ["emojify"],
            description: "Translate something into emojis",
            usage: "[TextToEmojify:string]"
        });
    }
    async run(message, [TextToEmojify]) {
      let beforeMsg = message.channel.messages.last(3)[2];
      if (!TextToEmojify && beforeMsg) {
        TextToEmojify = beforeMsg.content;
        message.delete();
      }
      else if (!TextToEmojify) return message.channel.send(`<a:crossanimated:441425622187769877> You did not specify any text to emojify.`);
      TextToEmojify = TextToEmojify.split(' ')
      for (let key in EmojiLib.lib) {
        let obj = EmojiLib.lib[key];
        let keywords = obj.keywords;
        keywords.push(key);
        for (let w of keywords) {
          if (TextToEmojify.includes(w)) TextToEmojify = TextToEmojify.join(' ').replace(w, obj.char).split(' ')
        }
      }

      let e = new MessageEmbed()
      .setDescription(TextToEmojify.join(' '))
      .setColor(process.env.theme)

      message.channel.send(e)
    }
};
