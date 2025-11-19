import { z } from 'zod'
import {
  TrashItemSchema,
  TrashListDataSchema,
  TrashFolderContentsDataSchema,
  TrashFolderItemSchema,
  TrashFileItemSchema,
  TrashFolderContentsPaginationSchema,
  RestoreTrashItemRequestSchema,
  RestoreTrashItemSuccessSchema,
  RestoredItemSchema,
  DeleteTrashItemRequestSchema,
  DeleteTrashItemSuccessSchema,
  EmptyTrashSuccessSchema,
  EmptyTrashDeletedCountSchema,
} from './trash.schemas'

export type TrashItem = z.infer<typeof TrashItemSchema>
export type TrashListData = z.infer<typeof TrashListDataSchema>
export type TrashListSuccess = TrashListData

export type TrashFolderItem = z.infer<typeof TrashFolderItemSchema>
export type TrashFileItem = z.infer<typeof TrashFileItemSchema>
export type TrashFolderContentsPagination = z.infer<typeof TrashFolderContentsPaginationSchema>
export type TrashFolderContentsData = z.infer<typeof TrashFolderContentsDataSchema>
export type TrashFolderContentsSuccess = TrashFolderContentsData

export type RestoreTrashItemRequest = z.infer<typeof RestoreTrashItemRequestSchema>
export type RestoredItem = z.infer<typeof RestoredItemSchema>
export type RestoreTrashItemSuccess = z.infer<typeof RestoreTrashItemSuccessSchema>

export type DeleteTrashItemRequest = z.infer<typeof DeleteTrashItemRequestSchema>
export type DeleteTrashItemSuccess = z.infer<typeof DeleteTrashItemSuccessSchema>

export type EmptyTrashDeletedCount = z.infer<typeof EmptyTrashDeletedCountSchema>
export type EmptyTrashSuccess = z.infer<typeof EmptyTrashSuccessSchema>

export default TrashItem
