const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const didyoumean = require('didyoumean');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ["find"],
            description: "Search an emoji database for a specific emoji.",
            usage: "[SearchValue:string]"
        });
    }
    async run(message, [ SearchValue ]) {
      let prefix = message.guild ? message.guild.settings.prefix : "-";

      // Initial setup
      if (!SearchValue) return message.channel.send(`<a:crossanimated:441425622187769877> Type something to search. \`${prefix}search pepe\`.`)
      let m = await message.channel.send(`<a:searching:517032052059537418> Searching for \`${SearchValue}\``);

      // Search and find an emoji
      let body = await fetch("https://discordemoji.com/api");
      body = await body.json();
      let names = body.map(emoji => emoji.title);
      let emoji = didyoumean(SearchValue, names);

      // Show result of search
      if (emoji === null) return m.edit(`<a:crossanimated:441425622187769877> No search results found for \`${SearchValue}\`.\nMaybe try a google search: \`${prefix}google ${SearchValue}\``)
      else {
        let res = body[names.indexOf(emoji)]
        let cont = false;
        let e = new MessageEmbed()
        .setTitle(emoji)
        .setDescription(`To add this emoji, you need permissions to \`Manage Emojis\`.`)
        .setThumbnail(res.image)
        .setColor(process.env.theme)
        .setFooter(`Submitted by ${res.submitted_by}`)
        if (message.guild && message.member.hasPermission('MANAGE_EMOJIS')) cont = true
        if (cont) {
          e.setDescription('Choose a name for this emoji.\nIf you want to cancel, type \`cancel\`. (60s)');
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

        let em = await message.guild.emojis.create(res.image, response)
        message.channel.send(`<a:checkanimated:520306348613828609> Added emoji: ${em}.`)
      }
    }
};
