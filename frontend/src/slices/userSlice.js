import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch users
export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    const response = await axios.get('/api/users');
    return response.data;
});

// User slice
const userSlice = createSlice({
    name: 'users',
    initialState: {
        users: [],
        loading: false,
        error: null,
    },
    reducers: {
        addUser(state, action) {
            state.users.push(action.payload);
        },
        removeUser(state, action) {
            state.users = state.users.filter((user) => user.id !== action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { addUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
