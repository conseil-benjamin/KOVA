import axios from "axios";
import { getApiUrl } from "@/utils/utils";

class UserService {

    getUserDataByUsername = async (guestNameInput: string) => {
        try {
            const response = await axios.get(`${getApiUrl()}/users/username/${guestNameInput.trim()}`);
            console.log("response", response);
            return response;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

}
export default UserService;
