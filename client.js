const { CommandoClient, SQLiteProvider } = require('discord.js-commando');

class Client extends CommandoClient {
  setDBL(dbl) {
    this.dbl = dbl;
  }
};

module.exports = Client;