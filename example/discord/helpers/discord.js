const { Client, Events, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js')
const { shortenString } = require('../../../runner/helpers/sanitize')

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
    ]
})

module.exports = {
    init: (cb) => {
        client.login(process.env.DISCORD_TOKEN)

        client.once(Events.ClientReady, () => {
            cb()
        })
    },

    createButtons: ({
        link
    }) => {
        const row = new ActionRowBuilder()

        .addComponents(
            new ButtonBuilder()
                .setLabel('View Transaction')
                .setStyle('Link')
                .setURL(link),

            new ButtonBuilder()
                .setLabel('Manage Subscriptions')
                .setStyle('Link')
                .setURL('https://arco-three.vercel.app/')
        )

        return row
    },

    createEmbed: ({
        title,
        description,
        color,
        txId,
        fees
    }) => {
        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor(color)
            .setAuthor({ name: 'arco | Real-time Algorand Notifications', url: 'https://arco-three.vercel.app' })
            .addFields(
                { name: 'Transaction ID:', value: `[${shortenString(txId, 8)}](https://algoexplorer.io/tx/${txId})`, inline: true },
                { name: 'Fees', value: `${fees} ALGO`, inline: true }
            )

        return embed
    },

    createMessage: async ({
        id,
        content
    }) => {
        return await client.users.send(id, content).catch((err) => {
            console.log(err)
        })
    },

    getClient: () => {
        return client
    }
}