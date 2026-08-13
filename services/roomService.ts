import axios, {AxiosInstance, AxiosResponse} from "axios";
import {Room} from "@/types/Room";
import { getApiUrl } from "@/utils/utils";

class RoomService {

    getRoom = async (roomId: string): Promise<AxiosResponse<Array<string>>> => {
        const response = await axios.get(`${getApiUrl()}/room/${roomId.toUpperCase()}`);
        console.log("response", response);
        return response;
    }

    getAllPublicRooms = async (): Promise<AxiosResponse<string>> => {
        const response = await axios.get(`${getApiUrl()}/rooms`);
        console.log("response", response);
        return response;
    }

    getNumberOfActivesPlayers = async (): Promise<AxiosResponse<number>> => {
        const response = await axios.get(`${getApiUrl()}/rooms/players`);
        console.log("response", response);
        return response;
    }

    getAllPacks = async (): Promise<AxiosResponse<Array<string>>> => {
        const response = await axios.get(`${getApiUrl()}/packs`);
        console.log("response", response);
        return response;
    }

    editRoom = async (dataRoom: Room): Promise<AxiosResponse<string>> => {
        const response = await axios.put(`${getApiUrl()}/room/${dataRoom?.idUrl}`, dataRoom);
        console.log("response", response);
        return response;
    }

    launchRoom = async (roomData: Room): Promise<AxiosResponse<string>> => {
        const response = await axios.post(`${getApiUrl()}/launch-room`, roomData);
        console.log("response", response);
        return response;
    }
}

export default RoomService;
