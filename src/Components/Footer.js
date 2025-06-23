// Components/Footer.js
import { FaHeart } from "react-icons/fa";

const Footer = () => {
  return (
    <footer
      style={{
        marginTop: 40,
        padding: "16px 24px",
        textAlign: "center",
        justifyContent: "center",
        backgroundColor: "var(--nav-bg-color)",
        color: "var(--text-color)",
        boxShadow: "0 -2px 6px var(--nav-shadow-color)",
        fontSize: 18,
        fontWeight: 500,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span>Made with</span>
        <FaHeart color="#e53935" size={22} />
        <span>
          by{" "}
          <a
            href="https://github.com/amruthlp"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "inherit" }}
          >
            Amruth
          </a>{" "}
          · Nations Hub 🌍
        </span>
      </div>

      <p style={{ fontSize: 14 }}>
        Quiz features contributed by{" "}
        <a
          href="https://github.com/Sanskargupta0"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "inherit", textDecoration: "underline" }}
        >
          Sanskar
        </a>
      </p>
    </footer>
  );
};

export default Footer;
