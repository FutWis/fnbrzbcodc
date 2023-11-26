const Discord = require("discord.js");
const client = new Discord.Client({
    intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS"],
});

require("dotenv").config();
const express = require("express");
const app = express();
const chalk = require("chalk");
const fs = require("fs"); // Use fs/promises for modern async file operations.
const PORT = 8080
const { createCanvas, loadImage } = require("canvas");
const axios = require("axios");
const moment = require("moment");
const date = moment().format("dddd, MMMM Do YYYY");
const cron = require("node-cron");

client.login(process.env.TOKEN);

const sendFortniteNews = async (channel, gamemode) => {
    try {
        let embed;

        if (gamemode.toLowerCase() === "stw") {
            embed = new Discord.MessageEmbed()
                .setColor("RANDOM")
                .setTitle("Fortnite News for STW")
                .setDescription("Commanders, we've moved the Save The World message of the day to appear when you first log into Fortnite!")
                .setImage("attachment://stw.jpg")
                .setFooter(client.user.username, client.user.displayAvatarURL());

            return embed; // Return the embed for later use
        } else {
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
                .setDescription(gamemode.toLowerCase() === "br" ? "Get the latest news for Battle Royale!" : `Custom description for ${gamemode} if needed`)
                .setImage(data.image)
                .setFooter(client.user.username, client.user.displayAvatarURL());

            return embed; // Return the embed for later use
        }
    } catch (error) {
        console.error(chalk.red("Error sending Fortnite News:", error.message));
    }
};
  
  cron.schedule("0 1 * * *", async () => {
    try {
      const channelId = "1177972156110483466"; // Replace with your actual channel ID
      const channel = await client.channels.fetch(channelId);
  
      if (!channel) {
        console.error("Channel not found!");
        return;
      }
  
      console.log("Found channel: ", channel.name);
  
      // Mention everyone and notify that news has been updated
      const notificationContent = `@everyone News updated for ${date}`;
      
      // Send both BR and STW news and store the embeds
      const brNewsEmbed = await sendFortniteNews(channel, "br");
      const stwNewsEmbed = await sendFortniteNews(channel, "stw");
  
      // Combine the mention, notification message, and embeds
      await channel.send({
        content: notificationContent,
        embeds: [brNewsEmbed, stwNewsEmbed],
        files: [{ attachment: "./assets/stw.jpg", name: "stw.jpg" }],
      });
  
    } catch (e) {
      console.error("Error in cron job:", e);
    }
  });
