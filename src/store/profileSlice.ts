import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface State {
  email: string
  name: string
  role: string
  address: {
    lat: number | null
    lon: number | null
  }
}

interface Address {
  lat: number | null
  lon: number | null
}

const initialState: State = {
  email: '',
  name: '',
  role: '',
  address: {
    lat: 0,
    lon: 0
  }
}

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (state, action) => {
      state.email = action.payload.email
      state.name = action.payload.name
      state.role = action.payload.role
      state.address = {
        lat: action.payload.lat,
        lon: action.payload.lon
      }
    },
    setAddress: (state, action: PayloadAction<Address>) => {
      state.address = action.payload
    },
    clearProfile: (state) => {
      state.email = ''
      state.name = ''
      state.role = ''
      state.address = {
        lat: null,
        lon: null
      }
    }
  }
})

export const { setProfile, clearProfile, setAddress } = profileSlice.actions
export default profileSlice.reducer
