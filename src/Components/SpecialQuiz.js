import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { FaCheckCircle, FaTrophy, FaFlag, FaRoute, FaRedo, FaSync } from "react-icons/fa";
import HopAnimation from "./HopAnimation";
import { findCountryName } from "./CountryCodes";
import * as dijkstra from "dijkstrajs";

const API_URL = "https://restcountries.com/v3.1/all?fields=cca3,name,flags,borders";

function getRandomCountry(countries) {
  return countries[Math.floor(Math.random() * countries.length)];
}

function buildGraph(countries) {
  // Graph: { [cca3]: { [neighbor_cca3]: 1, ... }, ... }
  const graph = {};
  countries.forEach((c) => {
    if (!c.cca3) return;
    graph[c.cca3] = {};
    if (Array.isArray(c.borders)) {
      c.borders.forEach((b) => {
        graph[c.cca3][b] = 1;
      });
    }
  });
  return graph;
}

function getFlag(country) {
  return country?.flags?.png || country?.flags?.svg || "";
}

function SpecialQuiz() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [current, setCurrent] = useState(null);
  const [path, setPath] = useState([]);
  const [hops, setHops] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [shortestPath, setShortestPath] = useState([]);
  const [showShortest, setShowShortest] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [highScore, setHighScore] = useState(parseInt(localStorage.getItem(`specialquiz_highscore_of_${start?.cca3}_${end?.cca3}`) || "0", 10));

  // Animation state
  const [animationFrom, setAnimationFrom] = useState(null);
  const [animationTo, setAnimationTo] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setCountries(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (countries.length > 0) startNewGame();
    // eslint-disable-next-line
  }, [countries]);

  function startNewGame() {
    let s, e;
    // Ensure start and end are different and both have borders
    do {
      s = getRandomCountry(countries);
      e = getRandomCountry(countries);
    } while (
      (!s.borders || s.borders.length === 0) ||
      (!e.borders || e.borders.length === 0) ||
      s.cca3 === e.cca3
    );
    setStart(s);
    setEnd(e);
    setCurrent(s);
    setPath([s.cca3]);
    setHops(0);
    setWrong(0);
    setShowResult(false);
    setShortestPath([]);
    setShowShortest(false);
    setHighScore(parseInt(localStorage.getItem(`specialquiz_highscore_of_${s.cca3}_${e.cca3}`) || "0", 10));
  }

  function resetStats() {
    setCurrent(start);
    setPath([start.cca3]);
    setHops(0);
    setWrong(0);
    setShowResult(false);
    setShowShortest(false);
  }

  function handleBorderClick(borderCca3) {
    if (showResult || animating) return;
    setAnimating(true);
    setAnimationFrom(current.cca3);
    setAnimationTo(borderCca3);
    setTimeout(() => {
      setAnimating(false);
      setAnimationFrom(null);
      setAnimationTo(null);
      const nextCountry = countries.find((c) => c.cca3 === borderCca3);
      if (!nextCountry) {
        toast.error("Invalid country.");
        setWrong((w) => w + 1);
        return;
      }
      setCurrent(nextCountry);
      setPath((p) => [...p, borderCca3]);
      setHops((h) => h + 1);
      if (borderCca3 === end.cca3) {
        // Game finished
        setShowResult(true);
        // Calculate shortest path
        const graph = buildGraph(countries);
        let shortest = [];
        try {
          shortest = dijkstra.find_path(graph, start.cca3, end.cca3);
        } catch {
          shortest = [];
        }
        setShortestPath(shortest);
        // High score: fewer hops is better
        if (highScore === 0 || hops + 1 < highScore) {
          setHighScore(hops + 1);
          localStorage.setItem(`specialquiz_highscore_of_${start?.cca3}_${end?.cca3}`, hops + 1);
        }
        toast.success("You reached the destination!", { icon: <FaCheckCircle color="#4caf50" /> });
      } else {
        toast("Hopped to " + findCountryName(borderCca3), { icon: <FaFlag color="#fdd835" /> });
      }
    }, 700); // Animation duration
  }

  function handleShowShortest() {
    if (!shortestPath || shortestPath.length === 0) return;
    setShowShortest((show) => !show);
    if (!showShortest) {
      toast("Shortest path shown below", { icon: <FaRoute color="#fdd835" /> });
    }
  }

  function handleRestart() {
    startNewGame();
  }

  if (loading || !start || !end || !current) {
    return (
      <div style={{ minHeight: 300, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '18px', color: 'var(--text-color)' }}>
        Loading quiz...
      </div>
    );
  }

  // Get border country objects for current
  const borderCountries = (current.borders || [])
    .map((cca3) => countries.find((c) => c.cca3 === cca3))
    .filter(Boolean);

  return (
    <div style={{ minHeight: '70vh', padding: 20, backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', display: 'flex', justifyContent: 'center' }}>
      <div style={{ height:'100%', width: '100%', maxWidth: 600, backgroundColor: 'var(--nav-bg-color)', borderRadius: 16, padding: 24, boxShadow: '0 4px 24px var(--nav-shadow-color)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <FaFlag color="#fdd835" />
            <span style={{ fontWeight: 700 }}>Start:</span>
            <img src={getFlag(start)} alt={findCountryName(start.cca3)} style={{ width: 36, height: 24, borderRadius: 4 }} />
            <span>{findCountryName(start.cca3)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <FaFlag color="#e53935" />
            <span style={{ fontWeight: 700 }}>End:</span>
            <img src={getFlag(end)} alt={findCountryName(end.cca3)} style={{ width: 36, height: 24, borderRadius: 4 }} />
            <span>{findCountryName(end.cca3)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#fdd835', fontWeight: 700 }}>
            <FaTrophy /> Best: {highScore === 0 ? '-' : highScore} hops
          </div>
        </div>
        <hr style={{ borderColor: 'var(--btn-hover)', margin: '16px 0' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <span style={{ fontWeight: 700, color: '#fdd835' }}>Current:</span>
          <img src={getFlag(current)} alt={findCountryName(current.cca3)} style={{ width: 48, height: 32, borderRadius: 4 }} />
          <span style={{ fontWeight: 700 }}>{findCountryName(current.cca3)}</span>
          <span style={{ marginLeft: 'auto', color: '#fdd835', fontWeight: 600 }}>Hops: {hops}</span>
          <span style={{ color: '#e53935', fontWeight: 600 }}>Wrong: {wrong}</span>
        </div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
          <button onClick={resetStats} style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', border: '2px solid #fdd835', borderRadius: 6, padding: '6px 14px', fontWeight: 600, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}><FaRedo /> Reset</button>
          <button onClick={handleRestart} style={{ backgroundColor: '#fdd835', color: '#202D36', border: 'none', borderRadius: 6, padding: '6px 14px', fontWeight: 600, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}><FaSync /> New Question</button>
          {showResult && shortestPath.length > 1 && (
            <button onClick={handleShowShortest} style={{ backgroundColor: showShortest ? '#4caf50' : '#fdd835', color: showShortest ? '#fff' : '#202D36', border: 'none', borderRadius: 6, padding: '6px 14px', fontWeight: 600, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}><FaRoute /> {showShortest ? 'Hide Shortest Path' : 'Show Shortest Path'}</button>
          )}
        </div>
        <HopAnimation from={animationFrom} to={animationTo} countries={countries} />
        {showResult ? (
          <div style={{ textAlign: 'center', paddingTop: 20 }}>
            <h2 style={{ fontSize: 28, color: '#fdd835', marginBottom: 10 }}>You reached the destination!</h2>
            <p style={{ fontSize: 20 }}>Total Hops: <strong style={{ color: '#fdd835' }}>{hops}</strong></p>
            <p style={{ fontSize: 18 }}>Your Path: {path.map((c, i) => (
              <span key={c} style={{ color: c === end.cca3 ? '#e53935' : c === start.cca3 ? '#fdd835' : 'var(--text-color)', fontWeight: 700 }}>{findCountryName(c)}{i < path.length - 1 ? ' → ' : ''}</span>
            ))}</p>
            {showShortest && shortestPath.length > 1 && (
              <div style={{ margin: '18px 0', fontSize: 16, color: '#4caf50', fontWeight: 700 }}>
                <span>Shortest: {shortestPath.map((c, i) => (
                  <span key={c}>{findCountryName(c)}{i < shortestPath.length - 1 ? ' → ' : ''}</span>
                ))}</span>
              </div>
            )}
            <button onClick={handleRestart} style={{ marginTop: 16, padding: '10px 20px', borderRadius: 6, fontWeight: 700, fontSize: 16, backgroundColor: '#fdd835', color: '#202D36', border: 'none', cursor: 'pointer' }}>
              Play Again
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
              {borderCountries.length === 0 ? (
                <div style={{ color: '#e53935', fontWeight: 700, fontSize: 18 }}>No bordering countries! (Island or error)</div>
              ) : borderCountries.map((bc) => (
                <button
                  key={bc.cca3}
                  onClick={() => handleBorderClick(bc.cca3)}
                  disabled={animating || showResult}
                  style={{
                    backgroundColor: 'var(--bg-color)',
                    color: 'var(--text-color)',
                    border: '2px solid #fdd835',
                    borderRadius: 6,
                    padding: '10px 14px',
                    fontWeight: 600,
                    fontSize: 16,
                    cursor: animating || showResult ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <img src={getFlag(bc)} alt={findCountryName(bc.cca3)} style={{ width: 32, height: 20, borderRadius: 3 }} />
                  {findCountryName(bc.cca3)}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SpecialQuiz;