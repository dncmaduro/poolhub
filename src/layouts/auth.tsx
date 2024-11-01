'use client'

import Logo from '@/components/ui/logo'
import { RootState } from '@/store'
import { useRouter } from 'next/navigation'
import { ReactNode, useEffect } from 'react'
import { useSelector } from 'react-redux'

interface LayoutProps {
  children: ReactNode
}

const AuthLayout = (props: LayoutProps) => {
  const email = useSelector((state: RootState) => state.profile.email)
  const router = useRouter()

  useEffect(() => {
    if (email) {
      router.push('/home')
    }
  }, [])

  return (
    <div className="relative flex h-screen w-screen">
      <div className="absolute left-6 top-4">
        <Logo />
      </div>
      <div className="mx-auto my-auto">{props.children}</div>
    </div>
  )
}

export default AuthLayout
