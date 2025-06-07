import type { IHealth } from './health.type';

type ChannelStatus = 'idle' | 'connected' | 'unavailable';

export interface IBaseChannel {
  id: number;
  endpoint: string;
  healthEndpoint: () => Promise<IHealth | undefined>;
}

export interface IChannel extends IBaseChannel {
  status: ChannelStatus;
  priority: number;
}
