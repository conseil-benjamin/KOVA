import axios, {AxiosInstance, AxiosResponse} from "axios";

class RoomService {

    getRoom = async (): Promise<AxiosResponse<any>> => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/room/${roomId.toUpperCase()}`);
            console.log("response", response);
            return response;
        } catch (error) {
            console.error(error);
        }
    }

    getAllPublicRooms = async (): Promise<AxiosResponse<any>> => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/rooms`);
            console.log("response", response);
            return response;
        } catch (error) {
            console.error(error);
        }
    }

    editRoom = async (dataRoom) => {
        try {
            const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/room/${dataRoom?.idUrl}`, dataRoom);
            console.log("response", response);
            return response;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    launchRoom = async (roomData) => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/launch-room`, roomData);
            console.log("response", response);
            return response;
        } catch (error) {
            console.log(error);
            return error;
        }
    }
}

export default RoomService;