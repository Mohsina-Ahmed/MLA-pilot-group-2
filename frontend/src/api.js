import axios from 'axios';

function getUrl() {
    if (process.env.CODESPACES === "true") {
        return `https://${process.env.CODESPACE_NAME}-5300.app.github.dev`;
    } else {
        return `http://localhost:5300`;
    }
}

const baseURL = getUrl();

const api = axios.create({
    baseURL
});

export const createUser = payload => api.post(`/users/add`, payload);
export const trackExercise = payload => api.post(`/exercises/add`, payload);
