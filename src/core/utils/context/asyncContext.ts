import { AsyncLocalStorage } from 'async_hooks';

interface ContextStore {
  requestId: string;
  [key: string]: any;
}

const asyncLocalStorage = new AsyncLocalStorage<ContextStore>();

export const getStore = (): ContextStore | undefined => {
  return asyncLocalStorage.getStore();
};

export const getRequestId = (): string => {
  const store = getStore();
  return store?.requestId || 'unknown';
};

export const setContextValue = (key: string, value: any): boolean => {
  const store = getStore();
  if (store) {
    store[key] = value;
    return true;
  }
  return false;
};

export const getContextValue = (key: string): any => {
  const store = getStore();
  return store?.[key];
};

export const runWithContext = <T>(requestId: string, callback: () => T): T => {
  const store: ContextStore = { requestId };
  return asyncLocalStorage.run(store, callback);
};

export const hasContext = (): boolean => {
  return getStore() !== undefined;
};

export { asyncLocalStorage };
