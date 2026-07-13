import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
//import axiosInstance from "../api/axiosInstance";

// Register User  
export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/user/register", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.msg || "Registration failed"
            );
        }
    }
);

// Login User
export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/user/login", userData);

            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
            }

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.msg || "Login failed"
            );
        }
    }
);

// Get Logged In User
export const getUserInfo = createAsyncThunk(
    "auth/getUserInfo",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/user/getUserInfo");
            return response.data.loggedUser;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.msg || "Failed to fetch user"
            );
        }
    }
);

const initialState = {
    token: localStorage.getItem("token") || null,
    isAuthenticated: !!localStorage.getItem("token"),
    user: null,
    loading: false,
    error: null,
    registrationStatus: null,
    loginStatus: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,

    reducers: {
        logout: (state) => {
            localStorage.removeItem("token");

            state.token = null;
            state.isAuthenticated = false;
            state.user = null;
            state.loading = false;
            state.error = null;
            state.registrationStatus = null;
            state.loginStatus = null;
        },

        clearError: (state) => {
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder

            // Register
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.registrationStatus = "loading";
            })

            .addCase(registerUser.fulfilled, (state) => {
                state.loading = false;
                state.registrationStatus = "success";
            })

            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.registrationStatus = "failed";
                state.error = action.payload;
            })

            // Login
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.loginStatus = "loading";
            })

            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.loginStatus = "success";
                state.token = action.payload.token;
                state.isAuthenticated = true;
            })

            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.loginStatus = "failed";
                state.isAuthenticated = false;
                state.token = null;
                state.error = action.payload;
            })

            // Get User Info
            .addCase(getUserInfo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(getUserInfo.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })

            .addCase(getUserInfo.rejected, (state, action) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.error = action.payload;
            });
    },
});

export const { logout, clearError } = authSlice.actions;

export default authSlice.reducer;