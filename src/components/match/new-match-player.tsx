'use client'

interface NewMatchPlayerProps {
  id: number
  name: string
  point: number
}

export const NewMatchPlayer = (props: NewMatchPlayerProps) => {
  return (
    <div className="mx-auto flex w-1/2 cursor-pointer justify-between rounded-md border border-gray-300 px-4 py-2 font-bold shadow hover:bg-gray-50">
      <span>{props.name}</span>
      <span>{props.point}</span>
    </div>
  )
}
