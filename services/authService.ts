import axios, {AxiosInstance, AxiosResponse} from "axios";

class AuthService {

    login = async (formDataToSend: FormData) => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/login`, formDataToSend);
            console.log("response", response);
            return response;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    register = async (formDataToSend: FormData) => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/register`, formDataToSend);
            console.log(response);
            return response;
        } catch (error) {
            console.log(error);
            return error;
        }
    }
}

export default AuthService;
