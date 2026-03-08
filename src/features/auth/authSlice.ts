import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  AuthState,
  TokenResponse,
  Plan,
  Preferences,
} from "@/types/auth.types";

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: localStorage.getItem("refreshToken"),
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<TokenResponse>) => {
      state.user = {
        ...action.payload.user,
        plan: action.payload.user.plan ?? "free",
      };
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      localStorage.setItem("refreshToken", action.payload.refreshToken);
    },

    updateAccessToken: (state, action: PayloadAction<TokenResponse>) => {
      state.user = {
        ...action.payload.user,
        plan: action.payload.user.plan ?? "free",
      };
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      localStorage.setItem("refreshToken", action.payload.refreshToken);
    },

    updateUserPlan: (state, action: PayloadAction<Plan>) => {
      if (state.user) state.user.plan = action.payload;
    },

    // Updates preferences in Redux after PATCH /auth/me/preferences
    updateUserPreferences: (
      state,
      action: PayloadAction<Partial<Preferences>>,
    ) => {
      if (state.user) {
        state.user.preferences = {
          ...state.user.preferences,
          ...action.payload,
        };
      }
    },

    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem("refreshToken");
    },
  },
});

export const {
  setCredentials,
  updateAccessToken,
  updateUserPlan,
  updateUserPreferences,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
