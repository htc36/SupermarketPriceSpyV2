import axios from 'axios';

const SERVER_URL = "http://45.76.124.20:8080/api"
// const SERVER_URL = "http://127.0.0.1:3000/api"

console.log(SERVER_URL + "@@@");

const instance = axios.create({
    baseURL: SERVER_URL,
    withCredentials: false
});

export default {

    instance: instance,

    // Other
    login: (email, password) => instance.post('/login',
        {email: email, password: password}),

    logout: () => instance.get('/logout/'),

    getAllProducts: (url) => instance.get(url),

    getProductDetails: (store, code, storeQuery) => instance.get(`/${store}/getHistory?code=${code}${storeQuery}`),

    getStoreNames: () => instance.get("/general/getStoresDropdown"),

    getProductALlStores: (productId, date, store) => instance.get(`/general/getProductAllStores?productCode=${productId}&date=${date}&store=${store}`),



}

