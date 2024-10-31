import { createClient } from '@supabase/supabase-js'
import { useToast } from './use-toast'
import { useClub } from './use-club'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_KEY || ''
)

export const useCompetition = () => {
  const { toast } = useToast()
  const { searchClubs } = useClub()

  const getCompetitions = async () => {
    const { data, error } = await supabase
      .from('competition')
      .select('*')
      .range(0, 2)
    if (data) {
      return data
    } else {
      toast({
        title: 'Không lấy được thông tin các giải đấu',
        description: error.message,
        variant: 'destructive'
      })
    }
  }

  const searchCompetitions = async (name?: string, clubs?: string) => {
    const foundClubs = await searchClubs(clubs || '')
    const clubIds = foundClubs?.map((club) => club.id)

    const { data, error } = await supabase
      .from('competition')
      .select('*')
      .in('place_id', clubIds || [])
      .ilike('name', `%${name || ''}%`)
    if (data) {
      return data
    } else {
      toast({
        title: 'Không lấy được thông tin về giải đấu',
        description: error.message,
        variant: 'destructive'
      })
    }
  }

  const getCompetitionsForClub = async (id: number) => {
    const { data, error } = await supabase
      .from('competition')
      .select('*')
      .eq('place_id', id)
    if (data) {
      return data
    } else {
      toast({
        title: 'Không lấy được thông tin về giải đấu',
        description: error.message,
        variant: 'destructive'
      })
    }
  }

  return { getCompetitions, searchCompetitions, getCompetitionsForClub }
}
