import type { IBaseChannel } from '@/shared/types/channel.type';
import { handlerHealth } from '../../../shared/api/lib/handler-health';

export const usersBaseChannels: IBaseChannel[] = [
  {
    id: 1,
    endpoint: 'http://localhost:4000/users',
    healthEndpoint: () => handlerHealth('http://localhost:4000/health'),
  },
  {
    id: 2,
    endpoint: 'http://localhost:4001/users',
    healthEndpoint: () => handlerHealth('http://localhost:4001/health'),
  },
  {
    id: 3,
    endpoint: 'http://localhost:4002/users',
    healthEndpoint: () => handlerHealth('http://localhost:4002/health'),
  },
];
