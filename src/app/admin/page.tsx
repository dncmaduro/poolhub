'use client'

import { ClubTab } from '@/components/admin/club-tab'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useClub } from '@/hooks/use-club'
import { AdminLayout } from '@/layouts/admin'
import MainLayout from '@/layouts/main'
import { Club } from '@/types'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const Page = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [clubs, setClubs] = useState<Club[]>([])

  const { searchClubs } = useClub()

  const tabs = [
    {
      label: 'Các câu lạc bộ',
      value: 'clubs'
    }
  ]

  useEffect(() => {
    const fetchClubs = async () => {
      const res = await searchClubs()
      if (res) {
        setClubs(res)
      }
    }

    fetchClubs()
  }, [])

  return (
    <MainLayout>
      <AdminLayout>
        <div className="mx-auto mt-10 flex w-[1280px] max-w-full flex-col gap-8">
          <span className="text-xl font-bold">Trang admin</span>
          <Tabs defaultValue={searchParams.get('tab') || 'clubs'}>
            <TabsList className="mb-4">
              {tabs.map((tab) => {
                const newParams = new URLSearchParams(window.location.search)
                newParams.set('tab', tab.value)

                return (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    onClick={() => router.push(`?${newParams.toString()}`)}
                  >
                    {tab.label}
                  </TabsTrigger>
                )
              })}
            </TabsList>
            <TabsContent value="clubs">
              <ClubTab clubs={clubs} />
            </TabsContent>
          </Tabs>
        </div>
      </AdminLayout>
    </MainLayout>
  )
}

export default Page
