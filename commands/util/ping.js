const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');

module.exports = class PingCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ping',
			aliases: ['pong', 'ping-pong'],
			group: 'util',
			memberName: 'ping',
			description: 'Checks the bot\'s ping to the Discord server.',
			guarded: true
		});
	}

	async run(msg) {
    let b = Date.now();
		const message = await msg.channel.send(`<a:typing:517028426813538305> Pinging...`);
		return message.edit(`<a:checkanimated:441425635500359721> Pong! \`${Date.now() - b}\`ms.`);
	}
};

