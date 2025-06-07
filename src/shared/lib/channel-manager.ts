import { makeAutoObservable } from 'mobx';
import type { IBaseChannel, IChannel } from '../types/channel.type';
import { HealthChecker } from './health-checker';

// note: Менеджерит API-каналы

export class ChannelManager {
  channels: IChannel[] = [];
  healthChecker: HealthChecker | null = null;
  currentChannel: IChannel | null = null;
  private monitoringInterval: NodeJS.Timeout | null = null;

  private constructor() {
    makeAutoObservable(this);
  }

  static async create(channels: IBaseChannel[]) {
    const instance = new ChannelManager();
    instance.healthChecker = await HealthChecker.create(channels);
    const healthChannels = await instance.healthChecker.checkAll();

    instance.channels = healthChannels;
    instance.sortChannelsForPriority();
    instance.autoSwitchChannel();
    instance.monitoringCurrentChannel();

    return instance;
  }

  autoSwitchChannel = () => {
    const availableChannel = this.getBestAvailableChannel();

    if (availableChannel) {
      this.setCurrentChannel(availableChannel);
      return null;
    }

    this.currentChannel = null;
  };

  setCurrentChannel = (channel: IChannel) => {
    if (this.currentChannel && this.currentChannel?.id === channel.id) return null;

    if (channel.status === 'unavailable') {
      this.autoSwitchChannel();
      return null;
    }

    if (this.currentChannel) this.currentChannel.status = 'idle';
    channel.status = 'connected';
    this.currentChannel = channel;
  };

  private monitoringCurrentChannel() {
    if (!this.currentChannel) return;

    this.monitoringInterval = setInterval(() => console.log(this.currentChannel), 2000);
  }

  private getBestAvailableChannel() {
    return this.channels.find(
      (channel) => channel.status === 'idle' || channel.status === 'connected'
    );
  }

  private sortChannelsForPriority() {
    this.channels.sort((a, b) => b.priority - a.priority);
  }
}
