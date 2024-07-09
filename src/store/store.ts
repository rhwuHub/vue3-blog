// store/store.ts
import { defineStore } from 'pinia';

export const useMainStore = defineStore('main',{
    state: () => {
        return {
            passwordVerified: false
        }
    }
})
