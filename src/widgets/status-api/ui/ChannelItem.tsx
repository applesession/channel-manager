import type { IChannel } from '@/shared/types/channel.type';
import styles from './ChannelItem.module.scss';
import clsx from 'clsx';
import { userStore } from '@/entities/user/model/user.store';

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
      <p className={styles.status}>{channel.status}</p>
    </button>
  );
}
