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

  const searchMatches = async (name?: string, clubs?: string) => {
    const foundClubs = await searchClubs(clubs || '')
    const clubIds = foundClubs?.map((club) => club.id)

    const foundProfiles = await searchProfiles(name || '')
    const profileIds = foundProfiles?.map((profile) => profile.id)

    const { data, error } = await supabase
      .from('match')
      .select('*')
      .in('place_id', clubIds || [])
      .or(`player1_id.in.(${profileIds}),player2_id.in.(${profileIds})`)
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

  return { getMatches, searchMatches, getMatchesForClub }
}
