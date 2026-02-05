const API_URL = 'http://localhost:5000/api';

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
