// const { MongoClient } = require('mongodb');
const { Client, Collection, Intents } = require('discord.js');
const mongoose = require('mongoose');
const fs = require('fs');
// const { Games, Tags, Players } = require('./Database/Mongoose');

global.EASTING = "e";
global.NORTHING = "n";
global.ELEVATION = "el";
global.BEARING = "bg";
global.DIST_2D = "dist_2d";
global.DIST_3D = "dist_3d";

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
// Add to the client.
// client.Database = require('./Database/Mongoose');
client.event = new Collection();
client.commands = new Collection();
const commandFiles = fs.readdirSync('./Commands').filter(file => file.endsWith('.js'));

// Get the environment variables.
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// We need this token to authenticate the bot.
const token = process.env.TOKEN;

// Create our commands.
for (const file of commandFiles) {
    const command = require(`./Commands/${file}`);
    // Set a new item in the collection
    // With the key as the command name and the value as the exported module.
    client.commands.set(command.data.name, command);
}


// Start it up!
async function init() {
    // Connect to Mongo DB
    // (formatted this way for readability, you can string substitute but it makes for a long line)
    const uri ="mongodb+srv://"
        + process.env.DB_USER
        + ":"
        + process.env.DB_PWORD
        + "@" + process.env.DB_CLUSTER
        + "."
        + process.env.DB_URL;

    mongoose
        .connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(() => console.log("Database connected my homie!"))
        .catch(err => console.log(err));

    // console.log(uri)

    // This is reserved for the welcome message...
    // client.once('ready', () => {
    //     // code stub
    // });

    // Get command interactions
    client.on('interactionCreate', async interaction => {
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    });

    // Get button interactions
    client.on('interactionCreate', interaction => {
        if (!interaction.isButton()) return;
        console.log(interaction);
    })

    // Execute login
    client.login(token)
}

init();

process.on('unhandledRejection', err =>{
    console.log('Unknown error occured:\n')
    console.log(err)
})
