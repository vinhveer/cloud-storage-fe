import React from 'react'
import { Button } from '@/components/Button/Button'
import { PlusIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline'
import { UploadButton } from '@/components/Button/UploadButton'

export function ButtonVariantsDemo() {
  return (
    <div className="flex flex-wrap gap-2 mt-4 h-full">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="danger">Danger</Button>
      <Button disabled>Disabled</Button>
    </div>
  )
}

export function ButtonSizesDemo() {
  return (
    <div className="flex flex-wrap items-end gap-2 mt-4 h-full">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">XL</Button>
      <Button size="2xl">2XL</Button>
    </div>
  )
}

export function ButtonIconsDemo() {
  const iconPlus = (
    <PlusIcon className="w-4 h-4" />
  )
  return (
    <div className="flex flex-wrap gap-2 mt-4 h-full">
      <Button icon={iconPlus} aria-label="Add" />
      <Button icon={iconPlus} value="Add" />
      <Button icon={iconPlus} value="Create" variant="secondary" />
      <Button icon={iconPlus} value="Delete" variant="danger" />
    </div>
  )
}

export function ButtonLoadingDemo() {
  return (
    <div className="flex flex-wrap gap-2 mt-4 h-full">
      <Button isLoading>Loading</Button>
      <Button isLoading loadingText="Saving..." variant="secondary" />
      <Button isLoading loadingText="Deleting..." variant="danger" />
    </div>
  )
}



export function ButtonUploadDemo() {
  const [files, setFiles] = React.useState<File[]>([])
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(Array.from(e.target.files ?? []))
    e.currentTarget.value = ''
  }

  const iconUpload = <ArrowUpTrayIcon className="w-4 h-4" />

  return (
    <div className="grid gap-3 mt-4">
      <div className="flex items-center gap-2">
        <div className="relative inline-block">
          <Button icon={iconUpload} aria-label="Upload" />
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept="*"
            multiple
            onChange={handleChange}
            aria-label="Upload"
          />
        </div>

        <div className="relative inline-block">
          <Button variant="secondary">Upload files</Button>
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept="*"
            multiple
            onChange={handleChange}
            aria-label="Upload"
          />
        </div>
      </div>
      {files.length > 0 && (
        <ul className="text-sm text-gray-600 list-disc pl-5">
          {files.map((f) => (
            <li key={f.name}>{f.name}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function UploadButtonWithComponentDemo() {
  const [files, setFiles] = React.useState<File[]>([])
  return (
    <div className="grid gap-3 mt-4">
      <div className="flex items-center gap-2">
        <UploadButton
          aria-label="Upload"
          accept="image/*"
          multiple
          onFilesSelected={setFiles}
          icon={<ArrowUpTrayIcon className="w-4 h-4" />}
        />
        <UploadButton
          variant="secondary"
          value="Upload images"
          accept="image/*"
          multiple
          onFilesSelected={setFiles}
        />
      </div>
      {files.length > 0 && (
        <ul className="text-sm text-gray-600 list-disc pl-5">
          {files.map((f) => (
            <li key={f.name}>{f.name}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
