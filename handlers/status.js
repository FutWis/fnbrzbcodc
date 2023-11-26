const Discord = require("discord.js");

module.exports.run = async (client, interaction) => {
  try {
    const embed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setTitle("Bot Status")
      .setDescription("Bot is up, check our status at https://app.pulsetic.com/status/Aqygioui");

    interaction.reply({ embeds: [embed] });
  } catch (error) {
    console.error(error);
    interaction.reply({ content: "An error occurred, please try again later :)" });
  }
};
