'use client'

import Logo from '@/components/ui/logo'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
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
import { clearProfile } from '@/store/profileSlice'
import { useRouter } from 'next/navigation'
import { AddressModal } from '../header/address'

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
      label: 'Quản lý tài khoản',
      href: '/accounts',
      role: 'admin'
    }
  ]

  const dispatch = useDispatch()
  const router = useRouter()

  const logout = () => {
    dispatch(clearProfile())
    router.push('/login')
  }

  return (
    <div className="sticky top-0 flex h-14 w-full items-center justify-between rounded-b-2xl border border-gray-300 bg-white px-4 shadow-sm">
      <div className="flex items-center gap-4">
        <Logo />
        <AddressModal />
      </div>
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
              <span className="text-gray-400">({role})</span>
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[120px]">
            <Link href="/profile">
              <Button variant="ghost" size="sm" className="w-full">
                Hồ sơ
              </Button>
            </Link>
            <Link href="/host">
              <Button variant="ghost" size="sm" className="w-full">
                Trang quản lý
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-red-500 hover:text-red-500"
              onClick={() => logout()}
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
