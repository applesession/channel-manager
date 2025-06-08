import type { IBaseChannel, IChannel } from '../types/channel.type';
import type { IHealth } from '../types/health.type';

export class HealthChecker {
  private constructor(private channels: IBaseChannel[]) {}

  static async create(channels: IBaseChannel[]) {
    const instance = new HealthChecker(channels);

    return instance;
  }

  async checkAll() {
    const healthEndnpoints = this.channels.map((channel) => channel.healthEndpoint());

    return (await Promise.allSettled(healthEndnpoints)).map(this.transformChannel);
  }

  async checkChannel(channel: IChannel) {
    try {
      const health = await channel.healthEndpoint();

      return this.transformChannel(
        {
          status: 'fulfilled',
          value: health,
        },
        this.channels.findIndex((c) => c.id === channel.id)
      );
    } catch {
      throw new Error('Channel no available');
    }
  }

  async checkChannels(channels: IChannel[]) {
    const results: IChannel[] = [];

    for await (const channel of channels) {
      try {
        const result = await this.checkChannel(channel);
        results.push(result);
      } catch {
        continue;
      }
    }

    return results;
  }

  private transformChannel = (
    channel: PromiseSettledResult<IHealth | undefined>,
    index: number
  ): IChannel => {
    const isFilelled = channel.status === 'fulfilled';
    const baseChannel = this.channels[index];

    return {
      id: baseChannel.id,
      endpoint: baseChannel.endpoint,
      healthEndpoint: baseChannel.healthEndpoint,
      priority: isFilelled ? 1 : 0,
      status: isFilelled ? 'idle' : 'unavailable',
      isHealth: isFilelled ? true : false,
    };
  };
}
