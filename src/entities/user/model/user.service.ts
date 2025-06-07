import type { IBaseChannel } from '@/shared/types/channel.type';
import type { IUser } from './user.type';
import { usersBaseChannels } from './users-base-channels';
import { ChannelManager } from '@/shared/lib/channel-manager';
import axios from 'axios';

class UserService {
  channelManager: ChannelManager | null = null;

  private constructor() {}

  static async create(channels: IBaseChannel[]) {
    const instance = new UserService();
    instance.channelManager = await ChannelManager.create(channels);

    return instance;
  }

  async getUsers() {
    if (!this.channelManager?.currentChannel?.endpoint) return;

    return axios.get<IUser[]>(this.channelManager?.currentChannel?.endpoint);
  }
}

export const userService = await UserService.create(usersBaseChannels);
