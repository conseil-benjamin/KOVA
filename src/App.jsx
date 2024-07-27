import './App.css'
import LandingPage from "./pages/LandingPage.jsx";
import {BrowserRouter as Router, Route, Routes, useLocation} from "react-router-dom";
import Error404 from "./pages/404/Error404.jsx";
import Jeux from "./pages/Jeux/Jeux.jsx";
import BlindtestRooms from "./pages/BlindtestRooms/BlindtestRooms.jsx";
import QuizzRooms from "./pages/QuizzRooms/QuizzRooms.jsx";
import PenduGame from "./pages/PenduGame/PenduGame.jsx";
import QuizzGame from "./pages/QuizzGame/QuizzGame.jsx";

function App() {

  return (
      <Router>
          <Routes>
                  <Route path="/" element={<LandingPage/>}/>{" "}
                  <Route path="*" element={<Error404 />} />
                  <Route path="/jouer" element={<Jeux/>}/>
                  <Route path={"/jeu/pendu"} element={<PenduGame />}/>
                  <Route path={"/jeu/quizz-rooms"} element={<QuizzRooms />}/>
                  <Route path={"/jeu/blindtest-rooms"} element={<BlindtestRooms />}/>
                  <Route path={'jeu/quizz/:roomCode'} element={<QuizzGame/>}/>
          </Routes>
      </Router>
  )
}

export default App
