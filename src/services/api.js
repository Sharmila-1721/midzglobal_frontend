import axios from 'axios';

/* =========================
   AXIOS INSTANCE
========================= */

const API = axios.create({

  baseURL:
  'http://localhost:8080/api'

});

/* =========================
   REQUEST INTERCEPTOR
========================= */

API.interceptors.request.use(

  (req) => {

    const token =
      localStorage.getItem('token');

    if (token) {

      req.headers.Authorization = `Bearer ${token}`;

    }

    return req;

  },

  (error) => {

    return Promise.reject(error);

  }

);

/* =========================
   RESPONSE INTERCEPTOR
========================= */

API.interceptors.response.use(

  (response) => {

    return response;

  },

  (error) => {

    /* TOKEN EXPIRED */

    if (

      error.response &&
      error.response.status === 401

    ) {

      localStorage.removeItem('token');

      localStorage.removeItem('user');

      window.location.href = '/login';

    }

    return Promise.reject(error);

  }

);

export default API;