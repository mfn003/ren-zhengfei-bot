const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

const data = new SlashCommandBuilder()
  .setName("birdfact")
  .setDescription("Sends a random bird fact!");

async function execute(client, interaction, subinteraction, config) {
  async function get_bfact_interaction() {
    const row = new MessageActionRow();
    row.addComponents(
      new MessageButton()
        .setCustomId("newbfact")
        .setLabel("I want another one!")
        .setStyle(1)
        .setEmoji("🐦")
    );
    row.addComponents(
      new MessageButton()
        .setCustomId("delete")
        .setLabel("Delete")
        .setStyle(4)
        .setEmoji("🗑️")
    );
    var response = await config.request("GET", "https://some-random-api.ml/facts/bird");
    var response = await response.json();
    var bfact_url = response.fact;
    var bfactEmbed = new MessageEmbed()
      .setColor(config.color)
      .setTitle("Here's a random bird fact!")
      .setDescription(bfact_url)
      .setTimestamp()
      .setFooter({ text: "Powered by some-random-api.ml" });
    return { embeds: [bfactEmbed], components: [row] };
  }
  if (interaction.isButton()) {
    if (interaction.user.id !== subinteraction.user.id) {
      return;
    }
    if (interaction.customId === "delete") {
      return await interaction.message.delete();
    } else if (interaction.customId === "newbfact") {
      await interaction.message.edit(await get_bfact_interaction());
      return await interaction.deferUpdate();
    }
  }
    if (interaction.channel.id !== config.animal_images_channel) {
        
        await interaction.reply({ content: `This command can only be used in <#${config.animal_images_channel}>`, ephemeral: true });
        
      return;
    }
  await interaction.reply(await get_bfact_interaction());
}

module.exports = {
  data,
  execute,
};
