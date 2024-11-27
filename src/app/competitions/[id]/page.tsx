'use client'

import { Club, Competition } from '@/types'
import { useClub } from '@/hooks/use-club'
import { useCompetition } from '@/hooks/use-competition'
import { usePlayer } from '@/hooks/use-player'
import MainLayout from '@/layouts/main'
import { MapPin } from 'lucide-react'
import { useParams } from 'next/navigation'
import { ReactNode, useEffect, useState } from 'react'
import { Player } from '@/components/competition/player'
import Link from 'next/link'

const Page = () => {
  const params = useParams()
  const [playerBlocks, setPlayerBlocks] = useState<ReactNode[]>()
  const [competition, setCompetition] = useState<Competition>()
  const [club, setClub] = useState<Club>()
  const { getPlayersForCompetition } = usePlayer()
  const { getCompetition } = useCompetition()
  const { getClub } = useClub()

  useEffect(() => {
    const fetchCompetition = async () => {
      const res = await getCompetition(Number(params.id))
      if (res) {
        setCompetition(res)
        const res2 = await getClub(res.id, true)
        if (res2) {
          setClub(res2)
        }
      }
    }

    const fetchPlayers = async () => {
      const res = await getPlayersForCompetition(Number(params.id))
      if (res) {
        const sortedRes = res.sort((a, b) => {
          if (a.point > b.point) {
            return 1
          }
          return -1
        })
        setPlayerBlocks(
          sortedRes.map((block, index) => {
            return (
              <Player
                key={block.id}
                id={block.id}
                profile_id={block.profile_id}
                no={index + 1}
              />
            )
          })
        )
      }
    }

    fetchCompetition()
    fetchPlayers()
  }, [])

  return (
    <MainLayout>
      <div className="mx-auto mt-10 flex w-[1280px] max-w-full gap-8">
        <div className="flex w-1/3 flex-col">
          {competition && (
            <>
              <h1 className="text-3xl font-bold">{competition.name}</h1>
              <div className="mt-4 flex items-center gap-2 text-lg">
                <MapPin />
                {club && (
                  <Link href={`/clubs/${club.id}`}>
                    {club.name} - {club.address}
                  </Link>
                )}
              </div>
            </>
          )}
        </div>
        <div className="ml-8 flex grow flex-col gap-4">
          <span>Các thí sinh hiện tại</span>
          {playerBlocks}
        </div>
      </div>
    </MainLayout>
  )
}

export default Page
