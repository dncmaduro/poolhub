'use client'

import { PreordersTable } from '@/components/host/preorders-table'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useClub } from '@/hooks/use-club'
import { useCompetition } from '@/hooks/use-competition'
import { usePreorder } from '@/hooks/use-preorder'
import MainLayout from '@/layouts/main'
import { Club, Preorder } from '@/types'
import { SelectItem } from '@radix-ui/react-select'
import { TabsContent } from '@radix-ui/react-tabs'
import { Mail, MapPin } from 'lucide-react'
import { useParams } from 'next/navigation'
import { ReactNode, useEffect, useState } from 'react'

const Page = () => {
  const params = useParams()
  const [preorders, setPreorders] = useState<Preorder[]>()
  const [competitions, setCompetitions] = useState<ReactNode[]>()
  const [matchBlocks, setMatchBlocks] = useState<ReactNode[]>()
  const [status, setStatus] = useState<string | null>(null)
  const [club, setClub] = useState<Club>()
  const { getPreordersForClub } = usePreorder()
  const { getClub } = useClub()
  const { getCompetitionsForClub } = useCompetition()

  const fetchPreorders = async (status?: string) => {
    const res = await getPreordersForClub(Number(params.id), status)
    if (res) {
      setPreorders(res)
    }
  }

  const fetchClub = async () => {
    const res = await getClub(Number(params.id))
    if (res) {
      setClub(res)
    }
  }

  const fetchCompetitions = async () => {
    const res = await getCompetitionsForClub(Number(params.id))
    if (res) {
      setCompetitions(res)
    }
  }

  useEffect(() => {
    fetchClub()
    fetchCompetitions()
  }, [])

  useEffect(() => {
    fetchPreorders(status?.trim())
    console.log(
      !status
        ? 'Trạng thái'
        : statusOptions.find((e) => e.value === status)?.label
    )
  }, [status])

  const statusOptions = [
    {
      label: 'Tất cả',
      value: ' '
    },
    {
      label: 'Đang chờ',
      value: 'pending'
    },
    {
      label: 'Đã xác nhận',
      value: 'confirmed'
    },
    {
      label: 'Đã từ chối',
      value: 'declined'
    }
  ]

  return (
    <MainLayout>
      <div className="mx-auto mt-10 flex w-[1280px] max-w-full flex-col gap-8">
        <div className="flex w-full flex-col">
          {club && (
            <>
              <h1 className="text-3xl font-bold">{club.name}</h1>
              <div className="mt-4 flex items-center gap-2 text-lg">
                <MapPin />
                <span>{club.address}</span>
              </div>
              <div className="mt-4 flex items-center gap-2 text-lg">
                <Mail />
                <span>{club.host_email}</span>
              </div>
            </>
          )}
        </div>

        <Tabs defaultValue="preorders">
          <TabsList className="mb-4">
            <TabsTrigger value="preorders">Đơn đặt trước</TabsTrigger>
            <TabsTrigger value="matches">Các trận đấu</TabsTrigger>
            <TabsTrigger value="competitions">Các giải đấu</TabsTrigger>
          </TabsList>
          <TabsContent value="preorders">
            <Select
              value={status || ''}
              onValueChange={(value) => setStatus(value)}
            >
              <SelectTrigger className="my-4 w-[180px]">
                <SelectValue placeholder="Trạng thái">
                  {!status
                    ? 'Trạng thái'
                    : statusOptions.find((e) => e.value === status)?.label}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="text-black">
                <SelectGroup>
                  {statusOptions.map((option) => (
                    <SelectItem
                      className="h-[48px] cursor-pointer pt-3 text-center hover:bg-gray-100"
                      value={option.value}
                      key={option.value}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <PreordersTable preorders={preorders || []} />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}

export default Page
