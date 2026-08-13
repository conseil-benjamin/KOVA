import axios, {AxiosInstance, AxiosResponse} from "axios";
import { getApiUrl } from "@/utils/utils";
import {User} from "@/types/User";

class AuthService {

    login = async (formDataToSend: FormData): Promise<AxiosResponse<string>> => {
        const response = await axios.post(`${getApiUrl()}/login`, formDataToSend);
        console.log("response", response);
        return response;
    }

    register = async (formDataToSend: FormData): Promise<AxiosResponse<string>> => {
        const response = await axios.post(`${getApiUrl()}/register`, formDataToSend);
        console.log(response);
        return response;
    }
}

export default AuthService;
