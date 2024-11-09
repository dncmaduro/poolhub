import { useClub } from '@/hooks/use-club'
import { useEffect, useState } from 'react'
import { Warehouse } from 'lucide-react'
import Link from 'next/link'
import { Button } from '../ui/button'
import { format } from 'date-fns'

export interface CompetitionBlockProps {
  id: number
  name: string
  place_id: number
  startTime: Date
  endTime: Date
  className?: string
}

export const CompetitionBlock = (props: CompetitionBlockProps) => {
  const [clubName, setClubName] = useState<string>('')

  const { getClub } = useClub()

  useEffect(() => {
    const fetchData = async () => {
      const res = await getClub(props.id, true)
      if (res) {
        setClubName(res.name)
      }
    }

    fetchData()
  }, [])

  return (
    <div
      className={`flex h-[180px] w-[350px] flex-col justify-between rounded-lg border border-gray-200 px-6 py-4 hover:border-violet-300 ${props.className}`}
    >
      <div className="flex flex-col">
        <span className="text-lg font-bold">{props.name}</span>
        <span className="text-base text-gray-600">
          {' '}
          ({format(props.startTime, 'dd/MM/yyyy')} đến{' '}
          {format(props.endTime, 'dd/MM/yyyy')})
        </span>
        <span className="mt-4 flex items-center gap-2 text-lg">
          <Warehouse color="#777777" />
          {clubName}
        </span>
      </div>
      <div className="flex items-center justify-end gap-3">
        <Link href={`/competitions/${props.id}/register`}>
          <Button>Đăng ký tham dự</Button>
        </Link>
        <Link href={`/competitions/${props.id}`}>
          <Button variant="outline">Xem thêm</Button>
        </Link>
      </div>
    </div>
  )
}
