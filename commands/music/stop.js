const Discord = require('discord.js');

const Welcome = require('../../database/models/Welcome');


module.exports = {
    name: 'stop',
    description: 'Arrete la musique et fait quitter le bot',
    cat: 'music',
    aliases: ["leave"],
    botpermissions: ['CONNECT', 'SPEAK'],

    async execute(message, args) {

        if (message.guild.settings.dj_system) {
            if (!message.member.permissions.has("MANAGE_MESSAGES")) {
                let MissingRole = await message.translate("MISSING_ROLE");
                let Missingperm = await message.translate("MISSING_PERMISSIONS");
                let role = message.guild.roles.cache.get(message.guild.settings.dj_system)
                if (!role) return message.errorMessage(Missingperm.replace("{perm}", 'MANAGE_MESSAGES'))
                if (message.member.roles.cache) {
                    if (!message.member.roles.cache.has(role.id)) {
                        return message.errorMessage(MissingRole.replace("{perm}", 'MANAGE_MESSAGES').replace("{role}", role.name))
                    }
                } else {
                    return message.errorMessage(MissingRole.replace("{perm}", 'MANAGE_MESSAGES').replace("{role}", role.name))
                }
            }
        }

        const voice = message.member.voice.channel;
        if (!voice) {
            let err = await message.translate("NOT_VOC")
            return message.errorMessage(err)
        }
        if (!message.client.player.getQueue(message.guild.id) || !message.client.player.getQueue(message.guild.id).playing) {
            let err = await message.translate("NOT_MUSIC")
            return message.errorMessage(err)

        }
        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) {
            let err = await message.translate("NOT_SAME_CHANNEL")
            return message.errorMessage(err);
        }
        const queue = message.client.player.getQueue(message.guild.id);
        if (queue.metadata) queue.metadata.guild.stopped = true
        queue.destroy();
        message.client.player.deleteQueue(message.guild.id)

        let a = await message.translate("STOP")
        message.channel.send(a)





    },
};