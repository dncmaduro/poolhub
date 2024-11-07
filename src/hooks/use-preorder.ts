import { createClient } from '@supabase/supabase-js'
import { useToast } from './use-toast'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_KEY || ''
)

export const usePreorder = () => {
  const { toast } = useToast()

  const createPreorder = async (place_id: number, time: Date) => {
    const { data, error } = await supabase
      .from('preorder')
      .insert({ place_id, time })
      .select()
    if (data) {
      toast({
        title: 'Ghi nhận đặt lịch, vui lòng chờ'
      })
      return data[0]
    } else {
      toast({
        title: 'Đặt lịch không thành công',
        description: error.message,
        variant: 'destructive'
      })
    }
  }

  return { createPreorder }
}
