import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../api/axios";

//========
//register
//post /api/auth/register
//============
export const registerUser = createAsyncThunk(
  "auth/register",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/register", formData);
      console.log("auth-register-api: ", response.data.user);
      return response.data.user;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Registration Failed",
      );
    }
  },
);
//================
// login
//post /api/auth/login
//========
export const loginUser = createAsyncThunk(
  "auth/login",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", formData);
      console.log("auth-login: ", response.data.user);
      return response.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login Failed");
    }
  },
);

//=================
//check existing login
//get /api/auth/me
//===========
export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/auth/me");
      console.log("auth-fetchCurrentUser: ", response?.data?.user);
      return response?.data?.user;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Not Authenticated",
      );
    }
  },
);

//======
//logout
//post /api/auth/logout
//========
export const logoutUser = createAsyncThunk(
  "/auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await api.post("/auth/logout");
      console.log("auth-logoutUser: true  ");
      return true;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Logout Failed");
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null,
  },
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    //Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action?.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //login
      .addCase(loginUser.pending, (state) => {
        ((state.loading = true), (state.error = null));
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action?.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload;
      })
      //session restore
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action?.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload;
      })
      //logout
      .addCase(logoutUser.pending, (state) => {
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action?.payload;
      });
  },
});

export const { clearAuthError } = authSlice.actions;

export default authSlice.reducer;
