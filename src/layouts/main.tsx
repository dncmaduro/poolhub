'use client'

import Header from '@/components/layouts/header'
import { RootState } from '@/store'
import { useRouter } from 'next/navigation'
import { ReactNode, useEffect } from 'react'
import { useSelector } from 'react-redux'

interface MainLayoutProps {
  children: ReactNode
}

const MainLayout = (props: MainLayoutProps) => {
  const email = useSelector((state: RootState) => state.profile.email)
  const router = useRouter()

  useEffect(() => {
    if (!email) {
      router.push('/login')
    }
  }, [])

  return (
    <div className="h-screen w-screen">
      <Header />
      <div className="w-full">{props.children}</div>
    </div>
  )
}

export default MainLayout
