import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

interface UserState {
  user: { username: string, signedIn: boolean } | null; 
  books: {};
}

const initialState: UserState = {
  user: null,
  books: {},
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
    setUserBooks: (state, action: PayloadAction<any>) => {
      state.books = action.payload;
    }
  },
});

export const { setUser, setUserBooks } = userSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectUser = (state: RootState) => state.userState.user;
export const selectUserBooks = (state: RootState) => state.userState.books;

export default userSlice.reducer;