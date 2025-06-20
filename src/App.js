import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Home from "./Pages/Home";
import CountryDetails from "./Pages/CountryDetails";
import Quiz from "./Pages/Quiz";
import NotFound from "./Pages/NotFound";
import AOS from "aos";
import "./App.css";
import "aos/dist/aos.css";

function App() {
  useEffect(() => {
    AOS.init({
      offset: 50,
      duration: 500,
    });
  }, []);

  return (
    <Router basename="/">
      <div className="App">
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/:country" element={<CountryDetails />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
