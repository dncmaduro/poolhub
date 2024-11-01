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
