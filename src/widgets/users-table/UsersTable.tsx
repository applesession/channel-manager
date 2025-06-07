import { userStore } from '@/entities/user/model/user.store';
import { observer } from 'mobx-react-lite';
import styles from './UserTable.module.scss';

export const UsersTable = observer(() => {
  const { users } = userStore;

  return (
    <div className={styles.wrapper}>
      <p>Response</p>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Device</th>
            <th>Emoji</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.device}</td>
              <td>{user.emoji}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});
