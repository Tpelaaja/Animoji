require('dotenv').config();

const { Client } = require('klasa');

const bot = new Client({
  commandEditing: true,
  prefix: "-",
  providers: { default: "mongodb" },
  disabledCorePieces: ["commands"]
});

bot.on('ready', async () => {
  bot.user.setActivity("for -help", { type: "WATCHING" });
});


bot.on('commandRun', (message, command, args) =>
  console.log(`[COMMAND] ${command.name} in ${message.guild.name}`)
);

bot.login();
