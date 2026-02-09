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
        return handleResponse(response);
    },

    login: async (credentials) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });
        return handleResponse(response);
    },

    getMe: async () => {
        const response = await fetch(`${API_URL}/auth/me`, {
            headers: getAuthHeader()
        });
        return handleResponse(response);
    },

    getUsers: async () => {
        const response = await fetch(`${API_URL}/auth/users`, {
            headers: getAuthHeader()
        });
        return handleResponse(response);
    }
};

// Pet API
export const petAPI = {
    getAll: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        const response = await fetch(`${API_URL}/pets?${query}`, {
            headers: getAuthHeader()
        });
        return handleResponse(response);
    },

    getById: async (id) => {
        const response = await fetch(`${API_URL}/pets/${id}`, {
            headers: getAuthHeader()
        });
        return handleResponse(response);
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
        return handleResponse(response);
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
        return handleResponse(response);
    },

    delete: async (id) => {
        const response = await fetch(`${API_URL}/pets/${id}`, {
            method: 'DELETE',
            headers: getAuthHeader()
        });
        return handleResponse(response);
    },

    getStats: async () => {
        const response = await fetch(`${API_URL}/pets/stats`, {
            headers: getAuthHeader()
        });
        return handleResponse(response);
    }
};

// Customer API
export const customerAPI = {
    getAll: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        const response = await fetch(`${API_URL}/customers?${query}`, {
            headers: getAuthHeader()
        });
        return handleResponse(response);
    },

    getById: async (id) => {
        const response = await fetch(`${API_URL}/customers/${id}`, {
            headers: getAuthHeader()
        });
        return handleResponse(response);
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
        return handleResponse(response);
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
        return handleResponse(response);
    },

    delete: async (id) => {
        const response = await fetch(`${API_URL}/customers/${id}`, {
            method: 'DELETE',
            headers: getAuthHeader()
        });
        return handleResponse(response);
    }
};

// Order API
export const orderAPI = {
    getAll: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        const response = await fetch(`${API_URL}/orders?${query}`, {
            headers: getAuthHeader()
        });
        return handleResponse(response);
    },

    getById: async (id) => {
        const response = await fetch(`${API_URL}/orders/${id}`, {
            headers: getAuthHeader()
        });
        return handleResponse(response);
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
        return handleResponse(response);
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
        return handleResponse(response);
    },

    delete: async (id) => {
        const response = await fetch(`${API_URL}/orders/${id}`, {
            method: 'DELETE',
            headers: getAuthHeader()
        });
        return handleResponse(response);
    },

    getStats: async () => {
        const response = await fetch(`${API_URL}/orders/stats`, {
            headers: getAuthHeader()
        });
        return handleResponse(response);
    },

    track: async (orderNumber) => {
        const response = await fetch(`${API_URL}/orders/track/${orderNumber}`, {
            headers: { 'Content-Type': 'application/json' }
        });
        return handleResponse(response);
    }
};

// Dashboard API
export const dashboardAPI = {
    getStats: async () => {
        const response = await fetch(`${API_URL}/dashboard`, {
            headers: getAuthHeader()
        });
        return handleResponse(response);
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
        return handleResponse(response);
    }
};

// Appointment API
export const appointmentAPI = {
    getAll: async () => {
        const response = await fetch(`${API_URL}/appointments`, {
            headers: getAuthHeader()
        });
        return handleResponse(response);
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
        return handleResponse(response);
    }
};

// Review API
export const reviewAPI = {
    getAll: async () => {
        const response = await fetch(`${API_URL}/reviews`, {
            headers: getAuthHeader()
        });
        return handleResponse(response);
    },

    getAllAdmin: async () => {
        const response = await fetch(`${API_URL}/reviews/admin/all`, {
            headers: getAuthHeader()
        });
        return handleResponse(response);
    },

    create: async (reviewData) => {
        const response = await fetch(`${API_URL}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reviewData)
        });
        return handleResponse(response);
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
        return handleResponse(response);
    },

    delete: async (id) => {
        const response = await fetch(`${API_URL}/reviews/${id}`, {
            method: 'DELETE',
            headers: getAuthHeader()
        });
        return handleResponse(response);
    }
};
