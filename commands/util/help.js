  const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js')

module.exports = class HelpCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'help',
			aliases: ['commands', 'cmds'],
			group: 'util',
			memberName: 'help',
			description: 'Sends you some help.',
			guarded: true
		});
	}

	async run(msg) {
    let g = msg.guild
    if (!g) g = {commandPrefix: '-'}

    let e = new MessageEmbed()
    .setTitle('Help')
    .setTimestamp()
    .setColor(0xFF7B00)
    .addField('<a:gears:517046510999961610> Utility', `
_ _■ ${g.commandPrefix}help : Sends you some help
_ _■ ${g.commandPrefix}ping : Ping the bot
_ _■ ${g.commandPrefix}prefix [prefix] : Change the bot's prefix
_ _■ ${g.commandPrefix}vote : Like it? Rate it!`)
    .addField(`<:smirkthink:467910010937147432> Emoji`, `
_ _■ ${g.commandPrefix}search [emoji] : Search for an emoji (and get it's ID) from [Discord Emojis](https://discordemoji.com/)
_ _■ ${g.commandPrefix}google [emoji] : Search for an image from [google](https://images.google.com/) and add it as an emoji
_ _■ ${g.commandPrefix}random : Get a random emoji
_ _■ ${g.commandPrefix}add [id] : Add an emoji to your server by id
_ _■ ${g.commandPrefix}custom * : Add an emoji to your server by image
_ _■ ${g.commandPrefix}remove [name] : Remove an emoji from your server
_ _■ ${g.commandPrefix}emojis [type] : See the emojis in your server (\`regular\` or \`animated\`)
`)
    .addField(`:notepad_spiral: Note`, `\`*\`: Attach an image.`)
    .addField(':link: Invite', `
_ _■ [Invite](https://discordapp.com/oauth2/authorize?client_id=448527818855284756&permissions=1074023488&scope=bot) me to your server
_ _■ [Join](https://discordapp.com/invite/hN695FW) the help server`)
    msg.react('✅').then().catch(e => {})
    msg.author.send(e).then(() => {
      var done = [msg.author.id]
      const filter = (reaction, user) => reaction.emoji.name === '✅' && ! done.includes(user.id) && ! user.bot;
      const collector = msg.message.createReactionCollector(filter, {});
      collector.on('collect', (r, u)=> {
        u.send(e).then().catch(() => {r.message.channel.send(e)})
        done.push(u.id)
      });
      collector.on('end', collected => console.log(`Collected ${collected.size} reactions`));
    })
      .catch(() => {msg.channel.send(e)})


	}
};
