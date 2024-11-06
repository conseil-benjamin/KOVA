import React from 'react';
import Header from "../components/Header.jsx";
import { useNavigate } from "react-router-dom";
import CarouselLandingPage from "../components/CarouselLandingPage.jsx";

function LandingPage() {
    const navigate = useNavigate();

    const handleClickLink = (link) => {
        navigate(link);
        window.scrollTo(0, 0);
    }

    return (
        <div className="min-h-screen" style={{backgroundColor: "#344E41"}}> {/* Ensure the background covers the full screen */}
            <div className="mb-5">
                <Header />
            </div>
            <div className="flex flex-col items-center justify-center">
                <div className="flex flex-col items-center justify-center h-screen lg:flex-row lg:items-center">
                    <div className="lg:w-1/2 px-5">
                        <h1 className="text-white text-5xl mb-5">Bienvenue sur Kova, votre nouveau site préféré pour jouer en ligne !</h1>
                        <button onClick={() => handleClickLink('/jouer')} className="bg-yellow-600 rounded-md pl-6 pr-6 pt-2 pb-2 text-black mt-5 cursor-pointer hover:bg-red-500 hover:text-white">Jouer</button>
                    </div>
                    <div className="lg:w-1/2 mt-10 lg:mt-0">
                        <CarouselLandingPage />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LandingPage;
