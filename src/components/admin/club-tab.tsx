'use client'

import { Club } from '@/types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../ui/table'
import Link from 'next/link'
import { urlToPoolMap } from '@/helpers'
import { Button } from '../ui/button'
import { useClub } from '@/hooks/use-club'
import { useEffect, useState } from 'react'

interface ClubTabProps {
  clubs: Club[]
}

export const ClubTab = (props: ClubTabProps) => {
  const { updateStatusClub } = useClub()
  const [clubs, setClubs] = useState<Club[]>([])

  const handleActions = async (id: number, status: string) => {
    const res = await updateStatusClub(id, status)
    if (res) {
      setClubs(
        clubs.map((club) => {
          if (club.id === id) {
            return {
              ...club,
              status
            }
          }
          return club
        })
      )
    }
  }

  useEffect(() => {
    setClubs(props.clubs)
  }, [props.clubs])

  return (
    <>
      <Table className="mt-10">
        <TableHeader>
          <TableRow>
            <TableHead>STT</TableHead>
            <TableHead>Tên clb</TableHead>
            <TableHead>Email chủ clb</TableHead>
            <TableHead>Địa chỉ</TableHead>
            <TableHead>Xem trên bản đồ</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clubs.map((club) => {
            const poolmapPoint = {
              lat: club.lat,
              lon: club.lon
            }

            return (
              <>
                <TableRow>
                  <TableCell>{club.id}</TableCell>
                  <TableCell>{club.name}</TableCell>
                  <TableCell>{club.host_email}</TableCell>
                  <TableCell>{club.address}</TableCell>
                  <TableCell>
                    <Link href={urlToPoolMap(poolmapPoint)}>
                      <Button>Xem trên bản đồ PoolMap</Button>
                    </Link>
                  </TableCell>
                  <TableCell>
                    {club.status === 'pending'
                      ? 'Đang chờ'
                      : club.status === 'accepted'
                        ? 'Cấp phép'
                        : 'Từ chối'}
                  </TableCell>
                  <TableCell>
                    {club.status === 'pending' && (
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => {
                            handleActions(club.id, 'accepted')
                          }}
                        >
                          Cấp phép
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            handleActions(club.id, 'declined')
                          }}
                        >
                          Từ chối
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              </>
            )
          })}
        </TableBody>
      </Table>
    </>
  )
}
