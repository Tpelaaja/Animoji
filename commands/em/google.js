const Command = require('../../structures/Command');
const GoogleImages = require('google-images');
const client = new GoogleImages(process.env.GOOGLE_CX, process.env.GOOGLE_SEARCH_KEY);
const { MessageEmbed } = require('discord.js');
var request = require('request').defaults({ encoding: null });
const TYPES = ["image/jpeg", "image/png"];

module.exports = class GoogleCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'google',
			aliases: ['google-search'],
			group: 'em',
			memberName: 'google',
			description: 'Google an image.',
      args: [
        {
          key: 'term',
          prompt: 'What do you want to search for?',
          type: 'string'
        }
      ],
      throttling: {usages: 1, duration: 10}
		});
	}

	async run(message, {term}) {
    if (!message.guild) return;
    if (!message.member.hasPermission('MANAGE_EMOJIS')) return message.channel.send(`You don't have enough permissions to add emojis. You need \`Manage Emojis\`.`)
    if (!message.guild.me.hasPermission('MANAGE_EMOJIS'))
      return message.channel.send(`I don't have enough permission to manage the emojis in this server. Make sure i have \`Manag Emojis\` permisions an try again.`)
    
    //let response = await this.voted(message);
    //if (!response) return;
    
    client.search(term, {safe: "high", size: "small"}).then(async images => {
      if (images.length == 0) return message.channel.send("No images found for query.");
      let img = images.filter(i => TYPES.includes(i.type))[0];
      if (!img) return message.channel.send('No images found for the query `' + term + `\`.`)
      let e = new MessageEmbed()
      .setTitle('Found something')
      .setDescription('Are you sure you want to add this image?')
      .setImage(img.thumbnail.url)
      .setColor(0xffc700)
      let sentMessage = await message.channel.send(e);
      const filter = m => m.author.id === message.author.id;
      message.channel.awaitMessages(filter, { max: 1}).then(c => {
        let a = c.first().content.toLowerCase()
        if (a === "yes" || a === "y" || a === "confirm" || a === "-yes" || a === "- yes") {
          const filter = m =>m.author.id == message.author.id;
          message.channel.send(`Enter a name for the emoji.`)
          message.channel.awaitMessages(filter, { max: 1}).then(c => {
            let a = c.first().content
            if (a === "cancel") return message.channel.send('Cancelled.')
            let name = a
              message.guild.emojis.create(img.thumbnail.url, name).then(em => {
                message.channel.send(`Emoji added: ${em} `)
              }).catch(c => {message.channel.send('Error (2): ' + c.message)})
          }).catch(err => {})
        } else return message.channel.send(`Cancelled.`)
      })
    })
	}
  
  async voted(message) {
    return new Promise(async function(resolve, reject) {
      let p = message.author;
      let c = message.channel;
      
      let response = await message.client.dbl.hasVoted(p.id);
      if (response) resolve(true);
      else {
        c.send(`🔒 This command is upvote locked. Upvote the bot today at <https://discordbots.org/bot/448527818855284756/vote> and try again in a few minutes.`);
        resolve(false)
      }
    });
  }
};

