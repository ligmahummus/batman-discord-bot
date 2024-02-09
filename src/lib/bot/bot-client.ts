import fs from "fs";
import path from "path";
import {
  Client,
  Events,
  type ClientOptions,
  Collection,
  REST,
  Routes,
} from "discord.js";
import { clientLogger } from "../utils/util";
import { botConfig } from "./config";

export class Bot extends Client {
  // Discord.js client instance.
  public clientInstance: Client;
  private commands: any[] = [];

  constructor(options: ClientOptions) {
    super(options);

    // Initialize the client instance.
    this.clientInstance = new Client(options);
    this.clientInstance.login(botConfig.token); // Login to the client instance.

    // Set the commands collection to the client instance.
    (this.clientInstance as any).commands = new Collection();
    this.loadCommands();
    this.refreshRegisteredCommands();

    // Client event listeners as client is ready.
    this.clientInstance.on("ready", () => {
      clientLogger(`Logged in as ${this.clientInstance.user?.tag}!`);
    });

    /**
     * Event listener for client commands.
     */
    this.clientInstance.on(Events.InteractionCreate, async (interaction) => {
      if (!interaction.isChatInputCommand()) return;

      const command = (interaction.client as any).commands.get(
        interaction.commandName
      );

      if (!command) {
        clientLogger(
          `No command matching ${interaction.commandName} was found.`,
          "warn"
        );
        return;
      }

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: "There was an error while executing this command!",
            ephemeral: true,
          });
        } else {
          await interaction.reply({
            content: "There was an error while executing this command!",
            ephemeral: true,
          });
        }
      }
    });
  }

  /**
   * Event listener for when the client is ready.
   */
  private loadCommands() {
    const foldersPath = path.join(__dirname, "commands");
    const commandFolders = fs.readdirSync(foldersPath);

    for (const folder of commandFolders) {
      const commandsPath = path.join(foldersPath, folder);

      const commandFiles = fs
        .readdirSync(commandsPath)
        .filter((file) => file.endsWith(".js"));

      for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ("data" in command && "execute" in command) {
          (this.clientInstance as any).commands.set(command.data.name, command);
          this.commands.push(command.data.toJSON());
        } else {
          clientLogger(
            `The command at ${filePath} is missing a required "data" or "execute" property.`,
            "warn"
          );
        }
      }
    }
  }

  private async refreshRegisteredCommands() {
    // Construct and prepare an instance of the REST module
    const rest = new REST().setToken(botConfig.token);

    // and deploy your commands!
    try {
      clientLogger(
        `Started refreshing ${this.commands.length} application (/) commands.`
      );

      // The put method is used to fully refresh all commands in the guild with the current set
      const data = await rest.put(
        Routes.applicationGuildCommands(botConfig.clientId, botConfig.guildId),
        { body: this.commands }
      );

      clientLogger(
        `Successfully reloaded ${
          (data as any).length
        } application (/) commands.`
      );
    } catch (error) {
      // And of course, make sure you catch and log any errors!
      console.error(error);
    }
  }
}
