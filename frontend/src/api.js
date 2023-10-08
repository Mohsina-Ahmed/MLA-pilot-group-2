import axios from 'axios';

const baseURL = process.env.BASE_URL || 'http://localhost:5300';

const api = axios.create({
    baseURL
});

export const createUser = payload => api.post(`/users/add`, payload);
export const trackExercise = payload => api.post(`/exercises/add`, payload);