import { configureStore } from '@reduxjs/toolkit'
import uploadsReducer from './uploads/uploads.slice'
import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import type { UploadsState } from './uploads/uploads.slice'

const STORAGE_KEY = 'cloud-storage-uploads-state'

// Load state from localStorage
function loadState(): { uploads: UploadsState } | undefined {
    try {
        const serialized = localStorage.getItem(STORAGE_KEY)
        if (serialized === null) return undefined
        return JSON.parse(serialized)
    } catch (e) {
        console.error('Failed to load state from localStorage:', e)
        return undefined
    }
}

// Save state to localStorage
function saveState(state: { uploads: UploadsState }) {
    try {
        const serialized = JSON.stringify({ uploads: state.uploads })
        localStorage.setItem(STORAGE_KEY, serialized)
    } catch (e) {
        console.error('Failed to save state to localStorage:', e)
    }
}

const preloadedState = loadState()

export const store = configureStore({
    reducer: {
        uploads: uploadsReducer,
    },
    preloadedState,
    devTools: import.meta.env.DEV,
})

// Subscribe to store changes and save to localStorage
store.subscribe(() => {
    saveState(store.getState())
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
