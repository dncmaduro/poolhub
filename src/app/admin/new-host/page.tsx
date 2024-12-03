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
import { useAuth } from '@/hooks/use-auth'
import { AdminLayout } from '@/layouts/admin'
import MainLayout from '@/layouts/main'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeClosed, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const Page = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isShowPw, setIsShowPw] = useState<boolean>(false)

  const { register } = useAuth()

  const schema = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string()
  })

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
      name: ''
    }
  })

  const submit = async (values: z.infer<typeof schema>) => {
    setIsLoading(true)
    await register(values.email, values.password, values.name, 'host')
    setIsLoading(false)
  }

  return (
    <MainLayout>
      <AdminLayout>
        <div className="mx-auto flex w-[1000px] max-w-full flex-col items-center">
          <h1 className="mt-10 text-center text-xl font-bold">
            Tạo tài khoản chủ câu lạc bộ mới
          </h1>
          <Form {...form}>
            <form
              className="mx-auto mt-6 flex w-[600px] flex-col gap-6"
              onSubmit={form.handleSubmit(submit)}
            >
              <FormField
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ và tên</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập họ và tên" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập email" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập mật khẩu..."
                        {...field}
                        type={isShowPw ? 'text' : 'password'}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      onClick={() => setIsShowPw(!isShowPw)}
                      variant="ghost"
                      className="absolute right-0 top-6"
                    >
                      {isShowPw ? <Eye /> : <EyeClosed />}
                    </Button>
                  </FormItem>
                )}
              />
              <Button disabled={!form.formState.isDirty || isLoading}>
                {isLoading && <Loader2 className="mr-2" />}Tạo tài khoản
              </Button>
            </form>
          </Form>
        </div>
      </AdminLayout>
    </MainLayout>
  )
}

export default Page
