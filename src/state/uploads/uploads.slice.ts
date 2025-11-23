import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit'

export type UploadStatus = 'pending' | 'uploading' | 'success' | 'error'

export interface UploadTask {
    id: string
    fileName: string
    size: number
    progress: number // 0-100
    status: UploadStatus
    error?: string
    folderId?: number | null
    startedAt: number
    completedAt?: number
}

export interface UploadsState {
    tasks: UploadTask[]
}

const initialState: UploadsState = {
    tasks: [],
}

export const uploadsSlice = createSlice({
    name: 'uploads',
    initialState,
    reducers: {
        startUploads: {
            prepare: (files: File[], folderId?: number | null) => {
                return {
                    payload: files.map(f => ({
                        id: nanoid(),
                        fileName: f.name,
                        size: f.size,
                        progress: 0,
                        status: 'pending' as UploadStatus,
                        error: undefined,
                        folderId: folderId ?? null,
                        startedAt: Date.now(),
                    })),
                }
            },
            reducer: (state, action: PayloadAction<UploadTask[]>) => {
                state.tasks.push(...action.payload)
            },
        },
        markUploading: (state, action: PayloadAction<{ id: string }>) => {
            const t = state.tasks.find(t => t.id === action.payload.id)
            if (t && t.status === 'pending') t.status = 'uploading'
        },
        updateProgress: (state, action: PayloadAction<{ id: string; progress: number }>) => {
            const t = state.tasks.find(t => t.id === action.payload.id)
            if (t) {
                t.progress = action.payload.progress
                if (t.status === 'pending') t.status = 'uploading'
            }
        },
        markSuccess: (state, action: PayloadAction<{ id: string }>) => {
            const t = state.tasks.find(t => t.id === action.payload.id)
            if (t) {
                t.status = 'success'
                t.progress = 100
                t.completedAt = Date.now()
            }
        },
        markError: (state, action: PayloadAction<{ id: string; error: string }>) => {
            const t = state.tasks.find(t => t.id === action.payload.id)
            if (t) {
                t.status = 'error'
                t.error = action.payload.error
                t.completedAt = Date.now()
            }
        },
        // --- File-based helpers (tìm theo tên + size) ---
        updateProgressByFile: (state, action: PayloadAction<{ fileName: string; size: number; progress: number }>) => {
            const t = state.tasks.find(task => task.fileName === action.payload.fileName && task.size === action.payload.size && task.status !== 'success' && task.status !== 'error')
            if (t) {
                t.progress = action.payload.progress
                if (t.status === 'pending') t.status = 'uploading'
            }
        },
        markSuccessByFile: (state, action: PayloadAction<{ fileName: string; size: number }>) => {
            const t = state.tasks.find(task => task.fileName === action.payload.fileName && task.size === action.payload.size)
            if (t) {
                t.status = 'success'
                t.progress = 100
                t.completedAt = Date.now()
            }
        },
        markErrorByFile: (state, action: PayloadAction<{ fileName: string; size: number; error: string }>) => {
            const t = state.tasks.find(task => task.fileName === action.payload.fileName && task.size === action.payload.size)
            if (t) {
                t.status = 'error'
                t.error = action.payload.error
                t.completedAt = Date.now()
            }
        },
        removeTask: (state, action: PayloadAction<{ id: string }>) => {
            state.tasks = state.tasks.filter(t => t.id !== action.payload.id)
        },
        clearCompleted: state => {
            state.tasks = state.tasks.filter(t => t.status === 'pending' || t.status === 'uploading')
        },
    },
})

export const {
    startUploads,
    markUploading,
    updateProgress,
    markSuccess,
    markError,
    updateProgressByFile,
    markSuccessByFile,
    markErrorByFile,
    removeTask,
    clearCompleted,
} = uploadsSlice.actions

export default uploadsSlice.reducer
