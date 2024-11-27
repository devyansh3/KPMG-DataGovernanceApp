import { configureStore } from '@reduxjs/toolkit';
import userSlice from "../slices/userSlice"


const adminStore = configureStore({
    reducer: {
        users: userSlice,
    },
});

export default adminStore;
