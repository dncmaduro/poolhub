import { createClient } from '@supabase/supabase-js'
import { useToast } from './use-toast'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_KEY || ''
)

export const useClub = () => {
  const { toast } = useToast()

  const getClubs = async () => {
    const { data, error } = await supabase.from('place').select('*').range(0, 2)
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

  const getClub = async (id: number, toasting?: boolean) => {
    const { data, error } = await supabase
      .from('place')
      .select('*')
      .eq('id', id)
    if (data) {
      return data[0]
    } else {
      if (toasting) {
        toast({
          title: 'Không lấy được thông tin câu lạc bộ',
          description: error.message,
          variant: 'destructive'
        })
      }
    }
  }

  const searchClubs = async (name?: string, address?: string) => {
    const { data, error } = await supabase
      .from('place')
      .select('*')
      .ilike('name', `%${name || ''}%`)
      .ilike('address', `%${address || ''}%`)
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

  const getHostClubs = async (email: string) => {
    const { data, error } = await supabase
      .from('place')
      .select('*')
      .eq('host_email', email)
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

  const createClub = async (
    host_email: string,
    name: string,
    address: string,
    lat?: number,
    lon?: number
  ) => {
    const { data, error } = await supabase
      .from('place')
      .insert({ name, host_email, address, lat, lon })
      .select()
    if (data) {
      toast({
        title: 'Tạo câu lạc bộ thành công!'
      })
      return data[0]
    } else {
      toast({
        title: 'Không tạo được câu lạc bộ',
        description: error.message,
        variant: 'destructive'
      })
    }
  }

  return { getClubs, getClub, searchClubs, getHostClubs, createClub }
}
