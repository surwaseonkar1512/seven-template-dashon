import apiClient from "../apis/apiClient";

/* 🟢 Get Current User Profile */
export const getUserProfile = async () => {
    try {
        const res = await apiClient.get("/users/me");
        return res.data;
    } catch (error) {
        console.error("Error fetching profile:", error);
        throw error;
    }
};

/* 🟢 Update Current User (with optional avatar upload) */
export const updateUserProfile = async (formData: FormData) => {
    try {
        const res = await apiClient.put("/users/me", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data;
    } catch (error) {
        console.error("Error updating user profile:", error);
        throw error;
    }
};

/* 🟢 Delete Current User */
export const deleteUserProfile = async () => {
    try {
        const res = await apiClient.delete("/users/me");
        return res.data;
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
};

/* 🟣 Admin: Get All Users */
export const getAllUsers = async () => {
    try {
        const res = await apiClient.get("/users");
        return res.data;
    } catch (error) {
        console.error("Error fetching all users:", error);
        throw error;
    }
};

/* 🟣 Admin: Create New User */
export const adminCreateUser = async (formData: FormData) => {
    try {
        const res = await apiClient.post("/users/create", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data;
    } catch (error) {
        console.error("Error creating user (admin):", error);
        throw error;
    }
};

/* 🟣 Admin: Update Any User */
export const adminUpdateUser = async (userId: string, formData: FormData) => {
    try {
        const res = await apiClient.put(`/users/${userId}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data;
    } catch (error) {
        console.error(`Error updating user ${userId}:`, error);
        throw error;
    }
};

/* 🟣 Admin: Delete Any User */
export const adminDeleteUser = async (userId: string) => {
    try {
        const res = await apiClient.post(`/users/toggleUserActive/${userId}`);
        return res.data;
    } catch (error) {
        console.error(`Error deleting user ${userId}:`, error);
        throw error;
    }
};
