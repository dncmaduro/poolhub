import { setAddress } from '@/store/profileSlice'
import { createClient } from '@supabase/supabase-js'
import { useToast } from './use-toast'
import { useDispatch } from 'react-redux'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_KEY || ''
)

export const useProfile = () => {
  const { toast } = useToast()
  const dispatch = useDispatch()

  const createProfile = async (email: string, name: string, role?: string) => {
    const { data, error } = await supabase
      .from('profile')
      .insert([{ email, name, role: role ?? 'user' }])
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

  const getProfileById = async (id: number) => {
    const { data } = await supabase.from('profile').select('*').eq('id', id)
    if (data) {
      return data[0]
    }
  }

  const searchProfiles = async (
    name?: string,
    minPoint?: number,
    ascendingPoint?: boolean,
    user?: boolean,
    page?: number
  ) => {
    const itemsPerPage = 10
    const exactPage = page || 1

    const { data, error } = await supabase
      .from('profile')
      .select('*')
      .ilike('name', `%${name || ''}%`)
      .gte('point', minPoint || 0)
      .order('point', { ascending: ascendingPoint })
      .ilike('role', `%${user ? 'user' : ''}%`)
      .range((exactPage - 1) * itemsPerPage, exactPage * itemsPerPage - 1)
    if (data) {
      return data
    } else {
      toast({
        title: 'Không lấy được thông tin hồ sơ',
        description: error.message,
        variant: 'destructive'
      })
    }
  }

  const updateProfile = async (
    email: string,
    name: string,
    phone?: string,
    birthyear?: number,
    lat?: number,
    lon?: number,
    address?: string
  ) => {
    const { data, error } = await supabase
      .from('profile')
      .update({ name, phone, birthyear, lat, lon, address })
      .eq('email', email)
      .select()
    if (data) {
      toast({
        title: 'Cập nhật hồ sơ thành công'
      })
      return data[0]
    } else {
      toast({
        title: 'Không thể cập nhật được hồ sơ',
        description: error.message,
        variant: 'destructive'
      })
    }
  }

  const countProfiles = async (
    name?: string,
    minPoint?: number,
    user?: boolean
  ) => {
    const { data } = await supabase
      .from('profile')
      .select('*')
      .ilike('name', `%${name || ''}%`)
      .gte('point', minPoint || 0)
      .ilike('role', `%${user ? 'user' : ''}%`)
    if (data) {
      return data.length
    }
  }

  const updateAddress = async (email: string, lat: number, lon: number) => {
    const { data } = await supabase
      .from('profile')
      .update({ lat, lon })
      .eq('email', email)
      .select()
    if (data) {
      dispatch(setAddress({ lat: data[0].lat, lon: data[0].lon }))
      return data[0]
    } else {
      toast({
        title: 'Cập nhật vị trí không thành công',
        variant: 'destructive'
      })
    }
  }

  return {
    createProfile,
    getProfile,
    getProfileById,
    searchProfiles,
    updateProfile,
    countProfiles,
    updateAddress
  }
}
