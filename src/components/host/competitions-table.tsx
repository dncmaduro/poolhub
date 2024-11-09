'use client'

import { Competition } from '@/types'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../ui/table'
import { useEffect, useState } from 'react'
import { CompetitionStatusBadge } from '../ui/competition-status-badge'
import { Button } from '../ui/button'
import { useCompetition } from '@/hooks/use-competition'

interface CompetitionsTableProps {
  competitions: Competition[]
}

interface InTableCompetition {
  id: number
  name: string
  startTime: string
  endTime: string
  status: string
}

export const CompetitionsTable = (props: CompetitionsTableProps) => {
  const [competitions, setCompetitions] = useState<InTableCompetition[]>([])
  const { updateCompetition } = useCompetition()

  useEffect(() => {
    const convertedCompetitions = props.competitions.map((competition) => ({
      id: competition.id,
      name: competition.name,
      startTime: competition.startTime.toLocaleString(),
      endTime: competition.endTime.toLocaleString(),
      status: competition.status
    }))

    setCompetitions(
      convertedCompetitions.sort((a, b) => {
        if (a.id > b.id) {
          return 1
        }

        return -1
      })
    )
  }, [props.competitions])

  const handleActions = async (id: number, status: string) => {
    const res = await updateCompetition(id, status)
    if (res) {
      setCompetitions(
        competitions.map((competition) => {
          if (competition.id === id) {
            return {
              ...competition,
              status
            }
          }
          return competition
        })
      )
    }
  }

  return (
    <>
      <Table>
        <TableCaption>Các giải đấu</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Tên giải đấu</TableHead>
            <TableHead>Thời gian bắt đầu</TableHead>
            <TableHead>Thời gian kết thúc</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {competitions.map((competition) => (
            <TableRow className="h-[60px]" key={competition.id}>
              <TableCell>{competition.id}</TableCell>
              <TableCell>{competition.name}</TableCell>
              <TableCell>{competition.startTime}</TableCell>
              <TableCell>{competition.endTime}</TableCell>
              <TableCell>
                <CompetitionStatusBadge value={competition.status} />
              </TableCell>
              <TableCell className="flex gap-4">
                {competition.status === 'open' ? (
                  <>
                    <Button
                      onClick={() => {
                        handleActions(competition.id, 'in progress')
                      }}
                      className="bg-green-500 hover:bg-green-400"
                    >
                      Bắt đầu giải đấu
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        handleActions(competition.id, 'canceled')
                      }}
                    >
                      Huỷ bỏ
                    </Button>
                  </>
                ) : (
                  competition.status === 'in progress' && (
                    <>
                      <Button
                        onClick={() => {
                          handleActions(competition.id, 'completed')
                        }}
                      >
                        Kết thúc giải đấu
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          handleActions(competition.id, 'canceled')
                        }}
                      >
                        Huỷ bỏ
                      </Button>
                    </>
                  )
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
