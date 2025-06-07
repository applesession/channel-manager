import { queryClient } from '@/shared/api/query-client';
import { MobxQuery } from '@/shared/lib/mobx-react-query';
import { userService } from './user.service';
import { makeAutoObservable } from 'mobx';
import type { IChannel } from '@/shared/types/channel.type';

class UserStore {
  private usersQuery = new MobxQuery(
    () => ({
      queryKey: ['users', this.currentChannel?.endpoint],
      queryFn: async ({ signal }) => {
        await new Promise((res) => setTimeout(res, 1000));
        return await userService.getUsers(signal);
      },
      select: (data) => data?.data,
      placeholderData: (data) => data,
    }),
    queryClient
  );

  constructor() {
    makeAutoObservable(this);
  }

  get users() {
    const data = this.usersQuery.result().data;
    console.log(data);
    return data;
  }

  get isLoading() {
    return this.usersQuery.result().isLoading;
  }

  get isFetching() {
    return this.usersQuery.result().isFetching;
  }

  get isFetched() {
    return this.usersQuery.result().isFetched;
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
