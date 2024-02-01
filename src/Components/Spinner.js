import React from "react";
import { Triangle } from "react-loader-spinner";
import "../Styles/Spinner.css";

function Spinner() {
  return (
    <div className="spinner-loading">
      <Triangle width="200" color="#fff" />
    </div>
  );
}

export default Spinner;
