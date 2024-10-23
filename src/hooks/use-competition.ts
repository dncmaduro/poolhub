import { createClient } from '@supabase/supabase-js'
import { useToast } from './use-toast'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_KEY || ''
)

export const useCompetition = () => {
  const { toast } = useToast()

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

  return { getCompetitions }
}
