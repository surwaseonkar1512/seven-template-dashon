import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
}

interface AuthResponse {
    token: string;
    user: User;
}

interface AuthState {
    user: AuthResponse | null;
}

const storedUser = localStorage.getItem('user');

const initialState: AuthState = {
    user: storedUser ? JSON.parse(storedUser) : null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action: PayloadAction<AuthResponse>) => {
            state.user = action.payload;
            localStorage.setItem('user', JSON.stringify(action.payload));
            console.log('✅ User logged in:', action.payload);
        },
        logout: (state) => {
            state.user = null;
            localStorage.removeItem('user');
        },
    },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
