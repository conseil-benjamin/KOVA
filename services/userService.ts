import axios, {AxiosInstance, AxiosResponse} from "axios";

class UserService {

    getUserDataByUsername = async (guestNameInput) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/username/${guestNameInput.trim()}`);
            console.log("response", response);
            return response;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

}
export default UserService;