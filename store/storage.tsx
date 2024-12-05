import AsyncStorage from "@react-native-async-storage/async-storage";

export const tokenStorage = {
  setItem: async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error("Error setting token:", error);
    }
  },
  getItem: async (key: string) => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value !== null ? value : null;
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  },
  removeItem: async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing token:", error);
    }
  },
  clearAll: async () => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error("Error removing token:", error);
    }
  },
};

export const mmkvStorage = {
  setItem: async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(`my-app-storage-${key}`, value);
    } catch (error) {
      console.error("Error setting item:", error);
    }
  },
  getItem: async (key: string) => {
    try {
      const value = await AsyncStorage.getItem(`my-app-storage-${key}`);
      return value !== null ? value : null;
    } catch (error) {
      console.error("Error getting item:", error);
      return null;
    }
  },
  removeItem: async (key: string) => {
    try {
      await AsyncStorage.removeItem(`my-app-storage-${key}`);
    } catch (error) {
      console.error("Error removing item:", error);
    }
  },
};
