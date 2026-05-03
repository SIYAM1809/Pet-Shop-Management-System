const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleResponse = async (response) => {
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }
    return data;
};

// Auth API
export const authAPI = {
    register: async (userData) => {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader()
            },
            body: JSON.stringify(userData)
        });
        return await handleResponse(response);
    },

    login: async (credentials) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });
        return await handleResponse(response);
    },

    getMe: async () => {
        const response = await fetch(`${API_URL}/auth/me`, {
            headers: getAuthHeader()
        });
        return await handleResponse(response);
    },

    getUsers: async () => {
        const response = await fetch(`${API_URL}/auth/users`, {
            headers: getAuthHeader()
        });
        return await handleResponse(response);
    },

    customerRegister: async (userData) => {
        const response = await fetch(`${API_URL}/auth/customer-register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        return await handleResponse(response);
    },

    updateProfile: async (profileData) => {
        const response = await fetch(`${API_URL}/auth/profile`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
            body: JSON.stringify(profileData)
        });
        return await handleResponse(response);
    },

    deleteUser: async (id) => {
        const response = await fetch(`${API_URL}/auth/users/${id}`, {
            method: 'DELETE',
            headers: getAuthHeader()
        });
        return await handleResponse(response);
    }
};

// Pet API
export const petAPI = {
    getAll: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        const response = await fetch(`${API_URL}/pets?${query}`, {
            headers: getAuthHeader()
        });
        return await handleResponse(response);
    },

    getById: async (id) => {
        const response = await fetch(`${API_URL}/pets/${id}`, {
            headers: getAuthHeader()
        });
        return await handleResponse(response);
    },

    create: async (petData) => {
        const response = await fetch(`${API_URL}/pets`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader()
            },
            body: JSON.stringify(petData)
        });
        return await handleResponse(response);
    },

    update: async (id, petData) => {
        const response = await fetch(`${API_URL}/pets/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader()
            },
            body: JSON.stringify(petData)
        });
        return await handleResponse(response);
    },

    delete: async (id) => {
        const response = await fetch(`${API_URL}/pets/${id}`, {
            method: 'DELETE',
            headers: getAuthHeader()
        });
        return await handleResponse(response);
    },

    getStats: async () => {
        const response = await fetch(`${API_URL}/pets/stats`, {
            headers: getAuthHeader()
        });
        return await handleResponse(response);
    }
};

// Customer API
export const customerAPI = {
    getAll: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        const response = await fetch(`${API_URL}/customers?${query}`, {
            headers: getAuthHeader()
        });
        return await handleResponse(response);
    },

    getById: async (id) => {
        const response = await fetch(`${API_URL}/customers/${id}`, {
            headers: getAuthHeader()
        });
        return await handleResponse(response);
    },

    getMe: async () => {
        const response = await fetch(`${API_URL}/customers/me`, {
            headers: getAuthHeader()
        });
        return await handleResponse(response);
    },

    create: async (customerData) => {
        const response = await fetch(`${API_URL}/customers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader()
            },
            body: JSON.stringify(customerData)
        });
        return await handleResponse(response);
    },

    update: async (id, customerData) => {
        const response = await fetch(`${API_URL}/customers/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader()
            },
            body: JSON.stringify(customerData)
        });
        return await handleResponse(response);
    },

    delete: async (id) => {
        const response = await fetch(`${API_URL}/customers/${id}`, {
            method: 'DELETE',
            headers: getAuthHeader()
        });
        return await handleResponse(response);
    }
};

// Order API
export const orderAPI = {
    getAll: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        const response = await fetch(`${API_URL}/orders?${query}`, {
            headers: getAuthHeader()
        });
        return await handleResponse(response);
    },

    getById: async (id) => {
        const response = await fetch(`${API_URL}/orders/${id}`, {
            headers: getAuthHeader()
        });
        return await handleResponse(response);
    },

    create: async (orderData) => {
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader()
            },
            body: JSON.stringify(orderData)
        });
        return await handleResponse(response);
    },

    update: async (id, orderData) => {
        const response = await fetch(`${API_URL}/orders/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader()
            },
            body: JSON.stringify(orderData)
        });
        return await handleResponse(response);
    },

    delete: async (id) => {
        const response = await fetch(`${API_URL}/orders/${id}`, {
            method: 'DELETE',
            headers: getAuthHeader()
        });
        return await handleResponse(response);
    },

    getStats: async () => {
        const response = await fetch(`${API_URL}/orders/stats`, {
            headers: getAuthHeader()
        });
        return await handleResponse(response);
    },

    track: async (orderNumber) => {
        const response = await fetch(`${API_URL}/orders/track/${orderNumber}`, {
            headers: { 'Content-Type': 'application/json' }
        });
        return await handleResponse(response);
    },

    checkout: async (checkoutData) => {
        const response = await fetch(`${API_URL}/orders/checkout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader()
            },
            body: JSON.stringify(checkoutData)
        });
        return await handleResponse(response);
    }
};

