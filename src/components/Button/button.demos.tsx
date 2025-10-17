import { Button } from '@/components/Button/Button'
import { PlusIcon } from '@heroicons/react/24/outline'

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


