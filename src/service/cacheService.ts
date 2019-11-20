import localforage from 'localforage';

class CacheService {
  private storage: LocalForage;

  constructor() {
    this.open('user');
  }

  open(scope: string) {
    this.storage = localforage.createInstance({ name: scope });
  }

  close() {
    this.storage = null;
  }

  async get(key: string): Promise<any> {
    const data: any = await this.storage.getItem(key);

    return data == null ? void 0 : data;
  }

  set(key: string, data: any): Promise<void> {
    if (this.storage == void 0) {
      console.warn('[Cache] No opened storage.');
    } else {
      return this.storage.setItem(key, data).catch((e) => {});
    }
  }

  delete(key: string): Promise<void> {
    if (this.storage == void 0) {
      console.warn('[Cache] No opened storage.');
    } else {
      return this.storage.removeItem(key);
    }
  }

  clear(): Promise<void> {
    if (this.storage == void 0) {
      console.warn('[Cache] No opened storage.');
    } else {
      return this.storage.clear();
    }
  }
}

export default new CacheService();
