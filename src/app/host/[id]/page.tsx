'use client'

import { CompetitionsTable } from '@/components/host/competitions-table'
import { MatchesTable } from '@/components/host/matches-table'
import { PreordersTable } from '@/components/host/preorders-table'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { urlToPoolMap } from '@/helpers'
import { useClub } from '@/hooks/use-club'
import { useCompetition } from '@/hooks/use-competition'
import { useMatch } from '@/hooks/use-match'
import { usePreorder } from '@/hooks/use-preorder'
import { useToast } from '@/hooks/use-toast'
import MainLayout from '@/layouts/main'
import { Club, Competition, Match, Preorder } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { DialogOverlay } from '@radix-ui/react-dialog'
import { SelectItem } from '@radix-ui/react-select'
import { TabsContent } from '@radix-ui/react-tabs'
import { format } from 'date-fns'
import { Calendar1, Mail, MapPin } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const Page = () => {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [preorders, setPreorders] = useState<Preorder[]>()
  const [matches, setMatches] = useState<Match[]>()
  const [competitions, setCompetitions] = useState<Competition[]>()
  const [preorderStatus, setPreorderStatus] = useState<string | null>(null)
  const [matchStatus, setMatchStatus] = useState<string | null>(null)
  const [competitionStatus, setCompetitionStatus] = useState<string | null>(
    null
  )
  const [club, setClub] = useState<Club>()
  const { getPreordersForClub } = usePreorder()
  const { getClub } = useClub()
  const { getMatchesForClub } = useMatch()
  const { getCompetitionsForClub, createCompetition } = useCompetition()
  const [isDialogLoading, setIsDialogLoading] = useState<boolean>(false)
  const { toast } = useToast()

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

  const fetchCompetitions = async (status?: string) => {
    const res = await getCompetitionsForClub(Number(params.id), status)
    if (res) {
      setCompetitions(res)
    }
  }

  const fetchMatches = async (status?: string) => {
    const res = await getMatchesForClub(Number(params.id), status)
    if (res) {
      setMatches(res)
    }
  }

  useEffect(() => {
    fetchClub()
    fetchCompetitions()
  }, [])

  useEffect(() => {
    fetchPreorders(preorderStatus?.trim())
  }, [preorderStatus])

  useEffect(() => {
    fetchMatches(matchStatus?.trim())
  }, [matchStatus])

  useEffect(() => {
    fetchCompetitions(competitionStatus?.trim())
  }, [competitionStatus])

  const hostStatusOptions = [
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

  const hostCompetitionStatusOptions = [
    {
      label: 'Tất cả',
      value: ' '
    },
    {
      label: 'Đang mở',
      value: 'open'
    },
    {
      label: 'Đang diễn ra',
      value: 'in progress'
    },
    {
      label: 'Kết thúc',
      value: 'completed'
    },
    {
      label: 'Hủy bỏ',
      value: 'canceled'
    }
  ]

  const schema = z.object({
    name: z.string(),
    startTime: z.date(),
    endTime: z.date()
  })

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      startTime: new Date(),
      endTime: new Date()
    }
  })

  const submit = async (values: z.infer<typeof schema>) => {
    setIsDialogLoading(true)
    if (values.startTime > values.endTime) {
      toast({
        title: 'Ngày kết thúc không được trước ngày bắt đầu',
        variant: 'destructive'
      })
      return
    }

    await createCompetition(
      values.name,
      Number(params.id),
      values.startTime,
      values.endTime
    )
    setIsDialogLoading(false)
  }

  const tabs = [
    {
      label: 'Đơn đặt trước',
      value: 'preorders'
    },
    {
      label: 'Các trận đấu',
      value: 'matches'
    },
    {
      label: 'Các giải đấu',
      value: 'competitions'
    }
  ]

  return (
    <MainLayout>
      <div className="mx-auto mt-10 flex w-[1280px] max-w-full flex-col gap-8">
        <div className="flex w-full flex-col">
          {club && (
            <>
              <h1 className="text-3xl font-bold">{club.name}</h1>
              <Link
                href={urlToPoolMap({ lat: club.lat, lon: club.lon })}
                target="_blank"
                className="mt-4 flex items-center gap-2 text-lg"
              >
                <MapPin />
                <span>{club.address}</span>
              </Link>
              <div className="mt-4 flex items-center gap-2 text-lg">
                <Mail />
                <span>{club.host_email}</span>
              </div>
            </>
          )}
        </div>

        <Tabs defaultValue={searchParams.get('tab') || 'preorders'}>
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
          <TabsContent value="preorders">
            <Select
              value={preorderStatus || ''}
              onValueChange={(value) => setPreorderStatus(value)}
            >
              <SelectTrigger className="my-4 w-[180px]">
                <SelectValue placeholder="Trạng thái">
                  {!preorderStatus
                    ? 'Trạng thái'
                    : hostStatusOptions.find((e) => e.value === preorderStatus)
                        ?.label}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {hostStatusOptions.map((option) => (
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
          <TabsContent value="matches">
            <Select
              value={matchStatus || ''}
              onValueChange={(value) => setMatchStatus(value)}
            >
              <SelectTrigger className="my-4 w-[180px]">
                <SelectValue placeholder="Trạng thái">
                  {!matchStatus
                    ? 'Trạng thái'
                    : hostStatusOptions.find((e) => e.value === matchStatus)
                        ?.label}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {hostStatusOptions.map((option) => (
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
            <MatchesTable matches={matches || []} />
          </TabsContent>
          <TabsContent value="competitions">
            <Select
              value={competitionStatus || ''}
              onValueChange={(value) => setCompetitionStatus(value)}
            >
              <SelectTrigger className="my-4 w-[180px]">
                <SelectValue placeholder="Trạng thái">
                  {!competitionStatus
                    ? 'Trạng thái'
                    : hostCompetitionStatusOptions.find(
                        (e) => e.value === competitionStatus
                      )?.label}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {hostCompetitionStatusOptions.map((option) => (
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
            <CompetitionsTable competitions={competitions || []} />
            <Dialog>
              <DialogTrigger asChild>
                <Button>Tạo giải đấu mới</Button>
              </DialogTrigger>
              <DialogOverlay className="fixed inset-0 bg-black bg-opacity-50" />
              <DialogContent className="fixed left-1/2 top-1/2 w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-6 shadow-lg">
                <DialogTitle>Giải đấu mới</DialogTitle>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(submit)}
                    className="flex flex-col gap-4"
                  >
                    <FormField
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên giải đấu</FormLabel>
                          <FormControl>
                            <Input placeholder="Nhập tên giải đấu" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <div className="flex gap-4">
                      <FormField
                        name="startTime"
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-6">
                            <FormLabel>Bắt đầu</FormLabel>
                            <FormControl>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button variant="ghost">
                                    <Calendar1 />
                                    {format(field.value, 'dd/MM/yyyy')}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="rounded-lg border border-gray-300 bg-white shadow">
                                  <Calendar
                                    mode="single"
                                    {...field}
                                    initialFocus
                                    onSelect={(value) =>
                                      form.setValue(
                                        'startTime',
                                        value || new Date()
                                      )
                                    }
                                  />
                                </PopoverContent>
                              </Popover>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        name="endTime"
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-6">
                            <FormLabel>Kết thúc</FormLabel>
                            <FormControl>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button variant="ghost">
                                    <Calendar1 />
                                    {format(field.value, 'dd/MM/yyyy')}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="rounded-lg border border-gray-300 bg-white shadow">
                                  <Calendar
                                    mode="single"
                                    {...field}
                                    initialFocus
                                    onSelect={(value) =>
                                      form.setValue(
                                        'endTime',
                                        value || new Date()
                                      )
                                    }
                                  />
                                </PopoverContent>
                              </Popover>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button type="submit" disabled={isDialogLoading}>
                      Tạo
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}

export default Page
