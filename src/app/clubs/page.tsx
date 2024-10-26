'use client'

import { ClubBlock } from '@/components/home/club-block'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useClub } from '@/hooks/use-club'
import MainLayout from '@/layouts/main'
import { zodResolver } from '@hookform/resolvers/zod'
import { ReactNode, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const Page = () => {
  const [clubBlocks, setClubBlocks] = useState<ReactNode[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { searchClubs } = useClub()

  const fetchClubs = async (name?: string, address?: string) => {
    const res = await searchClubs(name, address)
    if (res) {
      setClubBlocks(
        res.map((block) => (
          <ClubBlock
            key={block.id}
            id={block.id}
            name={block.name}
            address={block.address}
            email={block.email}
            className="mx-auto"
          />
        ))
      )
    }
  }

  useEffect(() => {
    fetchClubs()
  }, [])

  const schema = z.object({
    name: z.string().optional(),
    address: z.string().optional()
  })

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      address: ''
    }
  })

  const submit = async (values: z.infer<typeof schema>) => {
    setIsLoading(true)
    await fetchClubs(values.name, values.address)
    setIsLoading(false)
  }

  return (
    <MainLayout>
      <h1 className="mt-8 text-center text-2xl font-bold text-violet-400">
        Các câu lạc bộ billiards
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
        className={`mx-auto mt-8 grid w-[1280px] max-w-full grid-cols-3 gap-y-2 ${isLoading && 'pointer-events-none cursor-not-allowed opacity-50'}`}
      >
        {clubBlocks}
      </div>
    </MainLayout>
  )
}

export default Page
