const Discord = require("discord.js");
const client = new Discord.Client({
    fetchAllMembers: true,
    disableEveryone: true,
    sync: true,
    messageCacheMaxSize: 100,
    messageCacheLifetime: 240,
    messageSweepInterval: 300
});

const { version } = require("discord.js");

const instance = require("./package.json");
const settings = require("./config.js");

const statusObject = {
    online: "online",
    idle: "idle",
    dnd: "dnd",
    offline: "invisible"
};

client.on("ready", () => {
    console.log("==[Launching Instance]==");
    console.log(`Username: ${client.user.username}`);
    console.log(`ID: ${client.user.id}`);
    console.log(`Prefix: ${settings.prefix}`);
    console.log(`Version: ${instance.version}`);
    console.log(`Library Version: ${version}`);
    console.log(`Guilds: ${client.guilds.size}`);
    console.log(`Channels: ${client.channels.size}`);
    console.log(`Users: ${client.users.size}`);
    console.warn("[NOTICE]: Do not share your bot token with anyone.");
    console.log("Successfully connected to the WebSocket, the bot is now online.");
});

client.on("resume", () => {
    console.log("Successfully resumed the WebSocket connection.");
});

client.on("reconnecting", () => {
    console.log("Currently reconnecting to the WebSocket.");
});

client.on("disconnect", () => {
    console.log("Disconnected from the WebSocket, attempting to reconnect.");
});

client.on("rateLimit", () => {
    console.warn("You are being ratelimited.");
});

client.on("guildMemberAdd", (member) => {
    const channel = member.guild.channels.find(ch => ch.name === "meet-and-greet");
    if (!channel) return;
    channel.send(`**${member.user.username}** has just joined.`);

    const role = member.guild.roles.find(r => r.name === "Supporter");
    if (!role) return;
    setTimeout(() => member.addRole(joinRole), 600000);
});

client.on("guildMemberRemove", (member) => {
    const channel = member.guild.channels.find(ch => ch.name === "meet-and-greet");
    if (!channel) return;
    channel.send(`**${member.user.username}** has just left.`);
});

client.on("message", async (message) => {
    if (message.channel.type === "dm") return;
    if (message.author.bot) return;
    if (message.content.indexOf(settings.prefix) !== 0) return;

    const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (command === "ping") {
        const embed = new Discord.RichEmbed()
        embed.setTitle("Pong!");
        embed.addField("Bot Latency", `${Date.now() - message.createdTimestamp()} milliseconds`);
        embed.addField("API Latency", `${Math.round(client.ping)} milliseconds`);
        embed.addField("Shard Latency", `${Math.round(client.ping)} milliseconds`);
        embed.setColor("BLACK");
        message.channel.send({embed});
    }

    if (command === "help") {
        message.channel.send(`Command documentation can be found at: https://docs.damianfreeman.cf`);
    }

    if (command === "warn") {
        if (message.member.roles.some(r => ["Alaina", "The Kid Upstairs", "Deputy Moderator", "Moderator"].includes(r.name)) ) return message.reply("You don't have the required role to execute this command.");

        const member = message.mentions.members.first();
        if (!member) return message.reply("Please specify a member.");

        const dataWarn = args.join(" ");
        if (!dataWarn) return message.reply("Please specify a reason.");

        const channel = message.guild.channels.find(ch => ch.name === "mod-log");
        if (!channel) return;

        const embed = new Discord.RichEmbed()
        embed.setTitle("Warning");
        embed.addField("Targeted User", `${member.user.username}`);
        embed.addField("Possible Moderator", `${message.author.username}`);
        embed.addField("Reason", `${dataWarn}`);
        embed.setColor("YELLOW");
        channel.send({embed});

        await message.channel.send(`***${member.user.username} has been warned.***`);
        await member.user.send(`You have been warned on Artifex Kingdom for: ${dataWarn}`);
    }

    if (command === "kick") {
        if (message.member.roles.some(r => ["Alaina", "The Kid Upstairs", "Deputy Moderator", "Moderator"].includes(r.name)) ) return message.reply("You don't have the required role to execute this command.");

        const member = message.mentions.members.first();
        if (!member) return message.reply("Please specify a member.");

        if (!member.kickable) return message.reply("I am unable to kick this user.");

        const dataKick = args.join(" ");
        if (!dataKick) return message.reply("Please specify a reason.");

        const channel = message.guild.channels.find(ch => ch.name === "mod-log");
        if (!channel) return;

        const embed = new Discord.RichEmbed()
        embed.setTitle("Kick");
        embed.addField("Targeted User", `${member.user.username}`);
        embed.addField("Possible Moderator", `${message.author.username}`);
        embed.addField("Reason", `${dataKick}`);
        embed.setColor("ORANGE");
        channel.send({embed});

        await message.channel.send(`***${member.user.username} has been kicked.***`);
        await member.kick(dataKick);
    }

    if (command === "ban") {
        if (message.member.roles.some(r => ["Alaina", "The Kid Upstairs", "Deputy Moderator", "Moderator"].includes(r.name)) ) return message.reply("You don't have the required role to execute this command.");

        const member = message.mentions.members.first();
        if (!member) return message.reply("Please specify a member.");

        if (!member.bannable) return message.reply("I am unable to ban this user.");

        const dataBan = args.join(" ");
        if (!dataBan) return message.reply("Please specify a reason.");

        const channel = message.guild.channels.find(ch => ch.name === "mod-log");
        if (!channel) return;

        const embed = new Discord.RichEmbed()
        embed.setTitle("Ban");
        embed.addField("Targeted User", `${member.user.username}`);
        embed.addField("Possible Moderator", `${message.author.username}`);
        embed.addField("Reason", `${dataBan}`);
        embed.setColor("RED");
        channel.send({embed});

        await message.channel.send(`***${member.user.username} has been banned.***`);
        await member.ban(dataBan);
    }

    if (command === "reboot") {
        if (message.member.roles.some(r => ["Alaina", "The Kid Upstairs", "Deputy Moderator"].includes(r.name)) ) return message.reply("You don't have the required role to execute this command.");

        message.channel.send("Rebooting...");
        await process.exit(1);
    }
});

client.login(settings.token);

const http = require('http');
const express = require('express');
const app = express();
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 10000);