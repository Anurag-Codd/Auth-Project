import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:4500/api/auth";
axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  user: null,
  error: null,
  message: null,
  isVarified: false,
  isAuthenticated: false,
  signup: async (username, email, password) => {
    set({ error: null });
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        username,
        email,
        password,
      });
      set({ message: response.data.message });
    } catch (error) {
      set({ error: error.response.data.message });
      throw error;
    }
  },
  verifyEmail: async (token) => {
    set({ error: null });
    try {
      const response = await axios.post(`${API_URL}/verify-email`, { token });
      set({
        isVarified: true,
        isAuthenticated: true,
        user: response.data.user,
        message: response.data.message,
      });
    } catch (error) {
      set({ error: error.response.data.message });
      throw error;
    }
  },
  Login: async (email, password) => {
    set({ error: null });
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      set({
        isVarified: response.data.user.isVarified,
        isAuthenticated: true,
        user: response.data.user,
        message: response.data.message,
      });
    } catch (error) {
      set({ error: error.response.data.message });
      throw error;
    }
  },
  Logout: async () => {
    set({ error: null });
    try {
      await axios.post(`${API_URL}/logout`);
      set({ user: null, isVarified: false,isAuthenticated: false });
    } catch (error) {
      set({ error: "Error logging out" });
      throw error;
    }
  },
  checkAuth: async () => {
    try {
      const response = await axios.get(`${API_URL}/check-auth`);
      set({
        isAuthenticated: true,
        user: response.data.user,
        isVarified: response.data.user.isVarified,
      });
    } catch (error) {
      set({ error: error.response.data.message });
    }
  },
  forgotPassword: async (email) => {
    set({ error: null });
    try {
      await axios.post(`${API_URL}/forgot-password`, { email });
      set({ error: "Password reset link sent!" });
    } catch (error) {
      set({ error: error.response.data.message });
      throw error;
    }
  },

  resetPassword: async (token, newPassword) => {
    set({ error: null });

    try {
      await axios.post(`${API_URL}/reset-password/${token}`, { newPassword });
    } catch (error) {
      set({ error: error.response.data.message });
      throw error;
    }
  },
}));
