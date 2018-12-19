const { Command } = require('klasa');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ["pong", "latency"],
            description: "Check the bot's latency"
        });
    }
    async run(message) {
      let then = Date.now();
      let m = await message.channel.send(`<a:typing:517028426813538305> Pinging...`);
      let ping = Date.now() - then;
      m.edit(`<a:checkanimated:520306348613828609> Ping! \`${ping}\`ms`)
    }
};
