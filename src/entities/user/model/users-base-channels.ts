import type { IBaseChannel } from '@/shared/types/channel.type';
import { handlerHealth } from '../../../shared/api/lib/handler-health';

export const usersBaseChannels: IBaseChannel[] = [
  {
    endpoint: 'http://localhost:4000/users',
    healthEndpoint: () => handlerHealth('http://localhost:4000/health'),
  },
  {
    endpoint: 'http://localhost:4001/users',
    healthEndpoint: () => handlerHealth('http://localhost:4001/health'),
  },
  {
    endpoint: 'http://localhost:4002/users',
    healthEndpoint: () => handlerHealth('http://localhost:4002/health'),
  },
];
