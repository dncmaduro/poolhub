'use client'

import Logo from '@/components/ui/logo'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

const Header = () => {
  const name = useSelector((state: RootState) => state.profile.name)
  const role = useSelector((state: RootState) => state.profile.role)
  const menu = [
    {
      label: 'Xếp hạng',
      href: '/rankings'
    },
    {
      label: 'Trận đấu',
      href: '/matches'
    },
    {
      label: 'Câu lạc bộ',
      href: '/clubs'
    },
    {
      label: 'Quản lý câu lạc bộ',
      href: '/ownclub',
      role: 'host'
    },
    {
      label: 'Quản lý tài khoản',
      href: '/accounts',
      role: 'admin'
    }
  ]

  return (
    <div className="sticky top-0 flex h-14 w-full items-center justify-between rounded-b-2xl border border-gray-300 bg-white px-4 shadow-sm">
      <Logo />
      <div className="flex items-center gap-2">
        <NavigationMenu>
          <NavigationMenuList>
            {menu.map((item) => {
              return (
                (!item.role || item.role === role) && (
                  <NavigationMenuItem key={item.label}>
                    <Link href={item.href} legacyBehavior passHref>
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                      >
                        {item.label}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                )
              )
            })}
          </NavigationMenuList>
        </NavigationMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="outline">
              {name}
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[120px]">
            <Link href="/profile">
              <Button variant="ghost" size="sm" className="w-full">
                Hồ sơ
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-red-500 hover:text-red-500"
            >
              Đăng xuất
            </Button>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default Header
