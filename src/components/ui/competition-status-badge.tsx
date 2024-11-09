'use client'

import { useEffect, useMemo, useState } from 'react'
import { Badge } from './badge'

interface CompetitionStatusBadgeProps {
  value: string
}

export const CompetitionStatusBadge = (props: CompetitionStatusBadgeProps) => {
  const statusOptions = useMemo(
    () => [
      {
        label: 'Đang mở',
        value: 'open',
        colorClass: 'bg-green-500'
      },
      {
        label: 'Đang diễn ra',
        value: 'in progress',
        colorClass: 'bg-violet-500'
      },
      {
        label: 'Kết thúc',
        value: 'completed',
        colorClass: 'bg-yellow-500'
      },
      {
        label: 'Hủy bỏ',
        value: 'canceled',
        colorClass: 'bg-destructive'
      }
    ],
    []
  )

  const [colorClass, setColorClass] = useState<string>('bg-white')
  const [label, setLabel] = useState<string>('')

  useEffect(() => {
    const status = statusOptions.find((status) => status.value === props.value)
    setColorClass(status?.colorClass || colorClass)
    setLabel(status?.label || label)
  }, [colorClass, label, props.value, statusOptions])

  return <Badge className={colorClass}>{label}</Badge>
}
