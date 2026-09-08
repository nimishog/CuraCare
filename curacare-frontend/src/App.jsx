import { useState } from "react";

import SplashScreen from "./components/SplashScreen";
import SelectLanguage from "./components/SelectLanguage";
import SelectRole from "./components/SelectRole";
import Check from "./components/check.jsx";
import DoctorLogin from "./components/DoctorLogin";
import OTPVerification from "./components/OTPVerification";

function App() {
  const [page, setPage] = useState("splash");

  const [language, setLanguage] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");

  return (
    <>
      {/* SPLASH SCREEN */}
      {page === "splash" && (
        <SplashScreen
          onComplete={() => setPage("language")}
        />
      )}

      {/* LANGUAGE PAGE */}
      {page === "language" && (
        <SelectLanguage
          onNext={(selectedLanguage) => {
            setLanguage(selectedLanguage);
            setPage("role");
          }}
        />
      )}

      {/* ROLE PAGE */}
      {page === "role" && (
        <SelectRole
          onBack={() => setPage("language")}
          onConfirm={(selectedRole) => {
            setRole(selectedRole);

            if (selectedRole === "doctor") {
              setPage("doctorLogin");
            }

            if (selectedRole === "patient") {
              setPage("check");
            }
          }}
        />
      )}

      {/* DOCTOR LOGIN PAGE */}
      {page === "doctorLogin" && (
        <DoctorLogin
          onBack={() => setPage("role")}
        />
      )}

      {/* PATIENT EMAIL PAGE */}
      {page === "check" && (
        <Check
          onBack={() => setPage("role")}
          onConfirm={(enteredEmail) => {
            setEmail(enteredEmail);

            console.log("Language:", language);
            console.log("Role:", role);
            console.log("Email:", enteredEmail);

            setPage("otp");
          }}
        />
      )}

      {/* OTP PAGE */}
      {page === "otp" && (
        <OTPVerification
          email={email}
          onBack={() => setPage("check")}
        />
      )}
    </>
  );
}

export default App;