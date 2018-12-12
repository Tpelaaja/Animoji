const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');

module.exports = class PingCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'vote',
			aliases: ['upvote'],
			group: 'util',
			memberName: 'vote',
			description: 'Upvote the bot.',
			guarded: true
		});
	}

	async run(msg) {
    msg.channel.send(`<:dblSmile:376811626197811200> Upvote the bot at <https://discordbots.org/bot/448527818855284756/vote>.`)
	}
};

