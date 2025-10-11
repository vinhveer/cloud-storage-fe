import Code from '@/components/Code'

export function CodeBasicDemo() {
  return (
    <Code code={`function add(a: number, b: number) {\n  return a + b\n}`} language="ts" />
  )
}

export function CodeHeaderToggleDemo() {
  return (
    <div className="space-y-2">
      <Code code={`console.log('with header')`} language="ts" showHeader />
      <Code code={`console.log('no header')`} language="ts" showHeader={false} />
    </div>
  )
}


