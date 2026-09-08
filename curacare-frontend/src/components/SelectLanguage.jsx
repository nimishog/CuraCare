import { useState } from "react";
import "./SelectLanguage.css";
import logo from "../assets/logo.png";
import speaker from "../assets/sound.png";
import muteSpeaker from "../assets/soundoff.png";

export default function SelectLanguage({ onNext })   {
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  const languages = [
    { id: "english", symbol: "A", name: "English" },
    { id: "hindi", symbol: "अ", name: "हिंदी" },
    { id: "bengali", symbol: "অ", name: "বাংলা" },
    { id: "malayalam", symbol: "മ", name: "മലയാളം" },
    { id: "tamil", symbol: "அ", name: "தமிழ்" },
  ];
  const [isMuted, setIsMuted] = useState(false);

  return (
    <div className="language-page">
      <div className="language-card">

        {/* Back Button */}
        <button className="back-button">
          ←
        </button>

        {/* CuraCare Branding */}
         <div className="brand">

          <div className="brand-placeholder">
            <img
              src={logo}
              alt="CuraCare Logo"
            />
          </div>

          <h2>CuraCare</h2>
        </div>

        {/* Title */}
        <h1>Select Your Language</h1>

        {/* Language Cards */}
        <div className="languages">
          {languages.map((language) => (
            <button
              key={language.id}
              className={`language-option ${
                selectedLanguage === language.id ? "selected" : ""
              }`}
              onClick={() => setSelectedLanguage(language.id)}
            >
              <span className="language-symbol">
                {language.symbol}
              </span>

              <span className="language-name">
                {language.name}
              </span>
            </button>
          ))}
        </div>

        {/* Next Button */}
        <button
  className="next-button"
  disabled={!selectedLanguage}
  onClick={() => onNext(selectedLanguage)}
>
  Next
</button>

        {/* Sound Button */}
        <button
  className="sound-button"
  onClick={() => setIsMuted(!isMuted)}
>
  <img
    src={isMuted ? muteSpeaker : speaker}
    alt={isMuted ? "Muted" : "Speaker"}
  />
</button>

      </div>
    </div>
  );
}