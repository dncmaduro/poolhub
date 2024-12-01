export type Club = {
  id: number
  name: string
  address: string
  host_email: string
  lat: number
  lon: number
}

export type Competition = {
  id: number
  name: string
  place_id: number
  startTime: Date
  endTime: Date
  status: string
}

export type Profile = {
  id: number
  email: string
  name: string
  point: number
  role: string
  phone: string | null
  birthyear: number | null
  lat: number | null
  lon: number | null
  address: string
}

export type Match = {
  id: number
  status: string
  player1_id: number
  player2_id: number
  time: number
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
