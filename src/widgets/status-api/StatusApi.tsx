import { userStore } from '@/entities/user/model/user.store';
import styles from './StatusApi.module.scss';
import { ChannelItem } from './ui/ChannelItem';
import { observer } from 'mobx-react-lite';

export const StatusApi = observer(() => {
  const { channels, currentChannel } = userStore;

  return (
    <div className={styles.wrapper}>
      <p className={styles.title}>Status API</p>

      <div className={styles.endpoint}>
        <p>Current Endpoint:</p>
        <code>{currentChannel?.endpoint}</code>
      </div>

      <ul className={styles['channels-list']}>
        {channels?.map((channel) => (
          <ChannelItem
            key={channel.id}
            channel={channel}
          />
        ))}
      </ul>
    </div>
  );
});
