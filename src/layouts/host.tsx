'use client'

import { Sidebar } from '@/components/host/sidebar'
import MainLayout from './main'
import { ReactNode, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'

interface HostLayoutProps {
  children: ReactNode
}

export const HostLayout = (props: HostLayoutProps) => {
  const { toast } = useToast()
  const router = useRouter()

  const role = useSelector((state: RootState) => state.profile.role)

  useEffect(() => {
    if (role !== 'host') {
      router.push('/home')
      toast({
        title: 'Bạn không có quyền truy cập trang của quản lý'
      })
    }
  }, [role, router, toast])

  return (
    <MainLayout>
      <div className="flex h-full overflow-hidden">
        <Sidebar />
        <div className="grow">{props.children}</div>
      </div>
    </MainLayout>
  )
}
