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
import { useProfile } from '@/hooks/use-profile'
import MainLayout from '@/layouts/main'
import { RootState } from '@/store'
import { Profile } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { z } from 'zod'

const Page = () => {
  const [profile, setProfile] = useState<Profile>()
  const { getProfile, updateProfile } = useProfile()
  const email = useSelector((state: RootState) => state.profile.email)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

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
    const res = await getProfile(email)
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

  const reset = () => {
    setIsEditing(false)
    form.reset({
      email: profile?.email,
      name: profile?.name,
      point: profile?.point || 0,
      role: profile?.role || '',
      phone: profile?.phone || '',
      birthyear: profile?.birthyear || 0
    })
  }

  const submit = async (values: z.infer<typeof schema>) => {
    setIsLoading(true)
    const res = await updateProfile(
      values.email,
      values.name,
      values.phone,
      values.birthyear
    )
    if (res) {
      setProfile(res)
      setIsEditing(false)
      fetchProfile()
    }
    setIsLoading(false)
  }

  return (
    <MainLayout>
      <div className="mx-auto flex w-[1280px] max-w-full flex-col">
        <h1 className="mt-10 text-center text-3xl font-bold">Hồ sơ</h1>
        <div className="mx-auto w-[800px] max-w-full">
          <Form {...form}>
            <form
              className="mx-auto mt-8 flex w-full flex-col gap-8"
              onSubmit={form.handleSubmit(submit)}
            >
              <FormField
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Email của bạn"
                        readOnly={!isEditing}
                        disabled={isEditing || isLoading}
                        {...field}
                      />
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
                      <Input
                        placeholder="Tên của bạn"
                        readOnly={!isEditing}
                        disabled={isLoading}
                        {...field}
                      />
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
                      <Input
                        readOnly={!isEditing}
                        disabled={isEditing || isLoading}
                        {...field}
                      />
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
                      <Input
                        readOnly={!isEditing}
                        disabled={isEditing || isLoading}
                        {...field}
                      />
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
                      <Input
                        placeholder="Số điện thoại của bạn"
                        readOnly={!isEditing}
                        disabled={isLoading}
                        {...field}
                      />
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
                      <Input
                        placeholder="Năm sinh của bạn"
                        readOnly={!isEditing}
                        disabled={isLoading}
                        {...field}
                        type="number"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {isEditing ? (
                <div className="flex gap-8">
                  <Button className="w-[200px]" disabled={isLoading}>
                    Cập nhật
                  </Button>
                  <Button
                    className="w-[200px]"
                    variant="outline"
                    onClick={() => reset()}
                    disabled={isLoading}
                  >
                    Hủy
                  </Button>
                </div>
              ) : (
                <Button
                  className="w-[200px]"
                  type="button"
                  onClick={() => setIsEditing(true)}
                >
                  Cập nhật hồ sơ
                </Button>
              )}
            </form>
          </Form>
        </div>
      </div>
    </MainLayout>
  )
}

export default Page
