import React, { useState } from "react";
import "../Styles/Fetch.css";
import { IoArrowBack } from "react-icons/io5";
import {
  FaMapMarkedAlt,
  FaGlobeAmericas,
  FaMap,
  FaLandmark,
  FaMoneyBillWave,
  FaLanguage,
} from "react-icons/fa";
import NormalQuiz from "../Components/NormalQuiz";
import SpecialQuiz from "../Components/SpecialQuiz";

const quizTypes = [
  {
    key: "reach-country",
    title: "Reach the Country",
    description:
      "Start from a country and reach the destination country by moving through neighboring borders. Unique path-finding challenge!",
    main: true,
    icon: <FaMapMarkedAlt size={28} color="#202D36" />,
  },
  {
    key: "region",
    title: "Region Quiz",
    description:
      "Test your knowledge of world regions. Identify countries by their region.",
    icon: <FaGlobeAmericas size={24} color="#fdd835" />,
  },
  {
    key: "sub-region",
    title: "Sub-Region Quiz",
    description: "Challenge yourself to match countries to their sub-regions.",
    icon: <FaMap size={24} color="#fdd835" />,
  },
  {
    key: "capital",
    title: "Capital Quiz",
    description: "Guess the country by its capital city or vice versa.",
    icon: <FaLandmark size={24} color="#fdd835" />,
  },
  {
    key: "currencies",
    title: "Currencies Quiz",
    description: "Identify countries based on their official currencies.",
    icon: <FaMoneyBillWave size={24} color="#fdd835" />,
  },
  {
    key: "languages",
    title: "Languages Quiz",
    description: "Match countries to their official languages.",
    icon: <FaLanguage size={24} color="#fdd835" />,
  },
];

function Quiz() {
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const handleSelect = (key) => {
    setSelectedQuiz(key);
  };

  // Render Normal_Quiz with the selected quiz type as a prop
  if (
    selectedQuiz &&
    ["region", "sub-region", "capital", "currencies", "languages"].includes(
      selectedQuiz
    )
  ) {
    return (
      <>
        <div
          className="back-btn-container"
          data-aos="fade-right"
          style={{ paddingLeft: "40px" }}
        >
          <button
            type="button"
            onClick={() => {
              setSelectedQuiz(null);
            }}
          >
            <IoArrowBack /> Back
          </button>
        </div>
        <NormalQuiz quizType={selectedQuiz} />
      </>
    );
  } else if (selectedQuiz === "reach-country") {
    return (
      <>
        <div
          className="back-btn-container"
          data-aos="fade-right"
          style={{ paddingLeft: "40px" }}
        >
          <button
            type="button"
            onClick={() => {
              setSelectedQuiz(null);
            }}
          >
            <IoArrowBack /> Back
          </button>
        </div>
        <SpecialQuiz />
      </>
    );
  }

  return (
    <section className="main-body-section" style={{ height: "100%" }}>
      <div
        className="main-body-container"
        style={{ flexDirection: "column", gap: "48px", width: "100%" }}
      >
        {/* Main unique quiz card */}
        <div
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <div
            className="country-card"
            style={{
              width: 360,
              minHeight: 180,
              background: "linear-gradient(120deg, #fdd835 60%, #202D36 100%)",
              cursor: "pointer",
              marginBottom: 24,
              boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
              border: "2px solid #fdd835",
              borderRadius: 16,
              padding: 20,
              color: "#202D36",
              transition: "transform .3s ease",
            }}
            onClick={() => handleSelect("reach-country")}
            data-aos="fade-down"
          >
            <div
              className="ctd-info"
              style={{ display: "flex", flexDirection: "column", gap: 12 }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {quizTypes[0].icon}
                <p
                  className="ctd-title"
                  style={{ color: "#202D36", fontWeight: "bold", fontSize: 20 }}
                >
                  Reach the Country
                </p>
              </div>
              <p className="ctd-desc" style={{ color: "#202D36" }}>
                {quizTypes[0].description}
              </p>
            </div>
          </div>
        </div>

        {/* Other quizzes */}
        <div
          className="main-body-container"
          style={{
            flexWrap: "wrap",
            gap: 40,
            justifyContent: "center",
            width: "100%",
          }}
        >
          {quizTypes
            .filter((q) => !q.main)
            .map((quiz) => (
              <div
                key={quiz.key}
                className="country-card"
                style={{
                  width: 300,
                  minHeight: 150,
                  background: "var(--bg-color)",
                  color: "var(--text-color)",
                  border: "2px solid #fdd835",
                  borderRadius: 14,
                  cursor: "pointer",
                  padding: 20,
                  boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                  transition: "transform 0.3s",
                }}
                onClick={() => handleSelect(quiz.key)}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
                data-aos="fade-up"
              >
                <div
                  className="ctd-info"
                  style={{ display: "flex", flexDirection: "column", gap: 12 }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    {quiz.icon}
                    <p
                      className="ctd-title"
                      style={{ fontWeight: "bold", fontSize: 18 }}
                    >
                      {quiz.title}
                    </p>
                  </div>
                  <p
                    className="ctd-desc"
                    style={{ fontSize: 14, color: "var(--text-color)" }}
                  >
                    {quiz.description}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}

export default Quiz;
