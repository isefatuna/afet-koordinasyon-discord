import axios from 'axios';
import { TextChannel } from 'discord.js';
import { filledBar } from 'string-progressbar';
import { Configuration, OpenAIApi } from 'openai';
import { ConfigService } from '@nestjs/config';
const configService = new ConfigService();

export async function getLatestNews(
  timestamp: number,
  textChannel: TextChannel,
): Promise<string> {
  const configuration = new Configuration({
    apiKey: configService.get<string>('OPEN_AI_API_KEY'),
  });
  const openai = new OpenAIApi(configuration);
  const getPublicKeyUrl =
    'https://stream.epctex.com/api/after?timestamp=' +
    Math.floor(timestamp / 1000);
  try {
    const { data, status } = await axios.get<any>(getPublicKeyUrl, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Accept-Encoding': 'text/html; charset=UTF-8',
      },
    });
    if (status === 200) {
      const latestTenNews = data.data;
      for (let i = 0; i < latestTenNews.length; i++) {
        (textChannel as TextChannel).send(
          'https://twitter.com/' +
            latestTenNews[i]['user']['screen_name'] +
            '/status/' +
            latestTenNews[i]['id_str'],
        );
        try {
          const response = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt:
              'Extract lat lng from the address inside this text only in number format: ' +
              latestTenNews[i]['full_text'],
            temperature: 0,
            max_tokens: 256,
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
          });
          if (response) {
            const choices = response.data.choices[0]['text'];
            (textChannel as TextChannel).send(
              'https://maps.google.com/?q=' +
                choices.substring(0, choices.indexOf(',')).trim() +
                ',' +
                choices.split(',').pop().trim() +
                '&z=8',
            );
          }
        } catch (error) {
          if (error.response) {
            console.log(error.response.status);
            console.log(error.response.data);
          } else {
            console.log(error.message);
          }
        }
      }
      (textChannel as TextChannel).send(
        'Total tweets: ' +
          latestTenNews.length +
          ' for latest ' +
          '5' +
          ' minutes',
      );
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const response = error.response.data.details;
      return '\n\n' + response;
    } else {
      console.log('unexpected error: ', error);
      return 'An unexpected error occurred';
    }
  }
}

export async function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function callForNewData(
  timeStamp: number,
  interval: number,
  textChannel: TextChannel,
  isLoop: boolean,
) {
  const ctx = (textChannel as TextChannel).send(filledBar(interval, 0, 10)[0]);
  for (let i = 0; i <= interval; i++) {
    (await ctx).edit(filledBar(interval, i, 10)[0]);
    if (isLoop) {
      await timeout(60000);
    }
  }
  if (isLoop) {
    const newTime = timeStamp + 1000 * (60 * interval);
    await getLatestNews(newTime, textChannel);
    await callForNewData(newTime, interval, textChannel, isLoop);
  } else {
    await getLatestNews(timeStamp, textChannel);
  }
}
