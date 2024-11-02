'use client'

import { NewMatchPlayer } from '@/components/match/new-match-player'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
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
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { z } from 'zod'

const Page = () => {
  const [profiles, setProfiles] = useState<Profile[]>()
  const [player, setPlayer] = useState<Profile | undefined>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { searchProfiles, getProfile } = useProfile()
  const { createMatch } = useMatch()
  const email = useSelector((state: RootState) => state.profile.email)
  const router = useRouter()

  const fetchProfiles = async (
    name?: string,
    minPoint?: number,
    ascendingPoint?: boolean
  ) => {
    const res = await searchProfiles(name, minPoint, ascendingPoint, true)
    if (res) {
      const newRes = res.filter((profile) => profile.email !== email)
      setProfiles(newRes)
    }
  }

  useEffect(() => {
    fetchProfiles()
  }, [])

  const schema = z.object({
    name: z.string().optional(),
    minPoint: z.coerce.number().optional(),
    ascendingPoint: z.boolean()
  })

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      minPoint: 0,
      ascendingPoint: false
    }
  })

  const submit = async (values: z.infer<typeof schema>) => {
    setIsLoading(true)
    await fetchProfiles(values.name, values.minPoint, values.ascendingPoint)
    setIsLoading(false)
  }

  const choosePlayer = (id: number) => {
    const chosenPlayer = profiles?.find((profile) => profile.id === id)
    setPlayer(chosenPlayer)
  }

  const handleCreate = async () => {
    setIsLoading(true)
    const res = await getProfile(email)
    const matchRes = await createMatch(res.id, player?.id || 0)
    setIsLoading(false)
    if (matchRes) {
      router.push('/matches')
    }
  }

  return (
    <MainLayout>
      <h1 className="mt-8 text-center text-2xl font-bold">Tạo trận đấu mới</h1>
      <div className="mx-auto mt-8 flex w-[1280px] max-w-full">
        <div className="w-2/3">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(submit)}
              className="flex items-end gap-8"
            >
              <FormField
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên cơ thủ</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập tên cơ thủ muốn tìm"
                        className="w-[250px]"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="minPoint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Điểm tích lũy tối thiểu</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Điểm tích lũy"
                        {...field}
                        type="number"
                        className="w-[120px]"
                        disabled={isLoading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="ascendingPoint"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormLabel className="ml-2">
                      Xếp theo điểm tăng dần
                    </FormLabel>
                  </FormItem>
                )}
              />
              <Button disabled={isLoading}>Tìm kiếm</Button>
            </form>
          </Form>
          <div className="mt-10 flex flex-col items-center gap-4">
            {profiles &&
              profiles.map((profile) => (
                <div
                  key={profile.id}
                  className="mx-auto w-full"
                  onClick={() => choosePlayer(profile.id)}
                >
                  <NewMatchPlayer
                    id={profile.id}
                    name={profile.name}
                    point={profile.point}
                  />
                </div>
              ))}
          </div>
        </div>
        <div className="mx-6 h-fit grow rounded-lg bg-gray-100 p-4">
          <span>
            Cơ thủ lựa chọn: <b>{player?.name}</b>
          </span>
          <br />
          <span className="leading-loose">
            Điểm tích lũy: <b>{player?.point}</b>
          </span>
          <br />
          <div className="mt-6 flex gap-6">
            <Button
              variant="destructive"
              onClick={() => choosePlayer(0)}
              disabled={isLoading || !player}
            >
              Gỡ lựa chọn
            </Button>
            <Button
              onClick={() => handleCreate()}
              disabled={isLoading || !player}
            >
              Tạo trận
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default Page
