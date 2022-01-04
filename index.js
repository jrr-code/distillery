const { MongoClient } = require('mongodb');
const { Client, Collection, Intents } = require('discord.js');
const mongoose = require('mongoose');
const fs = require('fs');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
// Add to the client.
// client.Database = require('./Database/Mongoose');
client.event = new Collection();
client.commands = new Collection();
const commandFiles = fs.readdirSync('./Commands').filter(file => file.endsWith('.js'));


if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const token = process.env.TOKEN;

for (const file of commandFiles) {
    const command = require(`./distillery/Commands/${file}`);
    // Set a new item in the collection
    // With the key as the command name and the value as the exported module.
    client.commands.set(command.data.name, command);
}


async function init() {
    // alpha
    const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWORD}@${process.env.DB_CLUSTER}.${process.env.DB_URL}`;

    mongoose
        .connect(uri, {
            // .connect(process.env.MONGO_PROD_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(() => console.log("Database connected!"))
        .catch(err => console.log(err));

// beta
    const Tags = mongoose.model("Tags", new mongoose.Schema({
        name: {
            type: String,
            unique: true
        },
        description: {
            type: String
        },
        username: {
            type: String,
        },
        usage_count: {
            type: Number,
            get: v => Math.round(v),
            set: v => Math.round(v),
            default: 0,
            required: true
        }
    }))


    client.once('ready', () => {
        //gamma
    });

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

    client.on('interactionCreate', interaction => {
        if (!interaction.isButton()) return;
        console.log(interaction);
    })

    client.login(token)
}

init();

process.on('unhandledRejection', err =>{
    console.log('Unknown error occured:\n')
    console.log(err)
})
