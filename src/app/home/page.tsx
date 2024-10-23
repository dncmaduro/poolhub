'use client'

import { ClubBlock } from '@/components/home/club-block'
import { CompetitionBlock } from '@/components/home/competition-block'
import { MatchBlock } from '@/components/home/match-block'
import FeedBlock from '@/components/ui/feed-block'
import { useClub } from '@/hooks/use-club'
import { useCompetition } from '@/hooks/use-competition'
import { useMatch } from '@/hooks/use-match'
import MainLayout from '@/layouts/main'
import { ReactNode, useEffect, useState } from 'react'

const Page = () => {
  const [clubBlocks, setClubBlocks] = useState<ReactNode[]>([])
  const [competitionBlocks, setCompetitionBlocks] = useState<ReactNode[]>([])
  const [matchBlocks, setMatchBlocks] = useState<ReactNode[]>([])

  const { getClubs } = useClub()
  const { getCompetitions } = useCompetition()
  const { getMatches } = useMatch()

  useEffect(() => {
    const fetchClubData = async () => {
      const res = await getClubs()
      if (res) {
        setClubBlocks(
          res.map((block) => (
            <ClubBlock
              key={block.id}
              id={block.id}
              name={block.name}
              address={block.address}
              email={block.email}
            />
          ))
        )
      }
    }

    const fetchCompetitionData = async () => {
      const res = await getCompetitions()
      if (res) {
        setCompetitionBlocks(
          res.map((block) => (
            <CompetitionBlock
              key={block.id}
              id={block.id}
              place_id={block.place_id}
              name={block.name}
            />
          ))
        )
      }
    }

    const fetchMatchData = async () => {
      const res = await getMatches()
      if (res) {
        setMatchBlocks(
          res.map((block) => (
            <MatchBlock
              key={block.id}
              id={block.id}
              player1_id={block.player1_id}
              player2_id={block.player2_id}
              point1={block.point1}
              point2={block.point2}
              date={block.date}
              status={block.staus}
              place_id={block.place_id}
            ></MatchBlock>
          ))
        )
      }
    }

    fetchClubData()
    fetchCompetitionData()
    fetchMatchData()
  }, [])

  return (
    <MainLayout>
      <h1 className="mt-8 text-center text-2xl font-bold text-violet-400">
        Khám phá PoolHub
      </h1>
      <div className="mt-4 flex w-full flex-col items-center">
        <FeedBlock
          title="Các câu lạc bộ nổi bật"
          more="/clubs"
          blocks={[clubBlocks]}
        />
      </div>
      <div className="mt-4 flex w-full flex-col items-center">
        <FeedBlock
          title="Các giải đấu hiện tại"
          more="/competitions"
          blocks={[competitionBlocks]}
        />
      </div>
      <div className="mt-4 flex w-full flex-col items-center">
        <FeedBlock
          title="Những trận đấu nổi bật"
          more="/matches"
          blocks={[matchBlocks]}
        />
      </div>
    </MainLayout>
  )
}

export default Page
