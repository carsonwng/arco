import create from 'zustand'
import { persist } from 'zustand/middleware'

export const useDiscordStore = create(persist((set, get) => ({
        loggedIn: false,
        user: {
            access_token: null,
            expires_at: null, // In case we move away from implicit grants
            scope: null,

            id: null,
            username: null,
            avatar: null,
            banner: null,
            accent_color: null
        },

        setState: (state) => set(state),
        clear: () => set({
            loggedIn: false,
            user: {
                access_token: null,
                expires_in: null,
                scope: null,

                id: null,
                username: null,
                avatar: null,
                banner: null,
                accent_color: null
            }
        })
    }),
    {
        name: 'arco',
        getStorage: () => localStorage
    }
))