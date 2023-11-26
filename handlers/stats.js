const Discord = require('discord.js');
const axios = require('axios').default;

module.exports.run = async (client, interaction) => {
  try {
    const player_name = interaction.options.getString('player_name');
    const account_type = interaction.options.getString('account_type');

    const auth_key = process.env.FNAPICOM

    const headers = {
      Authorization: auth_key,
    };

    const params = {
      name: player_name,
      accountType: account_type,
    };

    const { data } = await axios.get('https://fortnite-api.com/v2/stats/br/v2', {
      headers: headers,
      params: params,
    });

    if (!data || !data.data) {
      throw new Error('Invalid response from Fortnite API');
    }

    const { account, battlePass, stats } = data.data;

    if (account && battlePass && stats && stats.all) {
        const embed = new Discord.MessageEmbed()
          .setTitle(`${player_name}`)
          .setColor("RANDOM")
          .addField('**Battle Pass Stats**', `Level: ${battlePass.level}\nProgress: ${battlePass.progress}%`, false)
          .addField('\u200B', '\u200B\n\u200B', false) // Zero-width space for line break
          .addField('**Overall Stats**', `Wins: ${stats.all.overall.wins}\nKills: ${stats.all.overall.kills}\nK/D: ${stats.all.overall.kd}\nWin Rate: ${stats.all.overall.winRate}\n\nMatches: ${stats.all.overall.matches}\nTop 25: ${stats.all.overall.top25}\nTop 10: ${stats.all.overall.top10}\nTop 5: ${stats.all.overall.top5}\n\nPlayers Outlived: ${stats.all.overall.playersOutlived}\nTop 12: ${stats.all.overall.top12}\nTop 6: ${stats.all.overall.top6}\nTop 3: ${stats.all.overall.top3}`, false)
          .addField('\u200B', '\u200B\n\u200B', false) // Zero-width space for line break
          .addField('**Solo Stats**', `Wins: ${stats.all.solo.wins}\nKills: ${stats.all.solo.kills}\nK/D: ${stats.all.solo.kd}\nWin Rate: ${stats.all.solo.winRate}\n\nMatches: ${stats.all.solo.matches}\nPlayers Outlived: ${stats.all.solo.playersOutlived}\nScore: ${stats.all.solo.winRate}\nKills Per Match: ${stats.all.solo.killsPerMatch}`, false)
          .addField('\u200B', '\u200B\n\u200B', false) // Zero-width space for line break
          .addField('**Duo Stats**', `Wins: ${stats.all.duo.wins}\nKills: ${stats.all.duo.kills}\nK/D: ${stats.all.duo.kd}\nWin Rate: ${stats.all.duo.winRate}\n\nMatches: ${stats.all.duo.matches}\nPlayers Outlived: ${stats.all.duo.playersOutlived}\nScore: ${stats.all.duo.winRate}\nKills Per Match: ${stats.all.duo.killsPerMatch}`, false)
          .addField('\u200B', '\u200B\n\u200B', false) // Zero-width space for line break
          .addField('**Squad Stats**', `Wins: ${stats.all.squad.wins}\nKills: ${stats.all.squad.kills}\nK/D: ${stats.all.squad.kd}\nWin Rate: ${stats.all.squad.winRate}\n\nMatches: ${stats.all.squad.matches}\nPlayers Outlived: ${stats.all.squad.playersOutlived}\nScore: ${stats.all.squad.winRate}\nKills Per Match: ${stats.all.squad.killsPerMatch}`, false)
          .addField('\u200B', '\u200B\n\u200B', false) // Zero-width space for line break
          .addField('**Ltm Stats**', `Wins: ${stats.all.ltm.wins}\nKills: ${stats.all.ltm.kills}\nK/D: ${stats.all.ltm.kd}\nWin Rate: ${stats.all.ltm.winRate}\n\nMatches: ${stats.all.ltm.matches}\nPlayers Outlived: ${stats.all.ltm.playersOutlived}\nScore: ${stats.all.ltm.winRate}\nKills Per Match: ${stats.all.ltm.killsPerMatch}`, false)
          .setFooter(interaction.user.username, interaction.user.displayAvatarURL());
      
        interaction.reply({ embeds: [embed] });
      } else {
        interaction.reply({ content: 'Invalid player name or platform.' });
      }      
  } catch (error) {
    console.error(error);
    interaction.reply({ content: 'An error occurred, please try again later :)' });
  }
};
