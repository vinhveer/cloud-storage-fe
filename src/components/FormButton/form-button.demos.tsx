import FormButton from '@/components/FormButton'

export function FormButtonVariantsDemo() {
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap gap-2">
        <FormButton variant="primary">Primary</FormButton>
        <FormButton variant="secondary">Secondary</FormButton>
        <FormButton variant="danger">Danger</FormButton>
        <FormButton variant="success">Success</FormButton>
        <FormButton variant="warning">Warning</FormButton>
      </div>
    </div>
  )
}

export function FormButtonSizesDemo() {
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-end gap-2">
        <FormButton size="sm">Small</FormButton>
        <FormButton size="md">Medium</FormButton>
        <FormButton size="lg">Large</FormButton>
        <FormButton size="xl">X-Large</FormButton>
      </div>
    </div>
  )
}

export function FormButtonDisabledDemo() {
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap gap-2">
        <FormButton disabled>Disabled</FormButton>
        <FormButton variant="secondary" disabled>
          Disabled Secondary
        </FormButton>
      </div>
    </div>
  )
}


