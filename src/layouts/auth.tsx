import Logo from '@/components/ui/logo'
import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

const AuthLayout = (props: LayoutProps) => {
  return (
    <div className="relative flex h-screen w-screen">
      <div className="absolute left-6 top-4">
        <Logo />
      </div>
      <div className="mx-auto my-auto">{props.children}</div>
    </div>
  )
}

export default AuthLayout
