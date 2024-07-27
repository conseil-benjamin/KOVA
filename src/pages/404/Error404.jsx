import {useNavigate} from "react-router-dom";

function Error404() {
    const navigate = useNavigate();

    return (
        <div className={'bg-gray-900 h-screen flex flex-col items-center justify-center text-white'}>
            <h1 className={'mb-8'}>404 - Not Found</h1>
            <button onClick={() => navigate("/")} className={'bg-yellow-600 p-2 rounded cursor-pointer'}>Retour à l'accueil</button>
        </div>
    );
}

export default Error404;
