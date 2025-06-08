import type { IChannel } from '@/shared/types/channel.type';
import styles from './ChannelItem.module.scss';
import clsx from 'clsx';
import { userStore } from '@/entities/user/model/user.store';
import { Badge } from '@/shared/ui/badge/Badge';

interface Props {
  channel: IChannel;
}

export function ChannelItem({ channel }: Props) {
  const { setCurrentChannel } = userStore;

  return (
    <button
      onClick={() => setCurrentChannel(channel)}
      disabled={channel.status === 'unavailable'}
      className={clsx(styles.channel, {
        [styles.connected]: channel.status === 'connected',
        [styles.idle]: channel.status === 'idle',
        [styles.unavailable]: channel.status === 'unavailable',
      })}
    >
      <p className={styles.subtitle}>status</p>
      <Badge
        color={
          channel.status === 'connected'
            ? 'green'
            : channel.status === 'idle'
            ? 'orange'
            : 'red'
        }
      >
        {channel.status}
      </Badge>

      <div className={styles.modal}>
        <div>
          <p>priority:</p>
          <p>{channel.priority}</p>
        </div>

        <div>
          <p>endpoint:</p>
          <p>{channel.endpoint}</p>
        </div>
      </div>
    </button>
  );
}
