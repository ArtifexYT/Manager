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

client.on("guildMemberAdd", (member) => {
    const channel = member.guild.channels.find(ch => ch.name === "meet-and-greet");
    if (!channel) return;
    channel.send(`**${member.user.username}** has just joined.`);

    const role = member.guild.roles.find(r => r.name === "Supporter");
    if (!role) return;
    member.addRole(role);
});

client.on("guildMemberRemove", (member) => {
    const channel = member.guild.channels.find(ch => ch.name === "meet-and-greet");
    if (!channel) return;
    channel.send(`**${member.user.username}** has just left.`);
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
