import {createSlice} from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'userSlice',
  initialState: {
    token: '',
    username: '',
  },
  reducers: {
    SetToken(state, action) {
      state.token = action.payload;
    },
    SetUsername(state, action) {
      state.username = action.payload;
    },
  },
});

export const {SetToken, SetUsername} = userSlice.actions;

export default userSlice.reducer;
