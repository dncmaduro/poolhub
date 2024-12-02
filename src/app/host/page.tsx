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
import Map from '@/components/map'
import Leaflet from 'leaflet'

const Page = () => {
  const email = useSelector((state: RootState) => state.profile.email)
  const [clubBlocks, setClubBlocks] = useState<ReactNode[]>()
  const { getHostClubs, createClub } = useClub()
  const [isDialogLoading, setIsDialogLoading] = useState<boolean>(false)
  const [currLocation, setCurrLocation] = useState<Leaflet.LatLng | undefined>()

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
    await createClub(email, values.name, values.address, values.lat, values.lon)
    await fetchClubs()
    setIsDialogLoading(false)
  }

  useEffect(() => {
    form.setValue('lat', currLocation?.lat || 0)
    form.setValue('lon', currLocation?.lng || 0)
  }, [currLocation, form])

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
            <DialogContent className="fixed left-1/2 top-1/2 flex h-[600px] w-[700px] max-w-[700px] flex-col rounded-md bg-white p-6 shadow-lg">
              <DialogTitle className="h-fit max-h-fit">
                Câu lạc bộ mới
              </DialogTitle>
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
                  <div>
                    <span>
                      Click chọn điểm trên bản đồ để thêm địa chỉ rõ ràng
                    </span>
                    <Map
                      width={650}
                      height={300}
                      currLat={currLocation?.lat}
                      currLng={currLocation?.lng}
                      setLatLng={setCurrLocation}
                    />
                  </div>
                  <Button
                    disabled={isDialogLoading}
                    className="mb-4 mt-[300px]"
                    style={{ zIndex: '1' }}
                  >
                    Tạo
                  </Button>
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
