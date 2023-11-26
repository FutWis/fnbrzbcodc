require("dotenv").config();
const Discord = require("discord.js");
const axios = require("axios");
const express = require("express");
const app = express();
const chalk = require("chalk");
const fs = require("fs/promises"); // Use fs/promises for modern async file operations.
const PORT = 8080

const client = new Discord.Client({
  intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS"],
});

async function loadSlashCommands(client) {
  const jsondir = "slash-json";
  const cmds = await client.application.commands.fetch();
  const existingCommands = cmds.map((cmd) => cmd.name);

  for (const fileName of await fs.readdir(jsondir)) {
    const fileContent = require(`./${jsondir}/${fileName}`);
    client.commands.set(fileName.split(".")[0], fileContent);
    console.log(chalk.bold.green(`Loaded command ${fileName}`));

    if (existingCommands.includes(fileContent.name)) {
      console.log(chalk.bold.red(`Command ${fileContent.name} already exists!`));
    } else {
      try {
        const da = await client.application.commands.create(fileContent);
        console.log(chalk.green.bold(`Registered ${da.name} | ${da.id}`));
      } catch (error) {
        console.error(error);
      }
    }
  }
}

async function loadHandlers(client) {
  const cmdDir = "handlers";
  for (const fileName of await fs.readdir(cmdDir)) {
    const fileContent = require(`./${cmdDir}/${fileName}`);
    client.handlers.set(fileName.split(".")[0], fileContent);
    console.log(chalk.bold.green(`Loaded handler ${fileName}`));
  }
}

client.once("ready", async () => {
  console.log(chalk.bold.green(`Discord Bot ${client.user.tag} is online!`));
  console.log("Developer - XottikMW");
  client.user.setPresence({ activities: [{ name: "FNBRZBCO" }] });
  client.commands = new Discord.Collection();
  client.handlers = new Discord.Collection();

  try {
    await loadSlashCommands(client);
    await loadHandlers(client);
  } catch (error) {
    console.error("Error during initialization:", error);
  }
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isCommand()) {
    const cmd = client.handlers.get(interaction.commandName);
    if (cmd) {
      await cmd.run(client, interaction);
      console.log(chalk.gray(`Executed command ${interaction.commandName} | ${interaction.guildId} | ${interaction.user.id}`));
    } else {
      interaction.reply({ content: "Command not found!" });
    }
  }
});

const { MessageEmbed } = require("discord.js");

client.on("messageCreate", async (message) => {
  if (message.author.bot) return; // Ignore messages from bots

  const botMention = `<@${client.user.id}>`;

  // Check if the message content includes a mention of the bot
  if (message.content.includes(botMention)) {
    // Create an embed
    const embed = new MessageEmbed()
      .setColor("BLUE")
      .setTitle("FNBRZBCO Mention Message!")
      .setThumbnail(client.user.displayAvatarURL())
      .setDescription("Hi, I'm up, but you can't reach me from here. Use my / commands instead!")
      .setFooter(client.user.username, client.user.displayAvatarURL());
    // Respond with the embed
    await message.reply({ embeds: [embed] });
    
    console.log(chalk.gray(`Responded to @FNBRZBCO#0985 mention | Guild: | ${message.guild.name} | ${message.guild.id} | User: | ${message.author.username} | ${message.author.id}`));
  }
});

client.login(process.env.TOKEN);