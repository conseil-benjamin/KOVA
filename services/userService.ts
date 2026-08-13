import axios, {AxiosResponse} from "axios";
import { getApiUrl } from "@/utils/utils";
import {User} from "@/types/User";

class UserService {

    getUserDataByUsername = async (guestNameInput: string): Promise<AxiosResponse<User>> => {
        return await axios.get(`${getApiUrl()}/users/username/${guestNameInput.trim()}`);
    }

}
export default UserService;
