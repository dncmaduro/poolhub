'use client'

import { HostClubBlock } from '@/components/host/club-block'
import { useClub } from '@/hooks/use-club'
import { HostLayout } from '@/layouts/host'
import { RootState } from '@/store'
import { ReactNode, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const Page = () => {
  const email = useSelector((state: RootState) => state.profile.email)
  const [clubBlocks, setClubBlocks] = useState<ReactNode[]>()
  const { getHostClubs } = useClub()

  const fetchClubs = async () => {
    const res = await getHostClubs(email)
    if (res) {
      setClubBlocks(
        res.map((block) => (
          <HostClubBlock
            key={block.id}
            id={block.id}
            name={block.name}
            address={block.address}
            email={block.host_email}
          />
        ))
      )
    }
  }

  useEffect(() => {
    fetchClubs()
  }, [])

  return (
    <HostLayout>
      <div className="mx-10 mt-10">
        <span className="text-2xl font-bold">Các câu lạc bộ của bạn</span>
        <div className="mt-10">{clubBlocks}</div>
      </div>
    </HostLayout>
  )
}

export default Page
