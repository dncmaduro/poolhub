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

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase
      .from('account')
      .select('*')
      .eq('email', email)
    if (data) {
      const res = data[0]
      if (res.password === password) {
        toast({
          title: 'Đăng nhập thành công'
        })
      } else {
        toast({
          title: 'Đăng nhập thất bại',
          description: 'Sai mật khẩu',
          variant: 'destructive'
        })
      }
    } else {
      toast({
        title: 'Đăng nhập thất bại',
        description: error.message,
        variant: 'destructive'
      })
    }
  }

  return { register, login }
}
