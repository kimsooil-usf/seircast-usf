/**
 * @author Sam Njoroge
 * @description File exports an instance of HTTP that has the baseURL added, and Authorization header if token is available. 
 * NOTE: Headers for this instance are updated whenever a user logs in (or page is reloaded)
 * 
 * Method: 
 * 
 * HTTP.defaults.headers.common['Authorization'] = that.getAuthorizationHeader.Authorization;
 * 
 * Files:
 * router.js
 * Login.vue
 * 
 */
import axios from 'axios';

export const HTTP = axios.create({
    baseURL: process.env.VUE_APP_AXIOS_BASE_URL,
    // headers: store.getters.getAuthorizationHeader,
});