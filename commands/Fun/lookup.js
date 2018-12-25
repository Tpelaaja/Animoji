const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const EmojiLib = require('emojilib');

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ["info", "emojipedia", "emojidex"],
            description: "Lookup an ordinary emoji for information",
            usage: "[Emoji:String]"
        });
    }
    async run(message, [Emoji]) {
      let prefix = message.guild ? message.guild.settings.prefix : "-";
      if (!Emoji) return message.channel.send(`Specify which emoji to lookup. Eg. \`${prefix}lookup dog\`.`)
      let toReturn = false;

      Emoji = Emoji.toLowerCase();
      for (let key in EmojiLib.lib) {
        let obj = EmojiLib.lib[key];
        let keywords = obj.keywords;
        keywords.push(key)
        for (let w of keywords) {
          if (Emoji === w) toReturn = key;
        }
      }

      if (!toReturn) return message.channel.send(`<a:crossanimated:441425622187769877> No emoji found for the search \`${Emoji}\`.`)

      let e = new MessageEmbed()
      .setTitle(toReturn.replaceAll('_', ' ').capitalize())
      .setDescription(EmojiLib.lib[toReturn].char)
      .addField('Category', EmojiLib.lib[toReturn].category.replaceAll('_', ' ').capitalize(), true)
      .addField('Skin toning', EmojiLib.lib[toReturn].fitzpatrick_scale ? "Yes" : "No", true)
      .setColor(process.env.theme)

      message.channel.send(e);
    }
};
