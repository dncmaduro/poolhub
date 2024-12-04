'use client'

import { useProfile } from '@/hooks/use-profile'
import { Profile } from '@/types'
import { useEffect, useState } from 'react'

interface RatingProps {
  profile_id: number
  rating: number
  comment?: string
}

export const RatingBox = (props: RatingProps) => {
  const [profile, setProfile] = useState<Profile | null>(null)
  const { getProfileById } = useProfile()

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await getProfileById(props.profile_id)
      if (res) {
        setProfile(res)
      }
    }
  }, [props.profile_id])

  return (
    <div className="flex flex-col rounded-lg px-4 py-2 shadow">
      <span className="text-lg font-bold">{profile?.name}</span>
      <span className="font-bold">{props.rating} sao</span>
      <span>{props.comment}</span>
    </div>
  )
}
