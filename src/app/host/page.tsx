'use client'

import { HostClubBlock } from '@/components/host/club-block'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogOverlay,
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
import { useClub } from '@/hooks/use-club'
import MainLayout from '@/layouts/main'
import { RootState } from '@/store'
import { zodResolver } from '@hookform/resolvers/zod'
import { ReactNode, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { z } from 'zod'

const Page = () => {
  const email = useSelector((state: RootState) => state.profile.email)
  const [clubBlocks, setClubBlocks] = useState<ReactNode[]>()
  const { getHostClubs, createClub } = useClub()
  const [isDialogLoading, setIsDialogLoading] = useState<boolean>(false)

  const fetchClubs = async () => {
    const res = await getHostClubs(email)
    if (res) {
      setClubBlocks(
        res.map((block) => (
          <HostClubBlock
            key={block.id}
            id={block.id}
            name={block.name}
            address={block.address}
            email={block.host_email}
          />
        ))
      )
    }
  }

  const schema = z.object({
    name: z.string(),
    address: z.string(),
    lat: z.coerce.number(),
    lon: z.coerce.number()
  })

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      address: '',
      lat: 0,
      lon: 0
    }
  })

  const submit = async (values: z.infer<typeof schema>) => {
    setIsDialogLoading(true)
    await createClub(email, values.name, values.address)
    await fetchClubs()
    setIsDialogLoading(false)
  }

  useEffect(() => {
    fetchClubs()
  }, [])

  return (
    <MainLayout>
      <div className="mx-10 mt-10">
        <div className="flex gap-4">
          <span className="text-2xl font-bold">Các câu lạc bộ của bạn</span>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Tạo câu lạc bộ mới</Button>
            </DialogTrigger>
            <DialogOverlay className="fixed inset-0 bg-black bg-opacity-50" />
            <DialogContent className="fixed left-1/2 top-1/2 w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-6 shadow-lg">
              <DialogTitle>Câu lạc bộ mới</DialogTitle>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(submit)}
                  className="flex flex-col gap-4"
                >
                  <FormField
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên câu lạc bộ</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập tên câu lạc bộ" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Địa chỉ</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập địa chỉ" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="lat"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Địa chỉ</FormLabel>
                        <FormControl>
                          <Input placeholder="Vĩ độ" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="lon"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Địa chỉ</FormLabel>
                        <FormControl>
                          <Input placeholder="Kinh độ" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button disabled={isDialogLoading}>Tạo</Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="mt-10 flex flex-wrap gap-4">{clubBlocks}</div>
      </div>
    </MainLayout>
  )
}

export default Page
