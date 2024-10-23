'use client'

import { ClubBlock, ClubBlockProps } from '@/components/home/club-block'
import FeedBlock from '@/components/ui/feed-block'
import { useClub } from '@/hooks/use-club'
import MainLayout from '@/layouts/main'
import { useEffect, useState } from 'react'

const Page = () => {
  const [clubs, setClubs] = useState<ClubBlockProps[]>([])

  const { getClubs } = useClub()

  const clubBlocks = () => {
    return clubs.map((club) => (
      <ClubBlock
        id={club.id}
        key={club.id}
        name={club.name}
        address={club.address}
        email={club.email}
      />
    ))
  }

  useEffect(() => {
    const fetchData = async () => {
      const res = await getClubs()
      if (res) {
        setClubs(res)
      }
    }

    fetchData()
  }, [getClubs])

  return (
    <MainLayout>
      <h1 className="mt-8 text-center text-2xl font-bold text-violet-400">
        Khám phá PoolHub
      </h1>
      <div className="mt-4 flex w-full flex-col items-center">
        <FeedBlock
          title="Các câu lạc bộ nổi bật"
          more="/clubs"
          blocks={[clubBlocks()]}
        />
      </div>
    </MainLayout>
  )
}

export default Page
