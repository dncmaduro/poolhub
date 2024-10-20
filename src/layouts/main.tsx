import Header from '@/components/layouts/header'
import { ReactNode } from 'react'

interface MainLayoutProps {
  children: ReactNode
}

const MainLayout = (props: MainLayoutProps) => {
  return (
    <div className="h-screen w-screen">
      <Header />
      <div>{props.children}</div>
    </div>
  )
}

export default MainLayout
