'use client'

import { Club } from '@/types'
import { CompetitionBlock } from '@/components/home/competition-block'
import { MatchBlock } from '@/components/home/match-block'
import { Button } from '@/components/ui/button'
import { useClub } from '@/hooks/use-club'
import { useCompetition } from '@/hooks/use-competition'
import { useMatch } from '@/hooks/use-match'
import MainLayout from '@/layouts/main'
import { Calendar1, Mail, MapPin } from 'lucide-react'
import { useParams } from 'next/navigation'
import { ReactNode, useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogOverlay
} from '@radix-ui/react-dialog'
import { DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormControl
} from '@/components/ui/form'
import { Calendar } from '@/components/ui/calendar'
import { Popover } from '@/components/ui/popover'
import { PopoverContent, PopoverTrigger } from '@radix-ui/react-popover'
import { format } from 'date-fns'
import { usePreorder } from '@/hooks/use-preorder'
import Link from 'next/link'
import { urlToPoolMap } from '@/helpers'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'

const Page = () => {
  const params = useParams()
  const [club, setClub] = useState<Club>()
  const [competitionBlocks, setCompetitionBlocks] = useState<ReactNode[]>()
  const [matchBlocks, setMatchBlocks] = useState<ReactNode[]>()
  const { getClub } = useClub()
  const { getCompetitionsForClub } = useCompetition()
  const { getMatchesForClub } = useMatch()
  const { createPreorder } = usePreorder()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const address = useSelector((state: RootState) => state.profile.address)

  useEffect(() => {
    const fetchClub = async () => {
      const res = await getClub(Number(params.id), true)
      if (res) {
        setClub(res)
      }
    }

    const fetchCompetitons = async () => {
      const res = await getCompetitionsForClub(Number(params.id))
      if (res) {
        setCompetitionBlocks(
          res.map((block) => (
            <CompetitionBlock
              key={block.id}
              id={block.id}
              name={block.name}
              place_id={block.place_id}
              className="mx-auto mt-8"
              startTime={block.startTime}
              endTime={block.endTime}
            />
          ))
        )
      }
    }

    const fetchMatches = async () => {
      const res = await getMatchesForClub(Number(params.id))
      if (res) {
        setMatchBlocks(
          res.map((match) => (
            <MatchBlock
              key={match.id}
              id={match.id}
              status={match.status}
              player1_id={match.player1_id}
              player2_id={match.player2_id}
              date={match.date}
              place_id={match.place_id}
              point1={match.point1}
              point2={match.point2}
              className="mx-auto mt-8"
            />
          ))
        )
      }
    }

    fetchClub()
    fetchCompetitons()
    fetchMatches()
  }, [])

  const schema = z.object({
    time: z.date()
  })

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      time: new Date()
    }
  })

  const submit = async (values: z.infer<typeof schema>) => {
    setIsLoading(true)
    await createPreorder(club?.id || 0, values.time)
    setIsLoading(false)
  }

  console.log(address)

  return (
    <MainLayout>
      <div className="mx-auto mt-10 flex w-[1280px] max-w-full gap-8">
        <div className="flex w-1/2 flex-col">
          {club && (
            <>
              <h1 className="text-3xl font-bold">{club.name}</h1>
              <Link
                className="mt-4 flex items-center gap-2 text-lg"
                href={urlToPoolMap({ lat: club.lat, lon: club.lon })}
                target="_blank"
              >
                <MapPin />
                <span>{club.address}</span>
              </Link>
              <Link
                href={urlToPoolMap(address, { lat: club.lat, lon: club.lon })}
              >
                <Button size="sm" className="mt-4">
                  Xem đường đi
                </Button>
              </Link>
              <div className="mt-4 flex items-center gap-2 text-lg">
                <Mail />
                <span>{club.host_email}</span>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="mt-10">Đặt chỗ trước</Button>
                </DialogTrigger>
                <DialogOverlay className="fixed inset-0 bg-black bg-opacity-50" />
                <DialogContent className="fixed left-1/2 top-1/2 w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-6 shadow-lg">
                  <DialogTitle>Đặt chỗ</DialogTitle>
                  <DialogHeader className="mt-4">
                    Câu lạc bộ: {club.name} - {club.address}
                  </DialogHeader>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(submit)}
                      className="mt-10"
                    >
                      <FormField
                        name="time"
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-6">
                            <FormLabel>Thời gian</FormLabel>
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
                                      form.setValue('time', value || new Date())
                                    }
                                  />
                                </PopoverContent>
                              </Popover>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="mt-4"
                      >
                        Submit
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
        <div className="ml-auto flex flex-col">
          <span>Các giải đấu đang diễn ra tại câu lạc bộ này</span>
          {competitionBlocks}
          <span className="mt-12">
            Các trận đấu đang diễn ra tại câu lạc bộ này
          </span>
          {matchBlocks}
        </div>
      </div>
    </MainLayout>
  )
}

export default Page
