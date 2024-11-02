'use client'

import { Club } from '@/types'
import { CompetitionBlock } from '@/components/home/competition-block'
import { MatchBlock } from '@/components/home/match-block'
import { Button } from '@/components/ui/button'
import { useClub } from '@/hooks/use-club'
import { useCompetition } from '@/hooks/use-competition'
import { useMatch } from '@/hooks/use-match'
import MainLayout from '@/layouts/main'
import { Mail, MapPin } from 'lucide-react'
import { useParams } from 'next/navigation'
import { ReactNode, useEffect, useState } from 'react'

const Page = () => {
  const params = useParams()
  const [club, setClub] = useState<Club>()
  const [competitionBlocks, setCompetitionBlocks] = useState<ReactNode[]>()
  const [matchBlocks, setMatchBlocks] = useState<ReactNode[]>()
  const { getClub } = useClub()
  const { getCompetitionsForClub } = useCompetition()
  const { getMatchesForClub } = useMatch()

  useEffect(() => {
    const fetchClub = async () => {
      const res = await getClub(Number(params.id), true)
      if (res) {
        setClub(res)
      }
    }

    const fetchCompetitons = async () => {
      const res = await getCompetitionsForClub(Number(params.id))
      if (res) {
        setCompetitionBlocks(
          res.map((block) => (
            <CompetitionBlock
              key={block.id}
              id={block.id}
              name={block.name}
              place_id={block.place_id}
              className="mx-auto mt-8"
            />
          ))
        )
      }
    }

    const fetchMatches = async () => {
      const res = await getMatchesForClub(Number(params.id))
      if (res) {
        setMatchBlocks(
          res.map((match) => (
            <MatchBlock
              key={match.id}
              id={match.id}
              status={match.status}
              player1_id={match.player1_id}
              player2_id={match.player2_id}
              date={match.date}
              place_id={match.place_id}
              point1={match.point1}
              point2={match.point2}
              className="mx-auto mt-8"
            />
          ))
        )
      }
    }

    fetchClub()
    fetchCompetitons()
    fetchMatches()
  }, [])

  return (
    <MainLayout>
      <div className="mx-auto mt-10 flex w-[1280px] max-w-full gap-8">
        <div className="flex w-1/2 flex-col">
          {club && (
            <>
              <h1 className="text-3xl font-bold">{club.name}</h1>
              <div className="mt-4 flex items-center gap-2 text-lg">
                <MapPin />
                <span>{club.address}</span>
              </div>
              <div className="mt-4 flex items-center gap-2 text-lg">
                <Mail />
                <span>{club.host_email}</span>
              </div>
              <Button className="mt-10">Đặt chỗ trước</Button>
            </>
          )}
        </div>
        <div className="ml-auto flex flex-col">
          <span>Các giải đấu đang diễn ra tại câu lạc bộ này</span>
          {competitionBlocks}
          <span className="mt-12">
            Các trận đấu đang diễn ra tại câu lạc bộ này
          </span>
          {matchBlocks}
        </div>
      </div>
    </MainLayout>
  )
}

export default Page
