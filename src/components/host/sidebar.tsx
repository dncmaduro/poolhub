'use client'

import Link from 'next/link'
import { Button } from '../ui/button'
import { useEffect, useState } from 'react'

interface MenuItemProps {
  href: string
  label: string
  isActive: boolean
}

const MenuItem = (props: MenuItemProps) => {
  return (
    <>
      {props.isActive ? (
        <Button
          variant="ghost"
          className="rouned-lg w-full cursor-default bg-gray-200"
        >
          {props.label}
        </Button>
      ) : (
        <Link href={props.href}>
          <Button variant="ghost" className="rouned-lg w-full">
            {props.label}
          </Button>
        </Link>
      )}
    </>
  )
}

export const Sidebar = () => {
  const [curHref, setCurHref] = useState<string>('')

  useEffect(() => {
    const location = window.location.pathname
    const hostpage = location.split('/host')[1]
    if (hostpage[0] === '/') {
      const subpage = hostpage.split('/')
      setCurHref(`/host/${subpage[1]}`)
    } else {
      setCurHref('')
    }
  }, [])

  const items = [
    {
      href: '/host/clubs',
      label: 'Câu lạc bộ'
    },
    {
      href: '/host/competitions',
      label: 'Giải đấu'
    },
    {
      href: '/host/matches',
      label: 'Trận đấu'
    }
  ]

  return (
    <div className="h-[500px] w-[160px] rounded-b-lg border-b-2 border-r border-gray-100 bg-white shadow">
      <div className="mx-4 mt-4 flex flex-col gap-2">
        {items.map((item) => (
          <MenuItem
            key={item.href}
            href={item.href}
            label={item.label}
            isActive={curHref === item.href}
          />
        ))}
      </div>
    </div>
  )
}
