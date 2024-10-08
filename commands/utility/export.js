const { SlashCommandBuilder } = require('discord.js');
const { ChannelType,AttachmentBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('export')
		.setDescription('Export the statistic of a user')
        .addUserOption((option) =>
            option
              .setName('user')
              .setDescription('user name')
              .setRequired(true),
          ),
	async execute(interaction, SQLpool) {
        // console.log(interaction.user.name)
        
        // console.log(interaction);
		let channel = interaction.channel;
        let guildId = channel.guildId;
        let id = interaction.id;
        let user = interaction.options.getUser('user');
        let userId = user.id;
        // let relative_path_wav = `../../tmp/export/${id}.json`;
        SQLpool.query(`SELECT * FROM voice_table WHERE guildId='${guildId}' AND userId='${userId}';`, function (error, results, fields) {
            if(results.length == 0){
                interaction.reply(`No data for user ${user}!`);
                return;
            }
            /*exp = JSON.stringify(results);
            fs.writeFileSync(path.resolve(__dirname, relative_path_wav), exp, function(err) {
                if (err) {
                    console.log(err);
                }
                fs.unlink(path.resolve(__dirname, relative_path_wav),(err) => {
                    if (err) {
                        console.error('Error deleting file:', err);
                        return;
                    }
                });
            });*/
            // console.log(JSON.stringify(results))
            const jsonFile = new AttachmentBuilder(Buffer.from(JSON.stringify(results)), {
                name: "data.json",
            });
            interaction.reply({content: `Here is the statistic file for ${user}:\n`, files: [jsonFile] })
        })
	},
};