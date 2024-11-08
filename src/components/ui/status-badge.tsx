'use client'

import { useEffect, useState } from 'react'
import { Badge } from './badge'

interface StatusBadgeProps {
  value: string
}

export const StatusBadge = (props: StatusBadgeProps) => {
  const statusOptions = [
    {
      label: 'Đang chờ',
      value: 'pending',
      colorClass: 'bg-yellow-500'
    },
    {
      label: 'Đã xác nhận',
      value: 'confirmed',
      colorClass: 'bg-violet-500'
    },
    {
      label: 'Đã từ chối',
      value: 'declined',
      colorClass: 'bg-destructive'
    }
  ]

  const [colorClass, setColorClass] = useState<string>('bg-white')
  const [label, setLabel] = useState<string>('')

  useEffect(() => {
    const status = statusOptions.find((status) => status.value === props.value)
    setColorClass(status?.colorClass || colorClass)
    setLabel(status?.label || label)
  }, [props.value])

  return <Badge className={colorClass}>{label}</Badge>
}
