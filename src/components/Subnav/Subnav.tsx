import { NavGroup, type NavGroupProps, type NavItem } from '@/components/NavGroup/NavGroup'

export type SubnavItem = NavItem
export type SubnavProps = NavGroupProps

export function Subnav(props: SubnavProps) {
  return <NavGroup {...props} />
}

export default Subnav
