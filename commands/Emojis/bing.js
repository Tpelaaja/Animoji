const { MessageEmbed } = require('discord.js');
const { Command } = require('klasa');
const Scraper = require ('images-scraper');
const bing = new Scraper.Bing();
const TYPES = ["jpeg", "png"];

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['bing-search'],
            description: "Search for an emoji from google to add to the server.",
            usage: "[BingSearchQuery:string]",
            runIn: ["text"]
        });
    }
    async run(message, [ BingSearchQuery ]) {

      let voted = await this.voted(message);
      if (!voted) return;

      if (!BingSearchQuery)
        return message.channel.send(`<a:crossanimated:441425622187769877> You didn't specify anything to search.`)

      let images = await bing.list({keyword: BingSearchQuery,num: 10,detail: true});
      if (images.length == 0) return message.channel.send(`<a:crossanimated:441425622187769877> No images found for the query \`${BingSearchQuery}\`.`);

      let img = images.filter(i => TYPES.includes(i.format))[0];
      if (!img) return message.channel.send(`<a:crossanimated:441425622187769877> No images found for the query \`${BingSearchQuery}\`.`);

      let e = new MessageEmbed()
      .setTitle('Found something')
      .setDescription(`To add this emoji, you need permissions to \`Manage Emojis\`.`)
      .setThumbnail(img.url)
      .setColor(process.env.theme)
      let hasPerm = false;
      if (message.guild && message.member.hasPermission('MANAGE_EMOJIS')) {
        hasPerm = true;
        e.setDescription('Choose a name for this emoji.\nIf you want to cancel, type \`cancel\`. (60s)');
      }

      let sent = await message.channel.send(e);
      if (!hasPerm) return;

      const filter = m => m.author.id === message.author.id;
      let response;
      try {
        response = await message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time']});
        response = response.first().content;
      } catch (e) {return message.channel.send(`<a:crossanimated:441425622187769877> Timeout`)}

      if (response.toLowerCase() === "cancel")
        return message.channel.send(`<a:crossanimated:441425622187769877> Cancelled.`);

      let em = await message.guild.emojis.create(img.thumb, response)
      message.channel.send(`<a:checkanimated:520306348613828609> Added emoji: ${em}.`)
  }



  async voted(message) {
    let response = await message.client.dbl.hasVoted(message.author.id);
    if (response) return true;
    else {
      message.channel.send(`🔒 This command is upvote locked. Upvote the bot today at <https://discordbots.org/bot/448527818855284756/vote> and try again in a few minutes.`);
      return false;
    }
  }
};
