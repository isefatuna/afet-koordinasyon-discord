import { DiscordModule } from '@discord-nestjs/core';
import { Module } from '@nestjs/common';
import { BotGateway } from './bot.gateway';
import { InfoCommand } from './commands/info.command';

@Module({
  imports: [DiscordModule.forFeature()],
  providers: [InfoCommand, BotGateway],
})
export class BotModule {}