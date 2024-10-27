'use client'

import { useClub } from '@/hooks/use-club'
import { useProfile } from '@/hooks/use-profile'
import { MapPin } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '../ui/button'

export interface MatchBlockProps {
  id: number
  status: string
  player1_id: number
  player2_id: number
  date: number
  point1: number
  point2: number
  place_id: number
  className?: string
}

export const MatchBlock = (props: MatchBlockProps) => {
  const [player1Name, setPlayer1Name] = useState<string>('')
  const [player2Name, setPlayer2Name] = useState<string>('')
  const [clubName, setClubName] = useState<string>('')

  const { getProfileById } = useProfile()
  const { getClub } = useClub()

  useEffect(() => {
    const fetchP1Data = async () => {
      const res = await getProfileById(props.player1_id)
      if (res) {
        setPlayer1Name(res.name)
      }
    }

    const fetchP2Data = async () => {
      const res = await getProfileById(props.player2_id)
      if (res) {
        setPlayer2Name(res.name)
      }
    }

    const fetchClubData = async () => {
      const res = await getClub(props.place_id)
      if (res) {
        setClubName(res.name)
      }
    }

    fetchP1Data()
    fetchP2Data()
    fetchClubData()
  }, [])

  return (
    <div
      className={`flex h-[180px] w-[350px] flex-col justify-between rounded-lg border border-gray-200 px-6 py-4 hover:border-violet-300 ${props.className}`}
    >
      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-lg">
          <span>{player1Name}</span>
          <span className="font-bold">{props.point1 || 0}</span>
        </div>
        <div className="flex justify-between text-lg">
          <span>{player2Name}</span>
          <span className="font-bold">{props.point2 || 0}</span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin color="#777777" />
          <span>{clubName}</span>
        </div>
        <Button variant="outline">Xem thêm</Button>
      </div>
    </div>
  )
}
