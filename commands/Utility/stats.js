const { Command, Duration } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ["statistics", "stat", "uptime"],
            description: "View bot statistics"
        });
    }
    async run(message) {
      let client = message.client;
      let guilds = await client.shard.broadcastEval('this.guilds.size');
      let users = await client.shard.broadcastEval('this.users.size');
      let channels = await client.shard.broadcastEval('this.channels.size');
      let memory = await client.shard.broadcastEval('process.memoryUsage().heapUsed / 1024 / 1024')
      let duration = Duration.toNow(Date.now() - (process.uptime() * 1000));

      let e = new MessageEmbed()
      .setTitle(`Stats`)
      .setDescription(
        `
**Guilds: **${guilds}
**Users: **${users}
**Channels: **${channels}
        `
      )
      .addField(`Memory`, `${Math.floor(memory)}MB`, true)
      .addField(`Uptime`, `${duration}`, true)
      .setTimestamp()
      .setColor(process.env.theme)

      message.channel.send(e)
    }
};
