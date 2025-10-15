import Alert from '@/components/Alert/Alert'

export function AlertBasicDemo() {
  return (
    <div className="space-y-1">
      <Alert heading="Information" message="This is an informational alert." />
      <Alert type="success" heading="Success" message="Everything worked!" />
      <Alert type="warning" heading="Warning" message="Be careful with this action." />
      <Alert type="error" heading="Error" message="Something went wrong." />
    </div>
  )
}

export function AlertCustomContentDemo() {
  return (
    <Alert type="info" heading="Heads up!">
      <p>We just updated our policy. Please review the changes.</p>
    </Alert>
  )
}