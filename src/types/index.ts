export type Club = {
  id: number
  name: string
  address: string
  host_email: string
}

export type Competition = {
  id: number
  name: string
  place_id: number
}

export type Profile = {
  id: number
  email: string
  name: string
  point: number
  role: string
  phone: string | null
  birthyear: number | null
}

export type Match = {
  id: number
  status: string
  player1_id: number
  player2_id: number
  date: number
  point1: number
  point2: number
  place_id: number
}

export type Preorder = {
  id: number
  status: string
  place_id: number
  profile_id: number
  time: Date
}
