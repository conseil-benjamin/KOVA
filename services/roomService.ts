import axios, {AxiosInstance, AxiosResponse} from "axios";
import {Room} from "@/types/Room";
import { getApiUrl } from "@/utils/utils";

class RoomService {

    getRoom = async (roomId: string): Promise<AxiosResponse<any>> => {
        try {
            const response = await axios.get(`${getApiUrl()}/room/${roomId.toUpperCase()}`);
            console.log("response", response);
            return response;
        } catch (error) {
            console.error(error);
        }
    }

    getAllPublicRooms = async (): Promise<AxiosResponse<any>> => {
        try {
            const response = await axios.get(`${getApiUrl()}/rooms`);
            console.log("response", response);
            return response;
        } catch (error) {
            console.error(error);
        }
    }

    getNumberOfActivesPlayers = async (): Promise<AxiosResponse<any>> => {
        try {
            const response = await axios.get(`${getApiUrl()}/rooms/players`);
            console.log("response", response);
            return response;
        } catch (error) {
            console.error(error);
        }
    }

    getAllPacks = async (): Promise<AxiosResponse<any>> => {
        try {
            const response = await axios.get(`${getApiUrl()}/packs`);
            console.log("response", response);
            return response;
        } catch (error) {
            console.error(error);
        }
    }

    editRoom = async (dataRoom: Room) => {
        try {
            const response = await axios.put(`${getApiUrl()}/room/${dataRoom?.idUrl}`, dataRoom);
            console.log("response", response);
            return response;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    launchRoom = async (roomData: Room) => {
        try {
            const response = await axios.post(`${getApiUrl()}/launch-room`, roomData);
            console.log("response", response);
            return response;
        } catch (error) {
            console.log(error);
            return error;
        }
    }
}

export default RoomService;
