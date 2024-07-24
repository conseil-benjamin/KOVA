import Header from "../components/Header.jsx";
import blindtest from '../assets/blindtest.jpg'

function LandingPage() {
  return (
      <>
          <div className={'mb-5'}>
              <Header/>
          </div>
          <div className={'flex flex-row items-center justify-center'}>
              <div className={'flex flex-col items-start'}>
                  <h1 className={'text-white text-5xl w-1/2'}>Bienvenue sur Kova, votre nouveau sité préféré pour jouer
                      en ligne !</h1>
                  <button className={'bg-yellow-600 rounded-md pl-6 pr-6 pt-2 pb-2 text-black mt-5 cursor-pointer hover:bg-red-500 hover:text-white'}>Jouer</button>
              </div>
              <div>
                  <img src={blindtest} alt="blindtest" className={'h-80 w-90'}/>
              </div>
          </div>
          <div>
              <h3 className={'text-white text-5xl text-center'}>Jeux disponibles</h3>
          </div>
      </>
  )
}

export default LandingPage
