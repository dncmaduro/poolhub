import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface State {
  email: string
  name: string
  role: string
  address: {
    lat: number
    lon: number
  }
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
    setProfile: (state, action: PayloadAction<State>) => {
      state.email = action.payload.email
      state.name = action.payload.name
      state.role = action.payload.role
      state.address = action.payload.address
    },
    clearProfile: (state) => {
      state.email = ''
      state.name = ''
      state.role = ''
      state.address = {
        lat: 0,
        lon: 0
      }
    }
  }
})

export const { setProfile, clearProfile } = profileSlice.actions
export default profileSlice.reducer
