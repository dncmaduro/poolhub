'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import AuthLayout from '@/layouts/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useAuth } from '@/hooks/use-auth'
import { useState } from 'react'
import { Loader2, Eye, EyeClosed } from 'lucide-react'
import Link from 'next/link'

const Page = () => {
  const { register } = useAuth()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isShowPw, setIsShowPw] = useState<boolean>(false)

  const schema = z.object({
    email: z.string().email('Sai định dạng email'),
    password: z.string().min(8, 'Mật khẩu phải có ít nhất 8 kí tự '),
    name: z.string().min(1, 'Phải điền tên cho tài khoản')
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
    await register(values.email, values.password, values.name)
    setIsLoading(false)
  }

  return (
    <AuthLayout>
      <div className="w-[350px] max-w-full rounded-lg border border-gray-200 p-6">
        <h1 className="text-center text-lg font-bold text-violet-500">
          Đăng kí tài khoản mới
        </h1>
        <Form {...form}>
          <form className="mt-6 w-full" onSubmit={form.handleSubmit(submit)}>
            <div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập email..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-2">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel>Mật khẩu</FormLabel>
                    <FormControl>
                      <Input
                        type={isShowPw ? 'text' : 'password'}
                        placeholder="Nhập mật khẩu..."
                        {...field}
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tên của bạn..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              disabled={isLoading}
              type="submit"
              className="mx-auto mt-6 w-full"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              Đăng kí
            </Button>
          </form>
          <Link href="/login" className="mt-4 flex w-full justify-center">
            <Button variant="link">Hoặc bạn có thể đăng nhập tại đây</Button>
          </Link>
        </Form>
      </div>
    </AuthLayout>
  )
}

export default Page
