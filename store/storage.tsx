import { MMKV } from "react-native-mmkv";

export const tokenStorage = new MMKV({
  id: "token-storage",
  encryptionKey: "some-secrt-key",
});

export const storage = new MMKV({
  id: "my-app-storage",
  encryptionKey: "some-secrt-key",
});

export const mmkvStorage = {
  setItem: (key: string, value: string) => {
    storage.set(key, value);
  },
  getItem: (key: string) => {
    return storage.getString(key) ?? null;
  },
  removeItem: (key: string) => {
    storage.delete(key);
  },
};
