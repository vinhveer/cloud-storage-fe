import React from 'react'
import type { FileItem } from '../types'

export function useFileListDialogs() {
  const [shareFileDialog, setShareFileDialog] = React.useState<{
    open: boolean
    file: FileItem | null
  }>({
    open: false,
    file: null,
  })

  const [deleteFileDialog, setDeleteFileDialog] = React.useState<{ open: boolean; file: FileItem | null }>({
    open: false,
    file: null,
  })

  const [renameFileDialog, setRenameFileDialog] = React.useState<{
    open: boolean
    file: FileItem | null
  }>({
    open: false,
    file: null,
  })

  const [moveFileDialog, setMoveFileDialog] = React.useState<{
    open: boolean
    file: FileItem | null
    destinationFolderId?: number
  }>({
    open: false,
    file: null,
    destinationFolderId: undefined,
  })

  const [copyFileDialog, setCopyFileDialog] = React.useState<{
    open: boolean
    file: FileItem | null
    destinationFolderId?: number | null
    onlyLatest?: boolean
  }>({
    open: false,
    file: null,
    destinationFolderId: null,
    onlyLatest: true,
  })

  const [renameFolderDialog, setRenameFolderDialog] = React.useState<{
    open: boolean
    folder: FileItem | null
  }>({
    open: false,
    folder: null,
  })

  const [deleteFolderDialog, setDeleteFolderDialog] = React.useState<{
    open: boolean
    folder: FileItem | null
  }>({
    open: false,
    folder: null,
  })

  const [shareFolderDialog, setShareFolderDialog] = React.useState<{
    open: boolean
    folder: FileItem | null
  }>({
    open: false,
    folder: null,
  })

  const [moveFolderDialog, setMoveFolderDialog] = React.useState<{
    open: boolean
    folder: FileItem | null
  }>({
    open: false,
    folder: null,
  })

  const [copyFolderDialog, setCopyFolderDialog] = React.useState<{
    open: boolean
    folder: FileItem | null
  }>({
    open: false,
    folder: null,
  })

  const [manageAccessDialog, setManageAccessDialog] = React.useState<{
    open: boolean
    item: FileItem | null
    type: 'file' | 'folder'
  }>({
    open: false,
    item: null,
    type: 'file',
  })

  const [moveMultipleDialog, setMoveMultipleDialog] = React.useState<{
    open: boolean
    items: FileItem[]
  }>({
    open: false,
    items: [],
  })

  const [copyMultipleDialog, setCopyMultipleDialog] = React.useState<{
    open: boolean
    items: FileItem[]
  }>({
    open: false,
    items: [],
  })

  const [deleteMultipleDialog, setDeleteMultipleDialog] = React.useState<{
    open: boolean
    items: FileItem[]
  }>({
    open: false,
    items: [],
  })

  const [detailFile, setDetailFile] = React.useState<FileItem | null>(null)
  const [versionsFile, setVersionsFile] = React.useState<FileItem | null>(null)

  return {
    shareFileDialog,
    setShareFileDialog,
    deleteFileDialog,
    setDeleteFileDialog,
    renameFileDialog,
    setRenameFileDialog,
    moveFileDialog,
    setMoveFileDialog,
    copyFileDialog,
    setCopyFileDialog,
    renameFolderDialog,
    setRenameFolderDialog,
    deleteFolderDialog,
    setDeleteFolderDialog,
    shareFolderDialog,
    setShareFolderDialog,
    moveFolderDialog,
    setMoveFolderDialog,
    copyFolderDialog,
    setCopyFolderDialog,
    manageAccessDialog,
    setManageAccessDialog,
    moveMultipleDialog,
    setMoveMultipleDialog,
    copyMultipleDialog,
    setCopyMultipleDialog,
    deleteMultipleDialog,
    setDeleteMultipleDialog,
    detailFile,
    setDetailFile,
    versionsFile,
    setVersionsFile,
  }
}

