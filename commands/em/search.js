const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const request = require('request');
const didyoumean = require('didyoumean');

module.exports = class SearchCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'search',
			aliases: ['find'],
			group: 'em',
			memberName: 'search',
			description: 'Search for an emoji.',
			guarded: true,
      args: [
				{
          key: 's',
          prompt: 'What do you want to search for?',
          type: 'string',
          validate: (v) => {
            return true;
          }
        }
			],
      throttling: {usages: 1, duration: 10}
		});
	}

	async run(message, { s }) {
    let x = await this.react(message, s);
    
    request({url: "https://discordemoji.com/api", json: true}, function (error, response, body) {
      let names = []
      for (let i = 0; i < body.length; i++) {
        names.push(body[i].title)
      }
      let final = didyoumean(s, names)
      if (final === null) {
        x.edit(`Your search for \`${s}\` returned no results.`).then(() => {}).catch(() => message.channel.send(`Your search for \`${s}\` returned no results.`));
      } else {
        let res = body[names.indexOf(final)]
        let e = new MessageEmbed()
        .setTitle(`**Found: ** \`${final}\``)
        .setDescription(`**ID: ** To add this emoji use id: \`${res.id}\``)
        .setImage(res.image)
        .setColor(0x7a42f4)
        .setFooter(`Submitted by ${res.submitted_by}`)
        x.edit({embed: e}).then(() => {}).catch(() => message.channel.send(e));
      }
    })
	}
  
  async react(message, s) {
    let x;
    let rand = function (triesCount) {
      var sum = 0;
      for(var i = 0; i < triesCount; i++){
          sum += Math.random();
      }
      return sum / triesCount;
    }
    if (rand(10000) > 0.5) x = await message.channel.send(`<a:searching:517032052059537418> Looking for a \`${s}\``);
    else if (rand(10000) > 0.5) x = await message.channel.send(`<a:loading:448530477117079552> Loading your search for a \`${s}\``);
    else x = await message.channel.send(`<a:typing:517028426813538305> Searching for a \`${s}\``);
    return x;
  }
};

