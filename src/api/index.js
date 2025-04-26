import axios from 'axios'
const baseApiUrl = import.meta.env.VITE_APP_BASE_API_URL
export const api = axios.create({
    baseURL: baseApiUrl, // your base URL
    timeout: 10000, // optional: timeout after 10 seconds
    headers: {
        'Content-Type': 'application/json',
    },
})

