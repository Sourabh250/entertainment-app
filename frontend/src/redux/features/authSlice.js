import { createSlice } from '@reduxjs/toolkit';
import { clearBookmarks } from './bookmarksSlice';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
  },
  reducers: {
    login(state) {
      state.isAuthenticated = true;
    },
    logout(state) {
      state.isAuthenticated = false;
    }
  }
});

export const logoutThunk = () => async (dispatch) => {
  try {
    dispatch(clearBookmarks());
    dispatch(logout());
  } catch (err) {
    console.error('Error during logout:', err);
  }
};

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;