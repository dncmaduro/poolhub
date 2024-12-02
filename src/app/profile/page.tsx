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
import { useDispatch, useSelector } from 'react-redux'
import { z } from 'zod'
import Leaflet from 'leaflet'
import Map from '@/components/map'
import { setProfile as setNewProfile } from '@/store/profileSlice'

const Page = () => {
  const [profile, setProfile] = useState<Profile>()
  const { getProfile, updateProfile } = useProfile()
  const email = useSelector((state: RootState) => state.profile.email)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [currLocation, setCurrLocation] = useState<Leaflet.LatLng | undefined>()
  const dispatch = useDispatch()

  const schema = z.object({
    email: z.string().email(),
    name: z.string(),
    point: z.coerce.number(),
    role: z.string(),
    phone: z.string().optional(),
    birthyear: z.coerce.number().optional(),
    lat: z.coerce.number(),
    lon: z.coerce.number(),
    address: z.string()
  })

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: profile?.name,
      name: '',
      point: 0,
      role: '',
      phone: '',
      birthyear: 0,
      lat: 0,
      lon: 0,
      address: ''
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
        birthyear: res.birthyear || 0,
        lat: res.lat || 0,
        lon: res.lon || 0,
        address: res.address || ''
      })
      setCurrLocation({
        lat: res.lat,
        lng: res.lon
      } as Leaflet.LatLng)
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
      birthyear: profile?.birthyear || 0,
      lat: profile?.lat || 0,
      lon: profile?.lon || 0,
      address: profile?.address || ''
    })
    setCurrLocation({
      lat: profile?.lat,
      lng: profile?.lon
    } as Leaflet.LatLng)
  }

  const submit = async (values: z.infer<typeof schema>) => {
    setIsLoading(true)
    const res = await updateProfile(
      values.email,
      values.name,
      values.phone,
      values.birthyear,
      values.lat,
      values.lon,
      values.address
    )
    if (res) {
      setProfile(res)
      setIsEditing(false)
      fetchProfile()
      dispatch(setNewProfile(res))
    }
    setIsLoading(false)
  }

  useEffect(() => {
    form.setValue('lat', currLocation?.lat || 0)
    form.setValue('lon', currLocation?.lng || 0)
  }, [currLocation, form])

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
              <FormField
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Địa chỉ</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Địa chỉ của bạn"
                        readOnly={!isEditing}
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {isEditing && email === profile?.email && (
                <div>
                  <span>
                    Click chọn điểm trên bản đồ để thêm địa chỉ rõ ràng
                  </span>
                  <Map
                    width={800}
                    height={600}
                    currLat={currLocation?.lat}
                    currLng={currLocation?.lng}
                    setLatLng={setCurrLocation}
                  />
                </div>
              )}
              {isEditing && email === profile?.email ? (
                <div className={`${isEditing && 'mt-[600px]'} z-20 flex gap-8`}>
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
                  className={`${isEditing && 'mt-[600px]'} w-[200px]`}
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
