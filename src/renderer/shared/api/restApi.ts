import { type Api, webApi } from './platformApi';

const isElectron = typeof window !== 'undefined' && 'electronAPI' in window;

export const getApi = (): Api => {
  if (!isWebMode()) {
    return (window as unknown as { electronAPI: Api }).electronAPI;
  }
  return webApi;
};

export const isWebMode = () => !isElectron;
