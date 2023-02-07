import {
  InjectDiscordClient,
  On,
  Once,
  UseGuards,
  UsePipes,
} from '@discord-nestjs/core';
import { Injectable, Logger } from '@nestjs/common';
import { Client, Message, TextChannel } from 'discord.js';
import { MessageToUpperPipe } from './pipes/message-to-upper.pipe';
import { MessageFromUserGuard } from './message-from-user.guard';
import { ConfigService } from '@nestjs/config';
import { callForNewData } from './get-latest-news';
const configService = new ConfigService();

@Injectable()
export class BotGateway {
  private readonly logger = new Logger(BotGateway.name);

  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
  ) {}

  @Once('ready')
  async onReady() {
    const textChannel = await this.client.channels.fetch(
      configService.get<string>('CHANNEL_ID_TWEETS'),
    );
    if (!textChannel) {
      return console.log('could not find channel or channels');
    }
    const interval = 5;
    await callForNewData(
      Date.now() - 1000 * (60 * interval),
      interval,
      textChannel as TextChannel,
      false,
    );
  }

  @On('messageCreate')
  @UseGuards(MessageFromUserGuard)
  @UsePipes(MessageToUpperPipe)
  async onMessage(message: Message): Promise<void> {
    this.logger.log(`Incoming message: ${message.content}`);
    if (message.content.includes('Yardım')) {
      await message.reply('response_for_the_yardim');
    }
    if (message.content.includes('Bilgi')) {
      await message.reply('response_for_the_bilgi');
    }
  }
}
