'use client'

import { MatchBlock } from '@/components/home/match-block'
import { useMatch } from '@/hooks/use-match'
import MainLayout from '@/layouts/main'
import { zodResolver } from '@hookform/resolvers/zod'
import { ReactNode, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const Page = () => {
  const [matchBlocks, setMatchBlocks] = useState<ReactNode[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { searchMatches } = useMatch()

  const fetchMatches = async (name?: string, clubs?: string) => {
    const res = await searchMatches(name, clubs)
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
            className="mx-auto"
          />
        ))
      )
    }
  }

  useEffect(() => {
    fetchMatches()
  }, [])

  const schema = z.object({
    name: z.string().optional(),
    clubs: z.string().optional()
  })

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      clubs: ''
    }
  })

  const submit = async (values: z.infer<typeof schema>) => {
    setIsLoading(true)
    await fetchMatches(values.name, values.clubs)
    setIsLoading(false)
  }

  return (
    <MainLayout>
      <h1 className="mt-8 text-center text-2xl font-bold text-violet-400">
        Các trận đấu đang diễn ra
      </h1>
      <Form {...form}>
        <form
          className="mt-6 flex w-full items-end justify-center gap-4"
          onSubmit={form.handleSubmit(submit)}
        >
          <FormField
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên câu lạc bộ</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập tên muốn tìm" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên câu lạc bộ</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập địa chỉ quán" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            Tìm kiếm
          </Button>
        </form>
      </Form>
      <div
        className={`mx-auto mt-8 grid w-[1280px] max-w-full grid-cols-3 gap-y-4 ${isLoading && 'pointer-events-none cursor-not-allowed opacity-50'}`}
      >
        {matchBlocks}
      </div>
    </MainLayout>
  )
}

export default Page
