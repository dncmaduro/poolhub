import { createClient } from '@supabase/supabase-js'
import { useToast } from './use-toast'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_KEY || ''
)

export const useRating = () => {
  const { toast } = useToast()

  const checkRating = async (profile_id: number, place_id: number) => {
    const { data, error } = await supabase
      .from('ratings')
      .select('*')
      .eq('profile_id', profile_id)
      .eq('place_id', place_id)

    if (data && data.length > 0) {
      return true
    }

    return false
  }

  const createRating = async (
    profile_id: number,
    place_id: number,
    rating: number,
    comment?: string
  ) => {
    const { data } = await supabase
      .from('ratings')
      .insert({ profile_id, place_id, rating, comment })
      .select()

    if (data) {
      toast({
        title: 'Gửi đánh giá thành công'
      })
      return data
    } else {
      toast({
        title: 'Gửi đánh giá không thành công',
        variant: 'destructive'
      })
    }
  }

  const getRatings = async (place_id: number) => {
    const { data, error } = await supabase
      .from('ratings')
      .select('*')
      .eq('place_id', place_id)

    if (data && data.length > 0) {
      const avg = data.reduce((acc, rate) => acc + rate.rating, 0) / data.length
      return { data, avg }
    }

    if (data && data.length === 0) {
      return { data, avg: 0 }
    }

    toast({
      title: 'Lấy đánh giá không thành công',
      variant: 'destructive'
    })
  }

  return { checkRating, createRating, getRatings }
}
