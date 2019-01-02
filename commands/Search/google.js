const GoogleImages = require('google-images');
const { MessageEmbed } = require('discord.js');
const client = new GoogleImages(process.env.GOOGLE_CX, process.env.GOOGLE_SEARCH_KEY);
const { Command } = require('klasa');
const TYPES = ["image/jpeg", "image/png"];

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['google-search'],
            description: "Search for an image from google",
            usage: "[GoogleSearchQuery:string]",
            runIn: ["text"]
        });
    }
    async run(message, [ GoogleSearchQuery ]) {
      let prefix = message.guild ? message.guild.settings.prefix : "-";
      if (!GoogleSearchQuery)
        return message.channel.send(`<a:crossanimated:441425622187769877> You didn't specify anything to search.`)
      client.search(GoogleSearchQuery, {safe: "high"}).then(async images => {
        if (images.length == 0) return message.channel.send(`<a:crossanimated:441425622187769877> No images found for the query \`${GoogleSearchQuery}\`.`);

        let img = images.filter(i => TYPES.includes(i.type))[0];
        if (!img) return message.channel.send(`<a:crossanimated:441425622187769877> No images found for the query \`${GoogleSearchQuery}\`.`);

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

        let em = await message.guild.emojis.create(img.thumbnail.url, response)
        message.channel.send(`<a:checkanimated:520306348613828609> Added emoji: ${em}.`)
      }).catch(e => {message.channel.send(`<a:crossanimated:441425622187769877> This command has been disabled for today.\nTry using \`${prefix}bing ${GoogleSearchQuery}\``)})
    }


};
