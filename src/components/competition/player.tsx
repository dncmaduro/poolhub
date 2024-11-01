'use client'

import { useProfile } from '@/hooks/use-profile'
import { Profile } from '@/types'
import { useEffect, useState } from 'react'

interface PlayerProps {
  id: number
  profile_id: number
  no: number
}

export const Player = (props: PlayerProps) => {
  const { getProfileById } = useProfile()
  const [profile, setProfile] = useState<Profile>()

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await getProfileById(props.profile_id)
      if (res) {
        setProfile(res)
      }
    }

    fetchProfile()
  }, [])

  return (
    <div className="flex justify-between rounded-md border border-gray-300 px-4 py-2 shadow">
      {profile && (
        <>
          <div>
            <span className="text-sm text-gray-600">{props.no}</span>
            <span className="ml-8 font-bold">{profile.name}</span>
          </div>
          <span className="mr-4 font-bold">{profile.point}</span>
        </>
      )}
    </div>
  )
}
