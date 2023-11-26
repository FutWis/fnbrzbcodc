const Discord = require("discord.js");
const axios = require("axios");
const chalk = require("chalk");

module.exports.run = async (client, interaction) => {
  try {
    const gamemode = await interaction.options.getString("gamemode");

    let embed;

    // Check the gamemode and adjust the title and description accordingly
    if (gamemode.toLowerCase() === "stw") {
      embed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setTitle("Fortnite News for STW")
        .setDescription("Commanders, we've moved the Save The World message of the day to appear when you first log into Fortnite!")
        .setImage("attachment://stw.jpg")
        .setFooter(client.user.username, client.user.displayAvatarURL());

      interaction.reply({
        embeds: [embed],
        files: [{ attachment: "./assets/stw.jpg", name: "stw.jpg" }],
      });

      return; // Return early to avoid making unnecessary API calls
    }

    // For other gamemodes, use the Fortnite API
    const response = await axios.get(`https://fortnite-api.com/v2/news/${gamemode}`);

    if (response.status !== 200) {
      throw new Error(`Request failed with status code ${response.status}`);
    }

    const data = response.data.data;

    if (!data || !data.image) {
      throw new Error("Invalid response data from Fortnite API");
    }

    embed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setTitle(`Fortnite News for ${gamemode.toUpperCase()}`)
      .setDescription(gamemode.toLowerCase() === "br" ? "Get the latest news for Battle Royale!" : "Custom description for other gamemodes if needed")
      .setImage(data.image)
      .setFooter(client.user.username, client.user.displayAvatarURL());

    interaction.reply({
      embeds: [embed],
    });
  } catch (error) {
    console.error(chalk.red("Error in Fortnite News command:", error.message));
    interaction.reply({
      content: "An error occurred! Please try again later :)",
    });
  }
};