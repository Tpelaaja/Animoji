const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const request = require('request');
const didyoumean = require('didyoumean');

module.exports = class RandomCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'random',
			aliases: ['rn', "rnd", "rand"],
			group: 'em',
			memberName: 'random',
			description: 'Get a random emoji',
			guarded: true,
      throttling: {usages: 1, duration: 20}
		});
	}

	async run(message) {
    let response = await this.voted(message);
    if (!response) return;
    
    let x = await this.react(message);
    
    request({url: "https://discordemoji.com/api", json: true}, function (error, response, body) {
      let names = []
      for (let i = 0; i < body.length; i++) {
        names.push(body[i].title)
      }
      let final = names[Math.floor(Math.random()*names.length)];
        let res = body[names.indexOf(final)]
        let e = new MessageEmbed()
        .setTitle(`**Found: ** \`${final}\``)
        .setDescription(`**ID: ** To add this emoji use id: \`${res.id}\``)
        .setThumbnail(res.image)
        .setColor(0x7a42f4)
        .setFooter(`Submitted by ${res.submitted_by}`)
        .addField(`Psst`, `Try going to [discord-emojis.ml](https://discord-emojis.ml) to access loads of random emojis.`)
        x.edit({embed: e}).then(() => {}).catch(() => message.channel.send(e));
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
  
  async react(message) {
    let x;
    let rand = function (triesCount) {
      var sum = 0;
      for(var i = 0; i < triesCount; i++){
          sum += Math.random();
      }
      return sum / triesCount;
    }
    if (rand(10000) > 0.5) x = await message.channel.send(`<a:searching:517032052059537418> Looking far and wide...`);
    else if (rand(10000) > 0.5) x = await message.channel.send(`<a:loading:448530477117079552> Loading...`);
    else x = await message.channel.send(`<a:typing:517028426813538305> Searching...`);
    return x;
  }
};

