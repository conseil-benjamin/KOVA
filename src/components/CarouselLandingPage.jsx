import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import blindtest from '../assets/blindtest.jpg';
import quizz from '../assets/quizz.jpg';
import pendu from '../assets/pendu.jpg';

function CarouselLandingPage() {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: false
    };

    return (
        <div
            className="w-full max-w-lg mx-auto rounded-lg overflow-hidden"> {/* Ajout des classes pour arrondir les coins */}
            <Slider {...settings}>
                <div>
                    <img src={pendu} alt="pendu"
                         className="h-80 w-full object-cover"/> {/* Les images respecteront les coins arrondis */}
                </div>
                <div>
                    <img src={quizz} alt="quizz" className="h-80 w-full object-cover"/>
                </div>
                <div>
                    <img src={blindtest} alt="blindtest" className="h-80 w-full object-cover"/>
                </div>
            </Slider>
        </div>
    );
}

export default CarouselLandingPage;
