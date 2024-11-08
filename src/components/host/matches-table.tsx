'use client'

import { useMatch } from '@/hooks/use-match'
import { useProfile } from '@/hooks/use-profile'
import { Match } from '@/types'
import { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../ui/table'
import Link from 'next/link'
import { StatusBadge } from '../ui/status-badge'
import { Button } from '../ui/button'

interface MatchesTableProps {
  matches: Match[]
}

interface InTableMatch {
  id: number
  profile_1: {
    id: number
    name: string
  }
  profile_2: {
    id: number
    name: string
  }
  status: string
  point1: number
  point2: number
  time: string
}

export const MatchesTable = (props: MatchesTableProps) => {
  const { getProfileById } = useProfile()
  const { updateMatch } = useMatch()
  const [matches, setMatches] = useState<InTableMatch[]>([])

  const fetchProfile = async (id: number) => {
    const res = await getProfileById(id)
    return {
      id: res.id || 0,
      name: res.name || ''
    }
  }

  useEffect(() => {
    const fetchMatches = async () => {
      const convertedMatches = await Promise.all(
        props.matches.map(async (match: Match) => {
          const profile_1 = await fetchProfile(match.player1_id)
          const profile_2 = await fetchProfile(match.player2_id)
          return {
            id: match.id,
            profile_1,
            profile_2,
            status: match.status,
            point1: match.point1,
            point2: match.point2,
            time: match.time ? match.time.toLocaleString() : ''
          }
        })
      )

      setMatches(
        convertedMatches.sort((a, b) => {
          if (a.id > b.id) {
            return 1
          }
          return -1
        })
      )
    }

    fetchMatches()
  }, [props.matches])

  const handleActions = async (id: number, status: string) => {
    const res = await updateMatch(id, status)
    if (res) {
      setMatches(
        matches.map((match) => {
          if (match.id === id) {
            return {
              ...match,
              status
            }
          }
          return match
        })
      )
    }
  }

  return (
    <>
      <Table>
        <TableCaption>Các trận đấu</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nguời chơi 1</TableHead>
            <TableHead>Người chơi 2</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Tỉ số</TableHead>
            <TableHead>Thời gian</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {matches &&
            matches.map((match) => (
              <TableRow className="h-[60px]" key={match.id}>
                <TableCell>{match.id}</TableCell>
                <TableCell>
                  <Link href={`/user/${match.profile_1.id}`}>
                    {match.profile_1.name}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/user/${match.profile_2.id}`}>
                    {match.profile_2.name}
                  </Link>
                </TableCell>
                <TableCell>
                  <StatusBadge value={match.status} />
                </TableCell>
                <TableCell>
                  {match.point1} - {match.point2}
                </TableCell>
                <TableCell>{match.time}</TableCell>
                <TableCell className="flex gap-4">
                  {match.status === 'pending' && (
                    <>
                      <Button
                        onClick={() => {
                          handleActions(match.id, 'confirmed')
                        }}
                      >
                        Xác nhận
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          handleActions(match.id, 'delcined')
                        }}
                      >
                        Từ chối
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </>
  )
}
