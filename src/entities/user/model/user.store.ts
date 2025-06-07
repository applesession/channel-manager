import { queryClient } from '@/shared/api/query-client';
import { MobxQuery } from '@/shared/lib/mobx-react-query';
import { userService } from './user.service';
import { makeAutoObservable } from 'mobx';
import type { IChannel } from '@/shared/types/channel.type';

class UserStore {
  private usersQuery = new MobxQuery(
    () => ({
      queryKey: ['users', this.currentChannel?.endpoint],
      queryFn: () => userService.getUsers(),
      select: (data) => data?.data,
    }),
    queryClient
  );

  constructor() {
    makeAutoObservable(this);
  }

  get users() {
    return this.usersQuery.result().data;
  }

  get isLoading() {
    return this.usersQuery.result().isLoading;
  }

  // note: нижестоящие свойства и методы нужны для отображения UI!

  get currentChannel() {
    return userService.channelManager?.currentChannel;
  }

  get channels() {
    return userService.channelManager?.channels;
  }

  setCurrentChannel = (channel: IChannel) => {
    userService.channelManager?.setCurrentChannel(channel);
  };
}

export const userStore = new UserStore();
