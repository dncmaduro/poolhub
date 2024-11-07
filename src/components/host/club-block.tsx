'use client'

import { MapPin } from 'lucide-react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { usePreorder } from '@/hooks/use-preorder'
import { useEffect, useState } from 'react'
import { Badge } from '../ui/badge'

export interface ClubBlockProps {
  id: number
  name: string
  address: string
  email: string
  className?: string
}

export const HostClubBlock = (props: ClubBlockProps) => {
  const { getPreordersForClub } = usePreorder()
  const [pendingPreorders, setPendingPreorders] = useState<number>(0)

  const fetchPreorders = async () => {
    const res = await getPreordersForClub(props.id)
    if (res) {
      setPendingPreorders(
        res.filter((preorder) => preorder.status === 'pending').length
      )
    }
  }

  useEffect(() => {
    fetchPreorders()
  }, [])

  return (
    <div
      className={`flex h-[180px] w-[350px] flex-col justify-between rounded-lg border border-gray-200 px-6 py-4 hover:border-violet-300 ${props.className}`}
    >
      <div className="flex flex-col">
        <span className="text-lg font-bold">{props.name}</span>
        <span className="mt-3 flex items-center gap-2 text-lg">
          <MapPin color="#777777" /> {props.address}
        </span>
        <div className="mt-2 h-4">
          {pendingPreorders === 1 ? (
            <Badge variant="destructive">1 pending preorder</Badge>
          ) : (
            pendingPreorders > 1 && (
              <Badge variant="destructive">
                {pendingPreorders} pending preorders
              </Badge>
            )
          )}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">{props.email}</span>
        <Link href={`/clubs/${props.id}`}>
          <Button variant="outline">Xem thêm</Button>
        </Link>
      </div>
    </div>
  )
}
