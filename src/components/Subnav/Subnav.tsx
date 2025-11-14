import { NavGroup } from '@/components/NavGroup/NavGroup'
import type { NavGroupProps, NavItem } from '@/components/NavGroup/types'

export type SubnavItem = NavItem
export type SubnavProps = NavGroupProps

export function Subnav(props: SubnavProps) {
  return <NavGroup {...props} />
}

export default Subnav
