export type FormSwitchProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
}


