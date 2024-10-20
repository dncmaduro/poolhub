import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface State {
  email: string
  name: string
  role: string
}

const initialState: State = {
  email: '',
  name: '',
  role: ''
}

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<State>) => {
      state.email = action.payload.email
      state.name = action.payload.name
      state.role = action.payload.role
    },
    clearProfile: (state) => {
      state.email = ''
      state.name = ''
      state.role = ''
    }
  }
})

export const { setProfile } = profileSlice.actions
export default profileSlice.reducer
