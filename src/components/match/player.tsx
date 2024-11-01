'use client'

import { useProfile } from '@/hooks/use-profile'
import { Profile } from '@/types'
import { useEffect, useState } from 'react'

interface MatchPlayerProps {
  player_id: number
  point: number
  isLeft: boolean
}

export const MatchPlayer = (props: MatchPlayerProps) => {
  const [profile, setProfile] = useState<Profile>()
  const { getProfileById } = useProfile()

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await getProfileById(props.player_id)
      if (res) {
        setProfile(res)
      }
    }

    fetchProfile()
  }, [])

  return (
    <div
      className={`flex items-center justify-between gap-16 rounded-md border border-gray-300 bg-gray-50 px-4 py-2 shadow ${!props.isLeft && 'flex-row-reverse'}`}
    >
      <span className="text-xl font-bold">{profile && profile.name}</span>
      <span className="text-lg font-bold">{props.point}</span>
    </div>
  )
}
