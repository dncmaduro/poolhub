'use client'

import { RootState } from '@/store'
import { useRouter } from 'next/navigation'
import { ReactNode, useEffect } from 'react'
import { useSelector } from 'react-redux'

interface LayoutProps {
  children: ReactNode
}

export const AdminLayout = (props: LayoutProps) => {
  const role = useSelector((state: RootState) => state.profile.role)
  const router = useRouter()

  useEffect(() => {
    if (role !== 'admin') {
      router.push('/home')
    }
  }, [])

  return <>{props.children}</>
}
