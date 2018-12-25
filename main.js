require('dotenv').config();

const { Client } = require('klasa');
const DBL = require("dblapi.js");
const dbl = process.env.dbl;

class client extends Client {
  setDBL(dbl) {this.dbl = dbl;}
};

const bot = new client({
  commandEditing: true,
  prefix: "-",
  providers: { default: "mongodb" },
  disabledCorePieces: ["commands"]
});
/*
bot.on('ready', async () => {
  bot.user.setActivity("for -help", { type: "WATCHING" });
  bot.setDBL(new DBL(dbl, bot));
});


bot.on('commandRun', (message, command, args) =>
  console.log(`[COMMAND] ${command.name} in ${message.guild.name}`)
);

// BFD post count
bot.on('guildCreate', async () => {
  bot.tasks.find(task => task.name === "post").run(bot)
})

bot.on('guildDelete', async () => {
  bot.tasks.find(task => task.name === "post").run(bot)
})
*/
bot.login();
