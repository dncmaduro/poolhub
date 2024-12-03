import { createClient } from '@supabase/supabase-js'
import { useToast } from '@/hooks/use-toast'
import { useProfile } from '@/hooks/use-profile'
import { useDispatch } from 'react-redux'
import { setProfile } from '@/store/profileSlice'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_KEY || ''
)

export const useAuth = () => {
  const { toast } = useToast()
  const { createProfile, getProfile } = useProfile()
  const dispatch = useDispatch()

  const register = async (
    email: string,
    password: string,
    name: string,
    role?: string
  ) => {
    const { data: existData } = await supabase
      .from('account')
      .select('*')
      .eq('email', email)
    if (existData && existData.length > 0) {
      const data2 = await createProfile(
        email,
        name,
        role === undefined ? 'user' : role
      )
      if (data2) {
        toast({
          title: 'Đăng kí thành công'
        })
        return data2
      }
      return
    }
    const { data, error } = await supabase
      .from('account')
      .insert([{ email, password }])
      .select()
    if (data) {
      const data2 = await createProfile(email, name)
      if (data2) {
        toast({
          title: 'Đăng kí thành công'
        })
        return data2
      } else {
        toast({
          title: 'Đăng kí thất bại',
          description: 'Vui lòng thử lại',
          variant: 'destructive'
        })
      }
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
        const data2 = await getProfile(email)
        if (data2) {
          dispatch(
            setProfile({
              email,
              role: data2.role,
              name: data2.name,
              address: { lat: data2.lat, lon: data2.lon }
            })
          )
          toast({
            title: 'Đăng nhập thành công'
          })
          return data2
        } else {
          toast({
            title: 'Đăng nhập thất bại',
            description: 'Tài khoản chưa tồn tại',
            variant: 'destructive'
          })
        }
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
