const { Task } = require('klasa');
const BFD = require("bfd-api");
const bfd = new BFD(process.env.bfd);

module.exports = class extends Task {

    constructor(...args) {
        super(...args, { name: 'post', enabled: true });
    }

    async run(client) {
      let guilds = await client.shard.broadcastEval('this.guilds.size');
      bfd.postCount(guilds.reduce((a, b) => a + b, 0), "448527818855284756");
    }
};
