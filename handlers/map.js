const Discord = require("discord.js");
const axios = require("axios");
const chalk = require("chalk");

module.exports.run = async (client, interaction) => {
  try {
    const response = await axios.get("https://fortnite-api.com/v1/map");

    if (response.status !== 200) {
      throw new Error(`Request failed with status code ${response.status}`);
    }

    const data = response.data.data;

    if (!data || !data.images || !data.images.pois) {
      throw new Error("Invalid response data from Fortnite API");
    }

    // Append a timestamp to the URL to prevent caching
    const imageUrl = `${data.images.pois}?timestamp=${Date.now()}`;

    const embed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setTitle("Fortnite Map")
      .setImage(imageUrl)
      .setFooter(client.user.username, client.user.displayAvatarURL());

    interaction.reply({ embeds: [embed] });
  } catch (error) {
    console.error(chalk.red("Error in Fortnite Map command:", error.message));
    interaction.reply({
      content: "An error occurred! Please try again later :)",
    });
  }
};
