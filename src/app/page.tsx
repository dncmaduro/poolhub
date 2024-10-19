import { Button } from '@/components/ui/button'
import ThemeText from '@/components/ui/themeText'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="w-screen h-screen flex">
      <div className="mx-auto flex flex-col my-auto grow items-center gap-4">
        <h1 className="text-2xl font-bold">
          Welcome to <ThemeText text="PoolHub" />
        </h1>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 flex-col">
            <span>If you had an account</span>
            <Link href="/login">
              <Button>Log in</Button>
            </Link>
          </div>
          <div className="h-20 w-[2px] bg-gray-300"></div>
          <div className="flex items-center gap-2 flex-col">
            <span>Or you can</span>
            <Link href="/register">
              <Button variant="outline">Create a new account</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
