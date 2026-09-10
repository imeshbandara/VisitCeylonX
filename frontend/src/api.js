import axios from 'axios';

// Backend eka run wenne port 5002 nisa e url eka laba denna
const API = axios.create({ baseURL: 'http://localhost:5002/api' });

export const fetchPlaces = () => API.get('/places');
export const fetchPlaceById = (id) => API.get(`/places/${id}`);
export const fetchGuides = () => API.get('/guides');
export const fetchEvents = () => API.get('/events');
export const fetchEventById = (id) => API.get(`/events/${id}`);
export const askVoiceAssistant = (payload, history = []) => {
    if (typeof payload === 'string') {
        return API.post('/ai/voice-assistant', { message: payload, history });
    }
    return API.post('/ai/voice-assistant', payload);
};

export default API;

