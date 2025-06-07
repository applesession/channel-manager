import axios, { isAxiosError } from 'axios';
import type { IHealth } from '@/shared/types/health.type';

export const handlerHealth = async (api: string) => {
  try {
    return (await axios.get<IHealth>(api)).data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.log(error.message);
      throw new Error(error.message);
    }
  }
};
