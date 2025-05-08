// Ingen import, da axios er global fra CDN
const API_URL = 'http://localhost:5245/api/';

//#region Axios Interceptors
// Request interceptor: Tilføjer token fra localStorage til Authorization-header
axios.interceptors.request.use(config => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => Promise.reject(error));

// Response interceptor: Fjerner token og omdirigerer ved 401 Unauthorized
axios.interceptors.response.use(response => response, error => {
    if (error.response?.status === 401) {
        localStorage.removeItem('jwt_token');
        window.location.replace('index.html');
    }
    return Promise.reject(error);
});
//#endregion

//#region Login
export async function login(email, password) {
    try {
        const response = await axios.post(`${API_URL}Login`, {
            Email: email,
            PasswordHash: password // Klartekst, som backend forventer
        }, {
            headers: { 'Content-Type': 'application/json' },
        });
        console.log('Login API response:', response.data)
        return response.data; // Returnerer UserResponseDTO med Token
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
}
//#endregion

//#region CRUD
export async function getAll(resource) {
    try {
        const response = await axios.get(`${API_URL}${resource}/`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching ${resource}:`, error);
        throw error;
    }
}

export async function getById(resource, id) {
    try {
        const response = await axios.get(`${API_URL}${resource}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching ${resource} with ID ${id}:`, error);
        throw error;
    }
}

export async function getByEmail(resource, email) {
    try {
        const response = await axios.get(`${API_URL}${resource}/${email}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching ${resource} with email ${email}:`, error);
        throw error;
    }
}

export async function create(resource, data) {
    try {
        const response = await axios.post(`${API_URL}${resource}/`, data, {
            headers: { 'Content-Type': 'application/json' },
        });
        return response.data;
    } catch (error) {
        console.error(`Error creating ${resource}:`, error);
        throw error;
    }
}

export async function update(resource, id, data) {
    try {
        await axios.put(`${API_URL}${resource}/${id}`, data, {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error(`Error updating ${resource} with ID ${id}:`, error);
        throw error;
    }
}

export async function remove(resource, id) {
    try {
        await axios.delete(`${API_URL}${resource}/${id}`);
    } catch (error) {
        console.error(`Error deleting ${resource} with ID ${id}:`, error);
        throw error;
    }
}
//#endregion    