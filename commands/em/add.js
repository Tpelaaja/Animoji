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
			name: 'add',
			aliases: ['new'],
			group: 'em',
			memberName: 'add',
			description: 'Add an emoji to your server by id.',
			guarded: true,
      guildOnly: true,
      args: [
				{
          key: 'id',
          prompt: 'What is the emoji id?',
          type: 'string'
        }
			]
		});
	}

	async run(message, { id }) {
    let channel = message.channel
    let loading = "<a:loading:448530477117079552>";
    let g = message.guild;
    if (!g) g = {commandPrefix: '-'}

    if (!message.member.hasPermission('MANAGE_EMOJIS')) return channel.send(`You don't have enough permissions to add emojis. You need \`Manage Emojis\`.`)
    await load = message.react(loading)
    let checker = false;
    request({url: "https://discordemoji.com/api", json: true}, function (error, response, body) {
      checker = body.find(em => em.id === id);
      load.users.remove(message.client.user);
      if (checker === false) return channel.send("Unknown emoji ID. Use `" + g.commandPrefix + "search [emoji name]` to find out the id of your emoji.")
      else {
        let e = new MessageEmbed()
        .setTitle("Confirm?")
        .setThumbnail(checker.image)
        .setDescription("Are you sure you want to add this emoji to your server? Reply with `yes` to continue.")
        .setColor(0x7a42f4)
        .setTimestamp()
        channel.send(e)
        const filter = m => m.author.id === message.author.id;
        channel.awaitMessages(filter, { max: 1}).then(c => {
          let a = c.first().content.toLowerCase()
          if (a === "yes" || a === "y" || a === "confirm" || a === "-yes" || a === "- yes") {
            if (!message.guild.me.hasPermission('MANAGE_EMOJIS'))
              return channel.send(`I don't have enough permission to manage the emojis in this server. Make sure i have \`Manag Emojis\` permisions an try again.`)
            else {
              if (message.guild.emojis.find(val => val.name === checker.title) != undefined) {
                channel.send(`An emoji with the name \`${checker.title}\` already exists. Pick a different name for the emoji or type \`cancel\` to cancel.`)
                const filter = m => m.author.id == message.author.id;
                channel.awaitMessages(filter, { max: 1}).then(c => {
                  let a = c.first().content
                  if (a === "cancel") return channel.send('Cancelled.')
                  checker.title = a
                  if (message.guild.emojis.find(val => val.name === checker.title) != undefined)
                    return channel.send(`Error: This name is already taken aswell. Aborted command \`${message.content}\`.`)
                  else
                    finish(checker, message)
                }).catch(c => {channel.send('Unknown Error (3).'); console.log(c)})
              }
              else finish(checker, message)
            }
          } else channel.send('Cancelled.')
        }).catch(c => {channel.send('Unknown Error (1).'); console.log(c)})
      }
    })
  }
};
