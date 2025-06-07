import type { IUser } from './user.type';

class UserService {
  async getUsers(): Promise<IUser[]> {
    // return await axios.get<IUser[]>('https://jsonplaceholder.typicode.com/users');
    return [{ id: 1, name: 'Kate', emoji: '🔔', device: 'Macbook' }];
  }
}

export const userService = new UserService();
