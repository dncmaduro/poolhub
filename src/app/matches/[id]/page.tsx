'use client'

import { MatchPlayer } from '@/components/match/player'
import { useClub } from '@/hooks/use-club'
import { useMatch } from '@/hooks/use-match'
import MainLayout from '@/layouts/main'
import { Club, Match } from '@/types'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const Page = () => {
  const params = useParams()
  const { getMatch } = useMatch()
  const { getClub } = useClub()
  const [match, setMatch] = useState<Match>()
  const [club, setClub] = useState<Club>()

  useEffect(() => {
    const fetchMatch = async () => {
      const res = await getMatch(Number(params.id))
      if (res) {
        const res2 = await getClub(res.place_id)
        if (res2) {
          setClub(res2)
        }
        setMatch(res)
      }
    }

    fetchMatch()
  }, [])

  return (
    <MainLayout>
      <div className="mx-auto mt-10 flex w-[1280px] max-w-full gap-8">
        <div className="flex w-full flex-col items-center">
          <span className="text-2xl font-bold">Trận đấu</span>
          <div className="mt-10 flex justify-between gap-10">
            {match && (
              <MatchPlayer
                player_id={match.player1_id}
                point={match.point1}
                isLeft={true}
              />
            )}
            <span className="rounded-md bg-gray-50 p-2 text-lg font-bold">
              VS
            </span>
            {match && (
              <MatchPlayer
                player_id={match.player2_id}
                point={match.point2}
                isLeft={false}
              />
            )}
          </div>
          <Link href={`/clubs/${club?.id}`} className="mt-10 text-xl">
            Địa điểm: {`${club && club.name}, ${club && club.address} `}
          </Link>
        </div>
      </div>
    </MainLayout>
  )
}

export default Page
