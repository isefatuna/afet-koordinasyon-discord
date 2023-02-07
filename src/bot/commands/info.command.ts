import { Command, DiscordCommand } from '@discord-nestjs/core';
import { ContextMenuCommandInteraction } from 'discord.js';

const whiteListedUsers = ['340910298359791616', '3409102983597916160'];
@Command({
  name: 'bilgi',
  description: 'Enkazda kalan insanların harita konum bilgileri',
})
export class InfoCommand implements DiscordCommand {
  async handler(interaction: ContextMenuCommandInteraction): Promise<string> {
    if (whiteListedUsers.includes(interaction.user.id)) {
      return 'return_map_info';
    } else {
      return 'Permission Denied';
    }
  }
}
