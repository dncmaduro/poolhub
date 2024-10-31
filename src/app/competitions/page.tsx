'use client'

import { CompetitionBlock } from '@/components/home/competition-block'
import { useCompetition } from '@/hooks/use-competition'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import MainLayout from '@/layouts/main'
import { zodResolver } from '@hookform/resolvers/zod'
import { ReactNode, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const Page = () => {
  const [competitionBlocks, setCompetitionBlocks] = useState<ReactNode[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { searchCompetitions } = useCompetition()

  const fetchCompetitions = async (name?: string, clubs?: string) => {
    const res = await searchCompetitions(name, clubs)
    if (res) {
      setCompetitionBlocks(
        res.map((block) => (
          <CompetitionBlock
            key={block.id}
            id={block.id}
            name={block.name}
            place_id={block.place_id}
            className="mx-auto"
          />
        ))
      )
    }
  }

  useEffect(() => {
    fetchCompetitions()
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
    await fetchCompetitions(values.name, values.clubs)
    setIsLoading(false)
  }

  return (
    <MainLayout>
      <h1 className="mt-8 text-center text-2xl font-bold text-violet-400">
        Các giải đấu billiards
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
                  <Input placeholder="Nhập tên giải đấu muốn tìm" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="clubs"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên câu lạc bộ</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập tên quán thi đấu" {...field} />
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
        className={`mx-auto mt-8 grid w-[1280px] max-w-full grid-cols-3 gap-y-2 ${isLoading && 'pointer-events-none cursor-not-allowed opacity-50'}`}
      >
        {competitionBlocks}
      </div>
    </MainLayout>
  )
}

export default Page
