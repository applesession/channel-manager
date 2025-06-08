import { makeAutoObservable } from 'mobx';
import type { IBaseChannel, IChannel } from '../types/channel.type';
import { HealthChecker } from './health-checker';

// note: Менеджерит API-каналы

export class ChannelManager {
  channels: IChannel[] = [];
  healthChecker: HealthChecker | null = null;
  currentChannel: IChannel | null = null;
  private monitoringInterval: NodeJS.Timeout | null = null;
  private isChecking: boolean = false;

  private constructor(healthChecker: HealthChecker) {
    this.healthChecker = healthChecker;
    makeAutoObservable(this);
  }

  static async create(channels: IBaseChannel[]) {
    const healthChecker = await HealthChecker.create(channels);
    const healthChannels = await healthChecker.checkAll();

    const instance = new ChannelManager(healthChecker);
    instance.channels = healthChannels;
    instance.sortChannelsByPriority();
    instance.autoSwitchChannel();

    return instance;
  }

  autoSwitchChannel = () => {
    const availableChannel = this.getBestAvailableChannel();
    if (!availableChannel) return this.handleNoChannelsAvailable();
    this.setCurrentChannel(availableChannel);
  };

  private handleNoChannelsAvailable() {
    console.log('No available channels');
    this.clearMonitoring();
    this.updateCurrentChannelStatus();
    this.currentChannel = null;
  }

  setCurrentChannel = (channel: IChannel) => {
    if (this.currentChannel?.id === channel.id) return;

    this.clearMonitoring();
    this.updateCurrentChannelStatus(channel);

    this.currentChannel = channel;
    this.startMonitoring();
  };

  private updateCurrentChannelStatus(newChannel?: IChannel) {
    if (this.currentChannel) {
      this.currentChannel.status = this.currentChannel.isHealth ? 'idle' : 'unavailable';
    }
    if (newChannel) newChannel.status = 'connected';
  }

  private startMonitoring() {
    if (this.monitoringInterval) return;

    this.monitoringInterval = setInterval(() => this.checkCurrentChannelHealth(), 2000);
  }

  private async checkCurrentChannelHealth() {
    if (!this.currentChannel || this.isChecking || !this.healthChecker) return;

    this.isChecking = true;
    try {
      await this.healthChecker.checkChannel(this.currentChannel);
    } catch {
      this.handleChannelFailure();
    } finally {
      this.isChecking = false;
    }
  }

  private handleChannelFailure() {
    if (!this.currentChannel) return;

    this.currentChannel.isHealth = false;
    this.currentChannel.priority = 0;
    this.autoSwitchChannel();
  }

  private clearMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
  }

  private getBestAvailableChannel() {
    return this.channels.find((channel) => channel.isHealth && channel.status === 'idle');
  }

  private sortChannelsByPriority() {
    this.channels.sort((a, b) => b.priority - a.priority);
  }
}
