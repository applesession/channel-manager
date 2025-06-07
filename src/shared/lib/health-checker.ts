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

  private transformChannel = (
    channel: PromiseSettledResult<IHealth | undefined>,
    index: number
  ): IChannel => {
    const isFilelled = channel.status === 'fulfilled';
    const baseChannel = this.channels[index];

    if (!isFilelled) {
      return {
        id: baseChannel.id,
        endpoint: baseChannel.endpoint,
        healthEndpoint: baseChannel.healthEndpoint,
        priority: 0,
        status: 'unavailable',
      };
    }

    return {
      id: baseChannel.id,
      endpoint: baseChannel.endpoint,
      healthEndpoint: baseChannel.healthEndpoint,
      priority: 1,
      status: 'idle',
    };
  };
}
