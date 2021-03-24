require('dotenv').config();

const moment = require('moment');
const fs = require('fs');
const Discord = require('discord.js');
let settings;

if (fs.existsSync('settings.json')) {
	settings = JSON.parse(fs.readFileSync('settings.json'));
} else {
	settings = {
		hour: 10,
		hourBig: 15,
		reminder: 'Take meth',
		reminderBig: 'Take croc',
		intervalBig: 20,
	};
}

const client = new Discord.Client();

client.on('ready', async () => {
	console.log('Running Drug Cartel...');
	const owner = (await client.users.fetch('171594634605232128'));
	owner.send('Drug bot has either rebooted or just started xo');
	reminder();
});

setInterval(reminder, 1*60*1000);

async function reminder() {
	const curr = moment();
	const owner = (await client.users.fetch('171594634605232128'));

	let nextBig;

	if (fs.existsSync('nextBig')) {
		nextBig = moment(fs.readFileSync('nextBig', 'utf-8').toString());
	} else {
		nextBig = moment().startOf('day').days(settings.intervalBig);
		fs.writeFileSync('nextBig', nextBig.toISOString());
	}

	if (curr.hours() === settings.hour && curr.minutes() === 0) {
		owner.send(settings.reminder);
	}

	if (curr.isAfter(nextBig) && curr.hours() === settings.hourBig && curr.minutes() === 0) {
		owner.send(settings.reminderBig);
		nextBig = moment().startOf('day').days(settings.intervalBig);
		fs.writeFileSync('nextBig', nextBig.toISOString());
	}
}

// This is what the bot will be playing of streaming and what will show up on console when being launched
client.on("ready", () => {
    client.user.setPresence({
        status: "online",
        game: {
            name: "Selling drugs",
            type: "PLAYING"
        }
    }); 
})


client.login(process.env.token);