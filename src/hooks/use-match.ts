import { createClient } from '@supabase/supabase-js'
import { useToast } from './use-toast'
import { useClub } from './use-club'
import { useProfile } from './use-profile'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_KEY || ''
)

export const useMatch = () => {
  const { toast } = useToast()
  const { searchClubs } = useClub()
  const { searchProfiles } = useProfile()

  const getMatches = async () => {
    const { data, error } = await supabase.from('match').select('*').range(0, 2)
    if (data) {
      return data
    } else {
      toast({
        title: 'Không lấy được thông tin các trận đấu',
        description: error.message,
        variant: 'destructive'
      })
    }
  }

  const searchMatches = async (
    name?: string,
    clubs?: string,
    page?: number
  ) => {
    const foundClubs = await searchClubs(clubs || '')
    const clubIds = foundClubs?.map((club) => club.id)

    const foundProfiles = await searchProfiles(name || '')
    const profileIds = foundProfiles?.map((profile) => profile.id)

    const itemsPerPage = 6
    const realPage = page || 1

    if (clubs) {
      const { data, error } = await supabase
        .from('match')
        .select('*')
        .in('place_id', clubIds || [])
        .or(`player1_id.in.(${profileIds}),player2_id.in.(${profileIds})`)
        .range(0, 10)
      if (data) {
        return data
      } else {
        toast({
          title: 'Không lấy được thông tin về trận đấu',
          description: error.message,
          variant: 'destructive'
        })
      }
    }

    const { data, error } = await supabase
      .from('match')
      .select('*')
      .or(`player1_id.in.(${profileIds}),player2_id.in.(${profileIds})`)
      .range((realPage - 1) * itemsPerPage, realPage * itemsPerPage - 1)
    if (data) {
      return data
    } else {
      toast({
        title: 'Không lấy được thông tin về trận đấu',
        description: error.message,
        variant: 'destructive'
      })
    }
  }

  const getMatchesForClub = async (id: number) => {
    const { data, error } = await supabase
      .from('match')
      .select('*')
      .eq('place_id', id)
    if (data) {
      return data
    } else {
      toast({
        title: 'Không lấy được thông tin về trận đấu',
        description: error.message,
        variant: 'destructive'
      })
    }
  }

  const getMatch = async (id: number) => {
    const { data, error } = await supabase
      .from('match')
      .select('*')
      .eq('id', id)
    if (data) {
      return data[0]
    } else {
      toast({
        title: 'Không lấy được thông tin về trận đấu',
        description: error.message,
        variant: 'destructive'
      })
    }
  }

  const createMatch = async (player1_id: number, player2_id: number) => {
    const { data, error } = await supabase
      .from('match')
      .insert({ player1_id, player2_id })
      .select()
    if (data) {
      toast({
        title: 'Tạo trận đấu thành công'
      })
      return data[0]
    } else {
      toast({
        title: 'Tạo trận đấu không thành công',
        description: error.message,
        variant: 'destructive'
      })
    }
  }

  const countMatches = async () => {
    const { data } = await supabase.from('match').select('*')
    if (data) {
      return data.length
    }
  }

  return {
    getMatches,
    searchMatches,
    getMatchesForClub,
    getMatch,
    createMatch,
    countMatches
  }
}
