import axios from 'axios';

// Backend eka run wenne port 5002 nisa e url eka laba denna
const API = axios.create({ baseURL: 'http://localhost:5002/api' });

export const fetchPlaces = () => API.get('/places');
export const fetchPlaceById = (id) => API.get(`/places/${id}`);
export const fetchGuides = () => API.get('/guides');

export default API;