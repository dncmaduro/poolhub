import { createClient } from '@supabase/supabase-js'
import { useToast } from './use-toast'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_KEY || ''
)

export const useMatch = () => {
  const { toast } = useToast()

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

  return { getMatches }
}
