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
import { useRouter } from 'next/navigation'

const Page = () => {
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isShowPw, setIsShowPw] = useState<boolean>(false)
  const router = useRouter()

  const schema = z.object({
    email: z.string().email('Sai định dạng email'),
    password: z.string().min(8, 'Mật khẩu phải có ít nhất 8 kí tự ')
  })

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const submit = async (values: z.infer<typeof schema>) => {
    setIsLoading(true)
    const res = await login(values.email, values.password)
    if (res) {
      router.push('/home')
    }
    setIsLoading(false)
  }

  return (
    <AuthLayout>
      <div className="w-[350px] max-w-full rounded-lg border border-gray-200 p-6">
        <h1 className="text-center text-lg font-bold text-violet-500">
          Đăng nhập
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
            <Button
              disabled={isLoading}
              type="submit"
              className="mx-auto mt-6 w-full"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              Đăng nhập
            </Button>
          </form>
          <Link href="/register" className="mt-4 flex w-full justify-center">
            <Button variant="link">
              Nếu bạn chưa có tài khoản, hãy tạo tài khoản mới
            </Button>
          </Link>
        </Form>
      </div>
    </AuthLayout>
  )
}

export default Page
