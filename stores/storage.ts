import { StateStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage: StateStorage = {
    getItem: async (name: string): Promise<string | null> => {
        const data = (await AsyncStorage.getItem(name)) || null;
        return data;
    },
    setItem: async (name: string, value: string) => {
        await AsyncStorage.setItem(name, value);
    },
    removeItem: async (name: string) => {
        await AsyncStorage.removeItem(name);
    },
};
