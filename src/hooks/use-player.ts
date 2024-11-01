import { createClient } from '@supabase/supabase-js'
import { useToast } from './use-toast'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_KEY || ''
)

export const usePlayer = () => {
  const { toast } = useToast()

  const getPlayersForCompetition = async (id: number) => {
    const { data, error } = await supabase
      .from('player')
      .select('*')
      .eq('competition_id', id)
    if (data) {
      return data
    } else {
      toast({
        title: 'Không lấy được thông tin các thí sinh',
        description: error.message,
        variant: 'destructive'
      })
    }
  }

  return { getPlayersForCompetition }
}
