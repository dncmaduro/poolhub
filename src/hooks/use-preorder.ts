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

  const getPreordersForClub = async (place_id: number, status?: string) => {
    const { data, error } = await supabase
      .from('preorder')
      .select('*')
      .ilike('status', `%${status || ''}%`)
      .eq('place_id', place_id)
    if (data) {
      return data
    } else {
      toast({
        title: 'Đặt lịch không thành công',
        description: error.message,
        variant: 'destructive'
      })
    }
  }

  const updatePreorder = async (id: number, status: string) => {
    const { data, error } = await supabase
      .from('preorder')
      .update({ status })
      .eq('id', id)
      .select()
    if (data) {
      return data[0]
    } else {
      toast({
        title: 'Cập nhật yêu cầu đặt chỗ không thành công',
        description: error.message,
        variant: 'destructive'
      })
    }
  }

  return { createPreorder, getPreordersForClub, updatePreorder }
}
