import { queryClient } from '@/shared/api/query-client';
import { MobxQuery } from '@/shared/lib/mobx-react-query';
import { userService } from './user.service';
import { makeAutoObservable } from 'mobx';

class UserStore {
  private usersQuery = new MobxQuery(
    () => ({
      queryKey: ['users'],
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
}

export const userStore = new UserStore();
