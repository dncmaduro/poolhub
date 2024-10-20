import { createClient } from '@supabase/supabase-js'
import { useToast } from './use-toast'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_KEY || ''
)

export const useAuth = () => {
  const { toast } = useToast()

  const register = async (email: string, password: string) => {
    const { data, error } = await supabase
      .from('account')
      .insert([{ email, password }])
      .select()
    if (data) {
      toast({
        title: 'Đăng kí thành công'
      })
      return data
    } else {
      toast({
        title: 'Đăng kí thất bại',
        description: error.message,
        variant: 'destructive'
      })
    }
  }

  return { register }
}
