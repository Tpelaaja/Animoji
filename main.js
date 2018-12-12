require('dotenv').config();

const MongoClient = require('mongodb').MongoClient;
const path = require('path');
const MongoDBProvider = require('commando-provider-mongo');
const { MessageEmbed } = require('discord.js');
var fs = require('fs');
const sqlite = require('sqlite');
let TOKEN = process.env.TOKEN;

const { CommandoClient, SQLiteProvider } = require('discord.js-commando');
const Client = require('./client.js');
const DBL = require("dblapi.js");

const client = new Client({
	commandPrefix: "-",
	owner: ["297403616468140032"],
	unknownCommandResponse: false
});

client.registry
	.registerDefaultTypes()
	.registerTypesIn(path.join(__dirname, 'types'))
	.registerGroups([
		['util', 'Utility'],
		['em', 'Emoji'],
    ['commands', 'Command Manager']
	])
	.registerDefaultCommands({help: false,ping: false})
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.on('ready', () => {
  client.user.setActivity("for -help", { type: "WATCHING" });
  console.log('--------------------------------------');
  console.log('Name    : ' + client.user.username + '#' + client.user.discriminator);
  console.log('ID      : ' + client.user.id);
  console.log('Servers : ' + client.guilds.size);
  console.log('Users   : ' + client.users.size);
  console.log('-------------------------------------');
});

client.on('disconnect', event => {
	console.error(`[DISCONNECT] Disconnected with code ${event.code}.\n[REASON]: ${event.reason}`);
	process.exit(0);
});

client.on('commandRun', (command, p, m) => console.log(`[COMMAND] Ran command ${command.groupID}:${command.memberName}. (${m.guild})`));

client.on('error', err => console.error('[ERROR]', err));

client.on('warn', err => console.warn('[WARNING]', err));

client.on('commandError', (command, err) => console.error('[COMMAND ERROR]', command.name, err));

client.login(TOKEN);

process.on('unhandledRejection', err => {
	console.error('[FATAL] Unhandled Promise Rejection.', err);
	process.exit(1);
});
