import apiClient from "../apis/apiClient";

export const getBanners = async (userId: string) => {
    const res = await apiClient.get(`/banners?userId=${userId}`);
    return res.data;
};

export const addBanner = async (formData: FormData) => {
    const res = await apiClient.post("/banners", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
};

export const updateBanner = async (id: string, formData: FormData) => {
    const res = await apiClient.put(`/banners/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
};

export const deleteBanner = async (id: string) => {
    const res = await apiClient.delete(`/banners/${id}`);
    return res.data;
};



// ✅ Get all testimonials (optionally filtered by userId)
export const getTestimonials = async (userId: string) => {
    const res = await apiClient.get(`/testimonials?userId=${userId}`);
    return res.data;
};

// ✅ Add a new testimonial (supports image upload via FormData)
export const addTestimonial = async (formData: FormData) => {
    const res = await apiClient.post("/testimonials", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
};

// ✅ Update a testimonial by ID (supports image update)
export const updateTestimonial = async (id: string, formData: FormData) => {
    const res = await apiClient.put(`/testimonials/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
};

// ✅ Delete testimonial by ID
export const deleteTestimonial = async (id: string) => {
    const res = await apiClient.delete(`/testimonials/${id}`);
    return res.data;
};

// ✅ Get a single testimonial by ID (optional utility)
export const getTestimonialById = async (id: string) => {
    const res = await apiClient.get(`/testimonials/${id}`);
    return res.data;
};
