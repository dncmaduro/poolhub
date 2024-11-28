import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog'
import { Button } from '../ui/button'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form'
import { Input } from '../ui/input'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { useProfile } from '@/hooks/use-profile'
import { isAddressFilled } from '@/helpers'

export const AddressModal = () => {
  const [isLoading, setIsLoading] = useState(false)
  const address = useSelector((state: RootState) => state.profile.address)
  const email = useSelector((state: RootState) => state.profile.email)
  const { updateAddress } = useProfile()

  const schema = z.object({
    lat: z.coerce.number(),
    lon: z.coerce.number()
  })

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      lat: address.lat || 0,
      lon: address.lon || 0
    }
  })

  const submit = async (values: z.infer<typeof schema>) => {
    setIsLoading(true)
    await updateAddress(email, values.lat, values.lon)
    setIsLoading(false)
    window.location.reload()
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Button size="sm" variant="outline">
          {isAddressFilled(address)
            ? 'Cập nhật vị trí'
            : 'Điền vị trí để sử dụng chức năng xem đường đi'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Điền vị trí của bạn</DialogTitle>
          <DialogDescription>
            Bạn có thể vào trang bản đồ bất kì để lấy tọa độ của bạn và điền vào
            đây
          </DialogDescription>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(submit)}
              className="flex flex-col gap-4"
            >
              <FormField
                name="lat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vĩ độ</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} disabled={isLoading} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="lon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kinh độ</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} disabled={isLoading} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="secondary"
              onClick={() => {
                form.reset()
              }}
              disabled={isLoading}
            >
              Hủy
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={form.handleSubmit(submit)} disabled={isLoading}>
              Lưu
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
