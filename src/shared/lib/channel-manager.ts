import { action, makeAutoObservable } from 'mobx';
import type { IBaseChannel, IChannel } from '../types/channel.type';
import { HealthChecker } from './health-checker';

// note: Менеджерит API-каналы

export class ChannelManager {
  channels: IChannel[] = [];
  healthChecker: HealthChecker | null = null;
  currentChannel: IChannel | null = null;
  private monitoringInterval: NodeJS.Timeout | null = null;
  private unavailableCheckInterval: NodeJS.Timeout | null = null;
  private isCheckingCurrentChannel: boolean = false;
  private isCheckingUnavailableChannels: boolean = false;
  private INTERVAL_CURRENT_CHANNEL = 2000;
  private INTERVAL_UNAVAILABLE_CHANNELS = 5000;

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
    instance.startMonitoringUnavailableChannels();

    return instance;
  }

  autoSwitchChannel = () => {
    const availableChannel = this.getBestAvailableChannel();
    if (!availableChannel) return this.handleNoChannelsAvailable();
    this.setCurrentChannel(availableChannel);
  };

  setCurrentChannel = (channel: IChannel) => {
    if (this.currentChannel?.id === channel.id) return;

    this.clearMonitoring();
    this.updateCurrentChannelStatus(channel);

    this.currentChannel = channel;
    this.startMonitoringCurrentChannel();
  };

  private updateCurrentChannelStatus(newChannel?: IChannel) {
    if (this.currentChannel) {
      this.currentChannel.status = this.currentChannel.isHealth ? 'idle' : 'unavailable';
    }
    if (newChannel) newChannel.status = 'connected';
  }

  private startMonitoringCurrentChannel() {
    if (this.monitoringInterval) return;

    this.monitoringInterval = setInterval(
      () => this.checkCurrentChannelHealth(),
      this.INTERVAL_CURRENT_CHANNEL
    );
  }

  private async checkCurrentChannelHealth() {
    if (!this.currentChannel || this.isCheckingCurrentChannel || !this.healthChecker)
      return;

    this.isCheckingCurrentChannel = true;
    try {
      await this.healthChecker.checkChannel(this.currentChannel);
    } catch {
      this.handleChannelFailure();
    } finally {
      this.isCheckingCurrentChannel = false;
    }
  }

  private startMonitoringUnavailableChannels() {
    if (this.unavailableCheckInterval) return;

    this.unavailableCheckInterval = setInterval(
      () => this.checkUnavailableChannelsHealth(),
      this.INTERVAL_UNAVAILABLE_CHANNELS
    );
  }

  private async checkUnavailableChannelsHealth() {
    if (this.isCheckingUnavailableChannels || !this.healthChecker) return;
    const unavailableChannels = this.channels.filter((channel) => !channel.isHealth);
    if (!unavailableChannels.length) return;

    this.isCheckingUnavailableChannels = true;
    try {
      const results = await this.healthChecker.checkChannels(unavailableChannels);

      if (!results.length) return;

      this.updateChannals(results);

      if (!this.currentChannel) {
        this.autoSwitchChannel();
      }
    } finally {
      this.isCheckingUnavailableChannels = false;
    }
  }

  private updateChannals(updatedChannels: IChannel[]) {
    updatedChannels.forEach((updatedChannel) => {
      const index = this.channels.findIndex((c) => c.id === updatedChannel.id);
      if (index !== -1) {
        this.channels[index] = updatedChannel;
      }
    });
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

  private handleNoChannelsAvailable() {
    console.log('no available channels');
    this.clearMonitoring();
    this.updateCurrentChannelStatus();
    this.currentChannel = null;
  }
}
