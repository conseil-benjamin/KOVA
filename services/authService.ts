import axios, {AxiosInstance, AxiosResponse} from "axios";
import { getApiUrl } from "@/utils/utils";

class AuthService {

    login = async (formDataToSend: FormData) => {
        try {
            const response = await axios.post(`${getApiUrl()}/login`, formDataToSend);
            console.log("response", response);
            return response;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    register = async (formDataToSend: FormData) => {
        try {
            const response = await axios.post(`${getApiUrl()}/register`, formDataToSend);
            console.log(response);
            return response;
        } catch (error) {
            console.log(error);
            return error;
        }
    }
}

export default AuthService;
