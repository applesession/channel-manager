import { userStore } from '@/entities/user/model/user.store';
import { observer } from 'mobx-react-lite';
import styles from './UserTable.module.scss';
import { Badge } from '@/shared/ui/badge/Badge';
import { Loader } from '@/shared/ui/loader/Loader';

export const UsersTable = observer(() => {
  const { users, isFetched, isFetching, isLoading } = userStore;

  return (
    <div className={styles.wrapper}>
      <div className={styles['status-bar']}>
        <p>Response</p>
        {isLoading && <Loader />}
        {isFetched && <Badge color='green'>cached</Badge>}
        {isFetching && !isFetched && <Badge color='red'>uncached</Badge>}
      </div>

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
