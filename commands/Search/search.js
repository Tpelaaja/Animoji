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

      let voted = await this.bfdvoted(message);
      if (!voted) return;

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
        .addField(`⃠`, `Support the bot by [upvoting](https://botsfordiscord.com/bots/448527818855284756/vote) it.`)
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

    async dblvoted(message) {
      let response = await message.client.dbl.hasVoted(message.author.id);
      if (response) return true;
      else {
        message.channel.send(`🔒 This command is upvote locked. Upvote the bot today at <https://discordbots.org/bot/448527818855284756/vote> and try again in a few minutes.`);
        return false;
      }
    }

      async bfdvoted(message) {
        let data = await fetch(`https://botsfordiscord.com/api/bot/448527818855284756/votes`, {headers: {Authorization: "3e546f0ffbefb15e77b95b8485c2eb29cbe05c72cdc5e6f7f293f3a9b286963dd1a8d94a539deb16e79c3d3a140c7c8879ce7fd0802e15b6e1d7b1860af121c7"}})
        data = await data.json()
        if (data.hasVoted24.includes(message.author.id)) return true
        else {
          message.channel.send(`🔒 This command is upvote locked. Upvote the bot today at <https://discordbots.org/bot/448527818855284756/vote> and try again in a few minutes.`);
          return false;
        }
      }
};
