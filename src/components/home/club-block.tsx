import { MapPin } from 'lucide-react'
import { Button } from '../ui/button'
import Link from 'next/link'

export interface ClubBlockProps {
  id: number
  name: string
  address: string
  email: string
}

export const ClubBlock = (props: ClubBlockProps) => {
  return (
    <div className="flex h-[180px] w-[350px] flex-col justify-between rounded-lg border border-gray-200 px-6 py-4 hover:border-violet-300">
      <div className="flex flex-col">
        <span className="text-lg font-bold">{props.name}</span>
        <span className="mt-3 flex items-center gap-2 text-lg">
          <MapPin color="#777777" /> {props.address}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span>{props.email}</span>
        <Link href={`/clubs/${props.id}`}>
          <Button variant="outline">Xem thêm</Button>
        </Link>
      </div>
    </div>
  )
}
