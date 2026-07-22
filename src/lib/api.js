import axios from 'axios';

// Same-origin now: frontend and API routes live in the one Next.js deployment.
const api = axios.create({ baseURL: '/api' });

export const submitLead = (payload) => api.post('/leads', payload).then((r) => r.data);
export const submitBrochureRequest = (payload) =>
        api.post('/brochure-request', payload).then((r) => r.data);
export const sendChatMessage = (payload) => api.post('/chat', payload).then((r) => r.data);

export default api;
