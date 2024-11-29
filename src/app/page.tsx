import { Button } from '@/components/ui/button'
import ThemeText from '@/components/ui/theme-text'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex h-screen w-screen overflow-y-auto">
      <div className="mx-auto my-auto flex grow flex-col items-center gap-4">
        <h1 className="text-2xl font-bold">
          Chào mừng tới <ThemeText text="PoolHub" />
        </h1>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <span>Nếu bạn đã có tài khoản</span>
            <Link href="/login">
              <Button>Đăng nhập</Button>
            </Link>
          </div>
          <div className="h-20 w-[2px] bg-gray-300"></div>
          <div className="flex flex-col items-center gap-2">
            <span>Hoặc bạn có thể</span>
            <Link href="/register">
              <Button variant="outline">Tạo tài khoản mới</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
