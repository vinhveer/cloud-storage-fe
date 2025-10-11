import { Button } from '@/components/Button'

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
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="w-4 h-4"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v14m-7-7h14" />
    </svg>
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


