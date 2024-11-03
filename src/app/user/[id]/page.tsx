'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useMatch } from '@/hooks/use-match'
import { useProfile } from '@/hooks/use-profile'
import MainLayout from '@/layouts/main'
import { RootState } from '@/store'
import { Profile } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { z } from 'zod'

const Page = () => {
  const [profile, setProfile] = useState<Profile>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { getProfile, getProfileById } = useProfile()
  const params = useParams()
  const router = useRouter()
  const { createMatch } = useMatch()
  const email = useSelector((state: RootState) => state.profile.email)

  const schema = z.object({
    email: z.string().email(),
    name: z.string(),
    point: z.coerce.number(),
    role: z.string(),
    phone: z.string().optional(),
    birthyear: z.coerce.number().optional()
  })

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: profile?.name,
      name: '',
      point: 0,
      role: '',
      phone: '',
      birthyear: 0
    }
  })

  const fetchProfile = async () => {
    const res = await getProfileById(Number(params.id))
    if (res) {
      setProfile(res)
      form.reset({
        email: res.email,
        name: res.name,
        point: res.point || 0,
        role: res.role || '',
        phone: res.phone || '',
        birthyear: res.birthyear || 0
      })
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const newMatch = async () => {
    setIsLoading(true)
    const res = await getProfile(email)
    if (res) {
      const resMatch = await createMatch(res.id, Number(params.id))
      if (resMatch) {
        router.push('/matches')
      }
    }
    setIsLoading(false)
  }

  return (
    <MainLayout>
      <div className="mx-auto flex w-[1280px] max-w-full flex-col">
        <h1 className="mt-10 text-center text-3xl font-bold">Hồ sơ</h1>
        <div className="mx-auto mt-8 flex w-[800px] max-w-full flex-col gap-8">
          <Form {...form}>
            <FormField
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input readOnly {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên</FormLabel>
                  <FormControl>
                    <Input readOnly {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="point"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Điểm tích lũy</FormLabel>
                  <FormControl>
                    <Input readOnly {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loại tài khoản</FormLabel>
                  <FormControl>
                    <Input readOnly {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input readOnly {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="birthyear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Năm sinh</FormLabel>
                  <FormControl>
                    <Input readOnly {...field} type="number" />
                  </FormControl>
                </FormItem>
              )}
            />
          </Form>
          <Button
            className="w-fit"
            onClick={() => newMatch()}
            disabled={isLoading}
          >
            <Plus />
            Tạo trận mới với người chơi này{' '}
          </Button>
        </div>
      </div>
    </MainLayout>
  )
}

export default Page
