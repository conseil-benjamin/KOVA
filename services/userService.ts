import axios from "axios";
import { getApiUrl } from "@/utils/utils";
import {User} from "@/types/User";

class UserService {

    /**
     * Retourne l'utilisateur, ou `null` si le pseudo n'existe pas.
     *
     * Le 404 est une réponse ATTENDUE ici (« pseudo libre ») : par défaut axios
     * rejette la promesse dès que le statut dépasse 400, si bien que le cas
     * « utilisateur inconnu » ne parvenait jamais à l'appelant — la condition
     * n'était pas seulement fausse, elle n'était jamais évaluée.
     */
    getUserDataByUsername = async (guestNameInput: string): Promise<User | null> => {
        const res = await axios.get<User>(
            `${getApiUrl()}/users/username/${guestNameInput.trim().toLowerCase()}`,
            { validateStatus: (status) => status === 200 || status === 404 }
        );
        // Le `res.data` couvre le cas d'une API qui répond 200 avec un corps vide
        // au lieu d'un 404.
        return res.status === 200 && res.data ? res.data : null;
    }

}
export default UserService;
