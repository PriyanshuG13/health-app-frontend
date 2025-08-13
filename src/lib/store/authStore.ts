import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
    persist(
        set => ({
            token: null,
            setToken: (token: never) => set({ token }),
            clearToken: () => set({ token: null }),
        }),
        { name: 'auth-storage' } // saves to localStorage
    )
);

export default useAuthStore;
