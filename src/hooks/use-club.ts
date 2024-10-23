import { createClient } from '@supabase/supabase-js'
import { useToast } from './use-toast'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_KEY || ''
)

export const useClub = () => {
  const { toast } = useToast()

  const getClubs = async () => {
    const { data, error } = await supabase.from('place').select('*')
    if (data) {
      return data
    } else {
      toast({
        title: 'Không lấy được thông tin câu lạc bộ',
        description: error.message,
        variant: 'destructive'
      })
    }
  }

  return { getClubs }
}
