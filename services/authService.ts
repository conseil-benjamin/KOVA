"use server"

import axios, {AxiosInstance, AxiosResponse} from "axios";

class AuthService {

    login = async (formDataToSend) => {
        const res = axios.post(`${process.env.API_URL}/api/login`, formDataToSend)
        .then((response: AxiosResponse) => {
            console.log(response);
        })
        .catch((error: AxiosResponse) => {
            console.log(error);
        })
       return res;
    }

    register = async (formDataToSend) => {
        const res = axios.post(`${process.env.API_URL}/api/register`, formDataToSend)
        .then((response: AxiosResponse) => {
            console.log(response)
        })
        .catch((error: AxiosResponse) => {
            console.log(error)
        })
        return res;
    }
}

export default AuthService;