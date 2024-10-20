import { createClient } from '@supabase/supabase-js'
import { useToast } from '@/hooks/use-toast'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_KEY || ''
)

export const useProfile = () => {
  const { toast } = useToast()

  const createProfile = async (email: string, name: string) => {
    const { data, error } = await supabase
      .from('profile')
      .insert([{ email, name, role: 'user' }])
      .select()
    if (data) {
      return data
    } else {
      toast({
        title: 'Đăng kí thất bại',
        description: error.message,
        variant: 'destructive'
      })
    }
  }

  const getProfile = async (email: string) => {
    const { data } = await supabase
      .from('profile')
      .select('*')
      .eq('email', email)
    if (data) {
      return data[0]
    }
  }

  return { createProfile, getProfile }
}
