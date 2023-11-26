const Discord = require("discord.js");
const axios = require("axios").default;
const builder = require('@discordjs/builders');

module.exports.run = async (client, interaction) => {
    try {
        const req = await axios.get("https://fortniteapi.io/v3/challenges", {
            params: {
                lang: "en",
            },
            headers: {
                Authorization: process.env.FNAPIIO,
            },
        });

        if (req.status === 200) {
            const challenges = req.data.bundles[0].bundles[0].quests;

            if (challenges.length) {
                const embed = new Discord.MessageEmbed()
                    .setColor("RANDOM")
                    .setTitle(`Showing Challenges for Fornite`);

                challenges.forEach((challenge) => {
                    const description = challenge.description ? challenge.description : "No description available";
                    embed.addField(
                        `${challenge.name}`,
                        `Description: ${description}\n\n\n\n\n\n`, // add two "\n" for an empty line
                    );
                });

                return interaction.reply({ embeds: [embed] });
            } else {
                return interaction.reply({
                    embeds: [
                        new Discord.MessageEmbed()
                            .setTitle("No Challenges Found")
                            .setColor("RED")
                            .setDescription("There are currently no challenges available."),
                    ],
                });
            }
        } else {
            throw new Error("Non-200 status code from Fortnite API");
        }
    } catch (error) {
        console.error(error);

        return interaction.reply({
            embeds: [
                new Discord.MessageEmbed()
                    .setColor("RED")
                    .setTitle("API ERROR. Please try again later."),
            ],
        });
    }
};