const { Command, RichDisplay, util: { isFunction } } = require('klasa');
const { MessageEmbed, Permissions } = require('discord.js');
const PERMISSIONS_RICHDISPLAY = new Permissions([Permissions.FLAGS.MANAGE_MESSAGES, Permissions.FLAGS.ADD_REACTIONS]);
const time = 1000 * 60 * 3;

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
          aliases: ['commands', 'cmd', 'cmds'],
          guarded: true,
          description: (language) => language.get('COMMAND_HELP_DESCRIPTION'),
          usage: '(Command:command)'
        });
        this.createCustomResolver('command', (arg, possible, message) => {
          if (!arg || arg === '') return undefined;
          return this.client.arguments.get('command').run(arg, possible, message);
        });

        // Cache the handlers
        this.handlers = new Map();
    }

    async run(message, [command]) {
      if (command) {
        let desc = isFunction(command.description) ? command.description(message.language) : command.description;
        desc += "\n" + message.language.get('COMMAND_HELP_EXTENDED').replace(`Extended Help ::`, ``).replace(`No extended help provided.`, ``);
        let e = new MessageEmbed()
        .setTitle(`${command.name.capitalize()}`)
        .setDescription(desc)
        .setTimestamp()
        .setColor(process.env.theme)
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        return message.channel.send({embed: e})
      } else {
        if ((!('all' in message.flags) && message.guild && message.channel.permissionsFor(this.client.user).has(PERMISSIONS_RICHDISPLAY))) {
          // Finish the previous handler
          const previousHandler = this.handlers.get(message.author.id);
          if (previousHandler) previousHandler.stop();

          const handler = await (await this.buildDisplay(message)).run(await message.send('Loading Commands...'), {
            filter: (reaction, user) => user.id === message.author.id,
            time
          });
          handler.on('end', () => this.handlers.delete(message.author.id));
          this.handlers.set(message.author.id, handler);
          return handler;
        }
        return message.author.send(await this.buildHelp(message), { split: { char: '\n' } })
        .then(() => { if (message.channel.type !== 'dm') message.sendMessage(message.language.get('COMMAND_HELP_DM')); })
        .catch(() => { if (message.channel.type !== 'dm') message.sendMessage(message.language.get('COMMAND_HELP_NODM')); });
      }
    }

    async buildDisplay(message) {
      const commands = await this._fetchCommands(message);

      const { prefix } = message.guildSettings;
      const display = new RichDisplay();
      for (const [category, list] of commands) {
        display.addPage(new MessageEmbed()
          .setTitle(`${category} Commands`)
          .setColor(process.env.theme)
          .setDescription(list.map(this.formatCommand.bind(this, message, prefix, true)).join('\n'))
        );
      }
      return display;
    }
    async buildHelp(message) {
      const commands = await this._fetchCommands(message);
      const { prefix } = message.guildSettings;

      const helpMessage = [];
      for (const [category, list] of commands) {
        helpMessage.push(`**${category} Commands**:\n`, list.map(this.formatCommand.bind(this, message, prefix, false)).join('\n'), '');
      }

      return helpMessage.join('\n');
    }

    async _fetchCommands(message) {
      const run = this.client.inhibitors.run.bind(this.client.inhibitors, message);
      const commands = new Map();
      await Promise.all(this.client.commands.map((command) => run(command, true)
        .then(() => {
          const category = commands.get(command.category);
          if (command.category !== "Admin" && command.category !== "General" && category) category.push(command);
          else if (command.category !== "Admin" && command.category !== "General") commands.set(command.category, [command]);
        }).catch(() => {
          // noop
        })
      ));

      return commands;
    }

    formatCommand(message, prefix, richDisplay, command) {
      const description = isFunction(command.description) ? command.description(message.language) : command.description;
      return richDisplay ? `■ \`${prefix}${command.name}\` : ${description}` : `■ **\`${prefix}${command.name}\`** : ${description}`;
    }
};
