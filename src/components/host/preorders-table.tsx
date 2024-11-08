'use client'

import { Preorder } from '@/types'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../ui/table'
import { useProfile } from '@/hooks/use-profile'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '../ui/button'
import { usePreorder } from '@/hooks/use-preorder'
import { StatusBadge } from '../ui/status-badge'

interface PreordersTableProps {
  preorders: Preorder[]
}

interface InTablePreorder {
  id: number
  profile: {
    id: number
    name: string
  }
  status: string
  time: string
}

export const PreordersTable = (props: PreordersTableProps) => {
  const { getProfileById } = useProfile()
  const { updatePreorder } = usePreorder()
  const [preorders, setPreorders] = useState<InTablePreorder[]>([])

  const fetchProfile = async (id: number) => {
    const res = await getProfileById(id)
    return {
      id: res.id || 0,
      name: res.name || ''
    }
  }

  useEffect(() => {
    const fetchPreorders = async () => {
      const convertedPreorders = await Promise.all(
        props.preorders.map(async (preorder: Preorder) => {
          const profile = await fetchProfile(preorder.profile_id)
          return {
            id: preorder.id,
            profile,
            status: preorder.status,
            time: preorder.time.toLocaleString()
          }
        })
      )
      setPreorders(
        convertedPreorders.sort((a, b) => {
          if (a.id > b.id) {
            return 1
          }
          return -1
        })
      )
    }

    fetchPreorders()
  }, [props.preorders])

  const handleActions = async (id: number, status: string) => {
    const res = await updatePreorder(id, status)
    if (res) {
      setPreorders(
        preorders.map((preorder) => {
          if (preorder.id === id) {
            return {
              id,
              profile: preorder.profile,
              status,
              time: preorder.time
            }
          }
          return preorder
        })
      )
    }
  }

  return (
    <>
      <Table>
        <TableCaption>Các đơn đặt chỗ</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Người đặt</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Thời gian</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {preorders &&
            preorders.map((preorder) => (
              <TableRow className="h-[60px]" key={preorder.id}>
                <TableCell>{preorder.id}</TableCell>
                <TableCell>
                  <Link href={`/user/${preorder.profile.id}`}>
                    {preorder.profile.name}
                  </Link>
                </TableCell>
                <TableCell>
                  <StatusBadge value={preorder.status} />
                </TableCell>
                <TableCell>{preorder.time}</TableCell>
                <TableCell className="flex gap-4">
                  {preorder.status === 'pending' && (
                    <>
                      <Button
                        onClick={() => {
                          handleActions(preorder.id, 'confirmed')
                        }}
                      >
                        Xác nhận
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          handleActions(preorder.id, 'delcined')
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
