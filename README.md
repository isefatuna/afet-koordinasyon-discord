# afet-koordinasyon-discord

## Features

- Get latest tweets from the epctex
- Extract lat,lng with OpenAI

## Tech

- [NestJS]
- [OpenAI]

## Environment Variables

You should update env variables to run bot with your discord channel

DISCORD_API_TOKEN=
GUILD_ID_WITH_COMMANDS=
CHANNEL_ID_TWEETS=
OPEN_AI_API_KEY=

## Installation and Running

this project requires [Node.js](https://nodejs.org/) v14+ to run.

If you don't have nest cli globally you should run:

```sh
npm i -g @nestjs/cli
```

Install the dependencies and devDependencies and start the discord bot.

For Local environment:

```sh
npm install
nest start --watch
```

## Lat , Lng analysis with OpenAI

Once you run the project bot will be analyze lat/lng values from the tweet text to detect location in the map.

## Auto Answer Mechanism

Bot detects some keywords from the user messages. For example you can use those words and test it with any text channel

- bilgi
- yardım
