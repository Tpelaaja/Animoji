const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const request = require('request');


function finish(checker, message) {
  message.guild.emojis.create(checker.image, checker.title).then(em => {
    message.channel.send(`Emoji added: ${em} `)
  }).catch(c => {message.channel.send('Error (2): ' + c.message)})
}


module.exports = class AddCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'custom',
			aliases: ['add-custom', "upload"],
			group: 'em',
			memberName: 'custom',
			description: 'Add an emoji to your server from an image.',
			guarded: true,
      guildOnly: true
		});
	}
	async run(message) {
    let channel = message.channel
    let loading = message.client.guilds.find(val => val.id === '326237705828564993').emojis.find(val => val.name === 'loading');
    let g = message.guild
    if (!g) g = {commandPrefix: '-'}
    
    if (!message.member.hasPermission('MANAGE_EMOJIS')) return channel.send(`You don't have enough permissions to add emojis. You need \`Manage Emojis\`.`)
    
    if (message.attachments.size >= 2 || message.attachments.size < 1) return message.channel.send(`Attach only **one** image.`)
    if (!message.attachments.first().width) return message.channel.send(`Attach an **image** only.`)
    let image = message.attachments.first().attachment;
    const filter = m => m.author.id == message.author.id;
    message.channel.send(`Enter a name for the emoji.`)
    message.channel.awaitMessages(filter, { max: 1}).then(c => {
      let a = c.first().content
      if (a === "cancel") return channel.send('Cancelled.')
      let name = a
      
      message.guild.emojis.create(image, name).then(em => {
        message.channel.send(`Emoji added: ${em} `)
      }).catch(c => {message.channel.send('Error (2): ' + c.message)})

    }).catch(err => {})
  }
};