// Dashboard API
export const dashboardAPI = {
    getStats: async () => {
        const response = await fetch(`${API_URL}/dashboard`, {
            headers: getAuthHeader()
        });
        return await handleResponse(response);
    }
};

// Inquiry API
export const inquiryAPI = {
    create: async (inquiryData) => {
        const response = await fetch(`${API_URL}/inquiries`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(inquiryData)
        });
        return await handleResponse(response);
    }
};

// Appointment API
export const appointmentAPI = {
    getAll: async () => {
        const response = await fetch(`${API_URL}/appointments`, {
            headers: getAuthHeader()
        });
        return await handleResponse(response);
    },

    updateStatus: async (id, status) => {
        const response = await fetch(`${API_URL}/appointments/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader()
            },
            body: JSON.stringify({ status })
        });
        return await handleResponse(response);
    }
};

// Review API
export const reviewAPI = {
    getAll: async () => {
        const response = await fetch(`${API_URL}/reviews`, {
            headers: getAuthHeader()
        });
        return await handleResponse(response);
    },

    getAllAdmin: async () => {
        const response = await fetch(`${API_URL}/reviews/admin/all`, {
            headers: getAuthHeader()
        });
        return await handleResponse(response);
    },

    create: async (reviewData) => {
        const response = await fetch(`${API_URL}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reviewData)
        });
        return await handleResponse(response);
    },

    updateStatus: async (id, status) => {
        const response = await fetch(`${API_URL}/reviews/${id}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader()
            },
            body: JSON.stringify({ status })
        });
        return await handleResponse(response);
    },

    delete: async (id) => {
        const response = await fetch(`${API_URL}/reviews/${id}`, {
            method: 'DELETE',
            headers: getAuthHeader()
        });
        return await handleResponse(response);
    }
};

// Product API (Accessories)
export const productAPI = {
    getAll: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        const response = await fetch(`${API_URL}/products?${query}`);
        return await handleResponse(response);
    },

    getFeatured: async () => {
        const response = await fetch(`${API_URL}/products/featured`);
        return await handleResponse(response);
    },

    getStats: async () => {
        const response = await fetch(`${API_URL}/products/stats`, {
            headers: getAuthHeader()
        });
        return await handleResponse(response);
    },

    getById: async (id) => {
        const response = await fetch(`${API_URL}/products/${id}`);
        return await handleResponse(response);
    },

    create: async (productData) => {
        const response = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
            body: JSON.stringify(productData)
        });
        return await handleResponse(response);
    },

    update: async (id, productData) => {
        const response = await fetch(`${API_URL}/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
            body: JSON.stringify(productData)
        });
        return await handleResponse(response);
    },

    delete: async (id) => {
        const response = await fetch(`${API_URL}/products/${id}`, {
            method: 'DELETE',
            headers: getAuthHeader()
        });
        return await handleResponse(response);
    }
};

// Rider / Delivery API
export const riderAPI = {
    // ── Rider-facing ──────────────────────────────────────────
    getStats: async () => {
        const response = await fetch(`${API_URL}/rider/stats`, {
            headers: getAuthHeader()
        });
        return await handleResponse(response);
    },

    getMyDeliveries: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        const response = await fetch(`${API_URL}/rider/deliveries?${query}`, {
            headers: getAuthHeader()
        });
        return await handleResponse(response);
    },

    updateDeliveryStatus: async (id, data) => {
        const response = await fetch(`${API_URL}/rider/deliveries/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
            body: JSON.stringify(data)
        });
        return await handleResponse(response);
    },

    // ── Admin-facing ──────────────────────────────────────────
    getAdminStats: async () => {
        const response = await fetch(`${API_URL}/rider/admin/stats`, {
            headers: getAuthHeader()
        });
        return await handleResponse(response);
    },

    getAllDeliveries: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        const response = await fetch(`${API_URL}/rider/admin/deliveries?${query}`, {
            headers: getAuthHeader()
        });
        return await handleResponse(response);
    },

    assignDelivery: async (data) => {
        const response = await fetch(`${API_URL}/rider/admin/assign`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
            body: JSON.stringify(data)
        });
        return await handleResponse(response);
    },

    // Fetch riders; optionally pass { area: 'Uttara' } to filter by zone
    getAvailableRiders: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        const response = await fetch(`${API_URL}/rider/admin/riders?${query}`, {
            headers: getAuthHeader()
        });
        return await handleResponse(response);
    },

    // Admin updates which areas a rider covers
    updateRiderAreas: async (riderId, areas) => {
        const response = await fetch(`${API_URL}/rider/admin/riders/${riderId}/areas`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
            body: JSON.stringify({ areas })
        });
        return await handleResponse(response);
    }
};

// ── Shared currency formatter (BDT ৳) ────────────────────────────
export const formatBDT = (value) =>
    `৳${Number(value || 0).toLocaleString('en-BD', { minimumFractionDigits: 0 })}`;
