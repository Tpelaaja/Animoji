const { Client } = require('klasa');
const DBL = require("dblapi.js");
const dbl = process.env.dbl;

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
});

bot.on('commandRun', (message, command, args) =>
  console.log(`[COMMAND] ${command.name} in ${message.guild.name}`)
);

bot.login();
