'use client'

import Logo from '@/components/ui/logo'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'

const Header = () => {
  const name = useSelector((state: RootState) => state.profile.name)

  return (
    <div className="flex h-14 w-full items-center justify-between border border-gray-300 bg-white px-4 shadow-sm">
      <Logo />
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline">
          {name}
          <ChevronDown className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}

export default Header
