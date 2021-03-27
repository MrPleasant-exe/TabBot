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
		reminder: 'Take Meds',
		reminderBig: 'Renew Meds',
		intervalBig: 20,
	};
}

const client = new Discord.Client();

client.on('ready', async () => {
	console.log('Running Drug Cartel...');
	const client = (await client.users.fetch('ID'));
	client.send('Drug bot has either rebooted or just started xo');
	reminder();
});

setInterval(reminder, 1*60*1000);

async function reminder() {
	const curr = moment();
	const client = (await client.users.fetch('ID'));

	let nextBig;

	if (fs.existsSync('nextBig')) {
		nextBig = moment(fs.readFileSync('nextBig', 'utf-8').toString());
	} else {
		nextBig = moment().startOf('day').days(settings.intervalBig);
		fs.writeFileSync('nextBig', nextBig.toISOString());
	}

	if (curr.hours() === settings.hour && curr.minutes() === 0) {
		client.send(settings.reminder);
	}

	if (curr.isAfter(nextBig) && curr.hours() === settings.hourBig && curr.minutes() === 0) {
		client.send(settings.reminderBig);
		nextBig = moment().startOf('day').days(settings.intervalBig);
		fs.writeFileSync('nextBig', nextBig.toISOString());
	}
}


client.login(process.env.token);