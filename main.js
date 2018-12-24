const { Client } = require('klasa');
const DBL = require("dblapi.js");
const dbl = process.env.dbl;

const BFD = require("bfd-api");
const bfd = new BFD(process.env.bfd);

class client extends Client {
  setDBL(dbl) {this.dbl = dbl;}
};

const bot = new client({
  commandEditing: true,
  prefix: "-",
  providers: { default: "mongodb" }
});

bot.on('ready', () => {
  bot.user.setActivity("for -help", { type: "WATCHING" });
  bot.setDBL(new DBL(dbl, bot));

  let guilds = await client.shard.broadcastEval('this.guilds.size');
  bfd.postCount(guilds.reduce((a, b) => a + b, 0), "448527818855284756");
});

bot.login();

bot.on('commandRun', (message, command, args) =>
  console.log(`[COMMAND] ${command.name} in ${message.guild.name}`)
);

// BFD post count
bot.on('guildCreate', () => {
  let guilds = await client.shard.broadcastEval('this.guilds.size');
  bfd.postCount(guilds.reduce((a, b) => a + b, 0), "448527818855284756");
})

bot.on('guildDelete', () => {
  let guilds = await client.shard.broadcastEval('this.guilds.size');
  bfd.postCount(guilds.reduce((a, b) => a + b, 0), "448527818855284756");
})
