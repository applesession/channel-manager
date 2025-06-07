import { StatusApi } from '@/widgets/status-api/StatusApi';
import { UsersTable } from '@/widgets/users-table/UsersTable';
import './App.module.scss';

function Home() {
  return (
    <main>
      <StatusApi />
      <UsersTable />
    </main>
  );
}

export default Home;
