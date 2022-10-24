const axios = require('axios');
const { Client, ActivityType, GatewayIntentBits } = require('discord.js');

const { token, interval } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const sym = {
    up:     "↗",
    down:   "↘"
};

client.on('ready', async (client) => {
    console.log("Logged in");
});

client.login(token);

const changeNick = async (nick) => {
    let guilds = await client.guilds.fetch();
    guilds.forEach(async (guild, key) => {
        console.log(`Changing nickname for: ${guild.name}`);
        let cGuild = await client.guilds.fetch(guild.id);
        await cGuild.members.me.setNickname(nick);
        // console.log({cGuild, me: cGuild.members.me});
    });
};

setInterval(async () => {
    console.log("Getting $APT price...");

    let res = await axios.get("https://api.coingecko.com/api/v3/simple/price", {
        params: {
            ids: "aptos",
            vs_currencies: "usd",
            include_24hr_change: true
        }
    }).then(res => res.data).catch(err => {
        console.log({err});
        throw err;
    });

    let aptos = res.aptos;
    let price = aptos.usd;
    let change = aptos.usd_24h_change;
    let username = `$${price} (${change > 0 ? sym.up : sym.down})`;
    let activity = `24h: ${change.toFixed(3)}%`;
    changeNick(username);
    client.user.setActivity(activity, { type:  ActivityType.Watching});
}, interval);