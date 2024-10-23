import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface FeedBlockProps {
  title: string
  more: string
  blocks: ReactNode[]
}

const FeedBlock = (props: FeedBlockProps) => {
  return (
    <div className="mt-8 w-full max-w-[1280px]">
      <div className="flex w-full justify-between border-b border-gray-200">
        <span className="text-lg font-bold uppercase text-gray-700">
          {props.title}
        </span>
        <Link href={props.more}>
          <Button variant="link">Xem thêm</Button>
        </Link>
      </div>
      <div className="mt-4 flex justify-center gap-6">{props.blocks}</div>
    </div>
  )
}

export default FeedBlock
