import apiClient from "../apis/apiClient";

/* 🟢 User Signup (with optional avatar upload) */
export const signupUser = async (formData: any) => {
  try {
    const res = await apiClient.post("/auth/signup", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error) {
    console.error("Error during signup:", error);
    throw error;
  }
};

/* 🟢 Verify Signup OTP */
export const verifySignupOtp = async (email: string, otp: any) => {
  try {
    const res = await apiClient.post("/auth/verify-signup-otp", { email, otp });
    return res.data;
  } catch (error) {
    console.error("Error verifying signup OTP:", error);
    throw error;
  }
};

/* 🟢 Password Login */
export const passwordLogin = async (email: string, password: string) => {
  try {
    const res = await apiClient.post("/auth/login", { email, password });
    // Store token if available
    return res.data;
  } catch (error) {
    console.error("Error during password login:", error);
    throw error;
  }
};

/* 🟢 Send Login OTP */
export const sendLoginOtp = async (email: string) => {
  try {
    const res = await apiClient.post("/auth/send-login-otp", { email });
    return res.data;
  } catch (error) {
    console.error("Error sending login OTP:", error);
    throw error;
  }
};

/* 🟢 Verify Login OTP */
export const verifyLoginOtp = async (email: string, otp: any) => {
  try {
    const res = await apiClient.post("/auth/verify-login-otp", { email, otp });
    return res.data;
  } catch (error) {
    console.error("Error verifying login OTP:", error);
    throw error;
  }
};

/* 🟢 Forgot Password - Send OTP */
export const forgotPasswordSendOtp = async (email: string) => {
  try {
    const res = await apiClient.post("/auth/forgot-password", { email });
    return res.data;
  } catch (error) {
    console.error("Error sending forgot password OTP:", error);
    throw error;
  }
};

/* 🟢 Reset Password (with OTP:any) */
export const resetPasswordWithOtp = async (
  email: string,
  otp: any,
  newPassword: string
) => {
  try {
    const res = await apiClient.post("/auth/reset-password", {
      email,
      otp,
      newPassword,
    });
    return res.data;
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
};

/* 🟢 Admin: Create User */
export const adminCreateUser = async (formData: any) => {
  try {
    const res = await apiClient.post("/auth/admin-create-user", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error) {
    console.error("Error creating user by admin:", error);
    throw error;
  }
};

/* 🟢 Logout (Frontend only) */
export const logoutUser = () => {
  try {
    localStorage.removeItem("token");
  } catch (error) {
    console.error("Error clearing auth token:", error);
  }
};
