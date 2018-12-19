const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const didyoumean = require('didyoumean');
const fileType = require('file-type');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ["icons"],
            description: "Find an icon to add as an emoji.",
            usage: "[SearchValue:string]"
        });
    }
    async run(message, [ SearchValue ]) {
      let prefix = message.guild ? message.guild.settings.prefix : "-";

      // Initial setup
      if (!SearchValue) return message.channel.send(`<a:crossanimated:441425622187769877> Type something to search. \`${prefix}search pepe\`.`)
      let m = await message.channel.send(`<a:searching:517032052059537418> Searching for \`${SearchValue}\``);

      // Search and find an emoji
      let body = await fetch(`https://a-bunch-of-apis.glitch.me/api/flaticon?q=${encodeURIComponent(SearchValue)}`);
      body = await body.json();

      if (body.error) return m.edit(`<a:crossanimated:441425622187769877> Error: ${body.error}`);
      else {
        let cont = false;
        let e = new MessageEmbed()
        .setTitle(`Found this icon`)
        .setDescription(`To add this emoji, you need permissions to \`Manage Emojis\`.`)
        .setThumbnail(body.src)
        .setURL(body.src)
        .setColor(process.env.theme)
        if (message.guild && message.member.hasPermission('MANAGE_EMOJIS')) cont = true
        if (cont) {
          e.setDescription('Choose a name for this emoji.znIf you want to cancel, type \`cancel\`. (60s)');
        }
        if (!cont) return m.edit({embed: e});
        m.edit({embed: e});

        let response;
        try {
          const filter = m => m.author.id === message.author.id;
          response = await message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time']});
          response = response.first().content;
        } catch (e) {return message.channel.send(`<a:crossanimated:441425622187769877> Timeout`)}

        if (response.toLowerCase() === "cancel") return message.channel.send(`<a:crossanimated:441425622187769877> Cancelled`)

        try {
          let em = await message.guild.emojis.create(body.src, response)
          message.channel.send(`<a:checkanimated:520306348613828609> Added emoji: ${em}.`)
        } catch(e) {
          message.channel.send(`<a:crossanimated:441425622187769877> Invalid emoji name.`)
        }
      }
    }
};
