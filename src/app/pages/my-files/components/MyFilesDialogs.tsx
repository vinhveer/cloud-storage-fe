import React from 'react'
import DeleteFileDialog from './DeleteFileDialog'
import DeleteFolderDialog from './DeleteFolderDialog'
import RenameFileDialog from './RenameFileDialog'
import RenameFolderDialog from './RenameFolderDialog'
import MoveFileDialog from './MoveFileDialog'
import CopyFileDialog from './CopyFileDialog'
import MoveFolderDialog from './MoveFolderDialog'
import CopyFolderDialog from './CopyFolderDialog'
import ManageAccessDialog from './ManageAccessDialog'
import MoveMultipleFilesDialog from './MoveMultipleFilesDialog'
import CopyMultipleFilesDialog from './CopyMultipleFilesDialog'
import DeleteMultipleFilesDialog from './DeleteMultipleFilesDialog'
import FileDetailPanel from '@/app/pages/components/FileDetailPanel'
import FileVersionsOffcanvas from '@/app/pages/components/FileVersionsOffcanvas'
import { ShareModal } from '@/components/Share'
import type { FileItem } from '@/components/FileList/types'

interface FileListDialogsProps {
  deleteFileDialog: { open: boolean; file: FileItem | null }
  setDeleteFileDialog: React.Dispatch<React.SetStateAction<{ open: boolean; file: FileItem | null }>>
  renameFileDialog: { open: boolean; file: FileItem | null }
  setRenameFileDialog: React.Dispatch<React.SetStateAction<{ open: boolean; file: FileItem | null }>>
  moveFileDialog: { open: boolean; file: FileItem | null; destinationFolderId?: number }
  setMoveFileDialog: React.Dispatch<React.SetStateAction<{ open: boolean; file: FileItem | null; destinationFolderId?: number }>>
  copyFileDialog: { open: boolean; file: FileItem | null; destinationFolderId?: number | null; onlyLatest?: boolean }
  setCopyFileDialog: React.Dispatch<React.SetStateAction<{ open: boolean; file: FileItem | null; destinationFolderId?: number | null; onlyLatest?: boolean }>>
  renameFolderDialog: { open: boolean; folder: FileItem | null }
  setRenameFolderDialog: React.Dispatch<React.SetStateAction<{ open: boolean; folder: FileItem | null }>>
  deleteFolderDialog: { open: boolean; folder: FileItem | null }
  setDeleteFolderDialog: React.Dispatch<React.SetStateAction<{ open: boolean; folder: FileItem | null }>>
  moveFolderDialog: { open: boolean; folder: FileItem | null }
  setMoveFolderDialog: React.Dispatch<React.SetStateAction<{ open: boolean; folder: FileItem | null }>>
  copyFolderDialog: { open: boolean; folder: FileItem | null }
  setCopyFolderDialog: React.Dispatch<React.SetStateAction<{ open: boolean; folder: FileItem | null }>>
  manageAccessDialog: { open: boolean; item: FileItem | null; type: 'file' | 'folder' }
  setManageAccessDialog: React.Dispatch<React.SetStateAction<{ open: boolean; item: FileItem | null; type: 'file' | 'folder' }>>
  moveMultipleDialog: { open: boolean; items: FileItem[] }
  setMoveMultipleDialog: React.Dispatch<React.SetStateAction<{ open: boolean; items: FileItem[] }>>
  copyMultipleDialog: { open: boolean; items: FileItem[] }
  setCopyMultipleDialog: React.Dispatch<React.SetStateAction<{ open: boolean; items: FileItem[] }>>
  deleteMultipleDialog: { open: boolean; items: FileItem[] }
  setDeleteMultipleDialog: React.Dispatch<React.SetStateAction<{ open: boolean; items: FileItem[] }>>
  detailFile: FileItem | null
  setDetailFile: React.Dispatch<React.SetStateAction<FileItem | null>>
  versionsFile: FileItem | null
  setVersionsFile: React.Dispatch<React.SetStateAction<FileItem | null>>
  shareModal: { open: boolean; tab?: 'create' | 'detail'; shareId?: number; createType?: 'file' | 'folder'; createId?: number; createName?: string }
  setShareModal: React.Dispatch<React.SetStateAction<{ open: boolean; tab?: 'create' | 'detail'; shareId?: number; createType?: 'file' | 'folder'; createId?: number; createName?: string }>>
  onDeselectAll?: () => void
}

