import axios from 'axios';

const BASE = process.env.REACT_APP_BACKEND_URL;
const api = axios.create({ baseURL: `${BASE}/api` });

export const submitLead = (payload) => api.post('/leads', payload).then((r) => r.data);
export const submitBrochureRequest = (payload) =>
        api.post('/brochure-request', payload).then((r) => r.data);
export const sendChatMessage = (payload) => api.post('/chat', payload).then((r) => r.data);

export default api;
