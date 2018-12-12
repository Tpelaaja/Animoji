const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const request = require('request');


function finish(checker, message) {
  message.guild.emojis.create(checker.image, checker.title).then(em => {
    message.channel.send(`Emoji added: ${em} `)
  }).catch(c => {message.channel.send('Unknown Error (2).')})
}


module.exports = class RemoveCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'remove',
			aliases: ['rem', 'delete'],
			group: 'em',
			memberName: 'remove',
			description: 'Remove an emoji from your server',
			guarded: true,
      guildOnly: true,
      args: [
				{
          key: 'name',
          prompt: 'What is the name of the emoji',
          type: 'string'
        }
			]
		});
	}

	async run(message, {name}) {
    if (!message.guild) return;
    if (!message.member.hasPermission('MANAGE_EMOJIS')) return message.channel.send(`You don't have enough permissions to add emojis. You need \`Manage Emojis\`.`)
    if (!message.guild.me.hasPermission('MANAGE_EMOJIS'))
      return message.channel.send(`I don't have enough permission to manage the emojis in this server. Make sure i have \`Manag Emojis\` permisions an try again.`)
    
    let emoji = message.guild.emojis.find(em => em.name.toLowerCase() === name.toLowerCase())
    if (!emoji) return message.channel.send(`I couldn't find any emojis called \`${name}\`.`)
    if (!emoji.url) return message.channel.send(`I couldn't find any emojis called \`${name}\`.`)
    let e = new MessageEmbed()
      .setTitle("Confirm?")
      .setThumbnail(emoji.url)
      .setDescription(`Are you sure you want to remove this emoji: ${emoji}?  Reply with \`yes\` to continue.`)
      .setColor(0x7a42f4)
      .setTimestamp()
    message.channel.send(e)
    const filter = m => m.author.id === message.author.id;
    message.channel.awaitMessages(filter, { max: 1}).then(c => {
      let a = c.first().content.toLowerCase()
      if (a === "yes" || a === "y" || a === "confirm" || a === "-yes" || a === "- yes") {
        emoji.delete()
        message.channel.send(`Emoji deleted`)
      } else return message.channel.send(`Cancelled.`)
    })
  }
};