export default function FileListDialogs({
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
  shareModal,
  setShareModal,
  onDeselectAll,
}: FileListDialogsProps) {
  return (
    <>
      <FileDetailPanel
        file={detailFile}
        open={detailFile != null}
        onClose={() => setDetailFile(null)}
      />
      <FileVersionsOffcanvas
        fileId={versionsFile?.id && versionsFile.type?.toLowerCase() !== 'folder' ? Number(versionsFile.id) : null}
        fileName={versionsFile?.name}
        open={versionsFile != null}
        onClose={() => setVersionsFile(null)}
      />
      {deleteFolderDialog.open && deleteFolderDialog.folder?.id && (
        <DeleteFolderDialog
          open={deleteFolderDialog.open}
          onOpenChange={open => {
            if (!open) setDeleteFolderDialog({ open: false, folder: null })
          }}
          folderId={Number(deleteFolderDialog.folder.id)}
          folderName={deleteFolderDialog.folder.name}
        />
      )}
      {renameFolderDialog.open && renameFolderDialog.folder?.id && (
        <RenameFolderDialog
          open={renameFolderDialog.open}
          onOpenChange={open => {
            if (!open) setRenameFolderDialog({ open: false, folder: null })
          }}
          folderId={Number(renameFolderDialog.folder.id)}
          currentName={renameFolderDialog.folder.name}
        />
      )}
      <ShareModal
        open={shareModal.open}
        onClose={() => setShareModal({ open: false })}
        initialShareId={shareModal.shareId}
        initialCreateType={shareModal.createType}
        initialCreateId={shareModal.createId}
        initialCreateName={shareModal.createName}
      />
      {deleteFileDialog.open && deleteFileDialog.file?.id && (
        <DeleteFileDialog
          open={deleteFileDialog.open}
          onOpenChange={open => {
            if (!open) setDeleteFileDialog({ open: false, file: null })
          }}
          title="Delete file"
          confirmType="danger"
          confirmText={`Are you sure you want to delete "${deleteFileDialog.file.name}"?`}
          fileId={Number(deleteFileDialog.file.id)}
          onSuccess={() => {
            setDeleteFileDialog({ open: false, file: null })
          }}
        />
      )}
      {renameFileDialog.open && renameFileDialog.file?.id && (
        <RenameFileDialog
          open={renameFileDialog.open}
          onOpenChange={open => {
            if (!open) setRenameFileDialog(prev => ({ ...prev, open: false }))
          }}
          fileId={Number(renameFileDialog.file.id)}
          currentName={renameFileDialog.file.name}
          onSuccess={() => {
            setRenameFileDialog(prev => ({ ...prev, open: false }))
          }}
        />
      )}
      {moveFileDialog.open && moveFileDialog.file?.id && (
        <MoveFileDialog
          open={moveFileDialog.open}
          onOpenChange={open => {
            if (!open) setMoveFileDialog(prev => ({ ...prev, open: false }))
          }}
          title="Move file"
          confirmButtonText="Move"
          fileId={Number(moveFileDialog.file.id)}
          destinationFolderId={moveFileDialog.destinationFolderId}
          onSuccess={() => {
            setMoveFileDialog(prev => ({ ...prev, open: false }))
          }}
        />
      )}
      {copyFileDialog.open && copyFileDialog.file?.id && (
        <CopyFileDialog
          open={copyFileDialog.open}
          onOpenChange={open => {
            if (!open) setCopyFileDialog(prev => ({ ...prev, open: false }))
          }}
          title="Copy file"
          confirmButtonText="Copy"
          fileId={Number(copyFileDialog.file.id)}
          destinationFolderId={copyFileDialog.destinationFolderId}
          onlyLatest={copyFileDialog.onlyLatest}
          onSuccess={() => {
            setCopyFileDialog(prev => ({ ...prev, open: false }))
          }}
        />
      )}
      {moveFolderDialog.open && moveFolderDialog.folder?.id && (
        <MoveFolderDialog
          open={moveFolderDialog.open}
          onOpenChange={open => {
            if (!open) setMoveFolderDialog({ open: false, folder: null })
          }}
          folderId={Number(moveFolderDialog.folder.id)}
          folderName={moveFolderDialog.folder.name}
          onSuccess={() => {
            setMoveFolderDialog({ open: false, folder: null })
          }}
        />
      )}
      {copyFolderDialog.open && copyFolderDialog.folder?.id && (
        <CopyFolderDialog
          open={copyFolderDialog.open}
          onOpenChange={open => {
            if (!open) setCopyFolderDialog({ open: false, folder: null })
          }}
          folderId={Number(copyFolderDialog.folder.id)}
          folderName={copyFolderDialog.folder.name}
          onSuccess={() => {
            setCopyFolderDialog({ open: false, folder: null })
          }}
        />
      )}
      {manageAccessDialog.open && manageAccessDialog.item?.id && (
        <ManageAccessDialog
          open={manageAccessDialog.open}
          onOpenChange={open => {
            if (!open) setManageAccessDialog({ open: false, item: null, type: 'file' })
          }}
          shareableType={manageAccessDialog.type}
          shareableId={Number(manageAccessDialog.item.id)}
          shareableName={manageAccessDialog.item.name}
        />
      )}
      {moveMultipleDialog.open && moveMultipleDialog.items.length > 0 && (
        <MoveMultipleFilesDialog
          open={moveMultipleDialog.open}
          onOpenChange={open => {
            if (!open) setMoveMultipleDialog({ open: false, items: [] })
          }}
          items={moveMultipleDialog.items}
          onSuccess={() => {
            setMoveMultipleDialog({ open: false, items: [] })
            onDeselectAll?.()
          }}
        />
      )}
      {copyMultipleDialog.open && copyMultipleDialog.items.length > 0 && (
        <CopyMultipleFilesDialog
          open={copyMultipleDialog.open}
          onOpenChange={open => {
            if (!open) setCopyMultipleDialog({ open: false, items: [] })
          }}
          items={copyMultipleDialog.items}
          onSuccess={() => {
            setCopyMultipleDialog({ open: false, items: [] })
            onDeselectAll?.()
          }}
        />
      )}
      {deleteMultipleDialog.open && deleteMultipleDialog.items.length > 0 && (
        <DeleteMultipleFilesDialog
          open={deleteMultipleDialog.open}
          onOpenChange={open => {
            if (!open) setDeleteMultipleDialog({ open: false, items: [] })
          }}
          items={deleteMultipleDialog.items}
          onSuccess={() => {
            setDeleteMultipleDialog({ open: false, items: [] })
            onDeselectAll?.()
          }}
        />
      )}
    </>
  )
}

