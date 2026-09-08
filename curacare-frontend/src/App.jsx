import { useState } from "react";

import SplashScreen from "./components/SplashScreen";
import SelectLanguage from "./components/SelectLanguage";
import SelectRole from "./components/SelectRole";
import Check from "./components/check";
import DoctorLogin from "./components/DoctorLogin";
import DoctorRegister from "./components/DoctorRegister";
import OTPVerification from "./components/OTPVerification";

function App() {
  const [page, setPage] = useState("splash");

  const [language, setLanguage] = useState("");
  const [role, setRole] = useState("");

  // Patient authentication
  const [email, setEmail] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");

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

            const selected = selectedRole.toLowerCase();

            if (selected === "doctor") {
              setPage("doctorLogin");
            }

            if (selected === "patient") {
              setPage("check");
            }
          }}
        />
      )}

      {/* DOCTOR LOGIN */}
      {page === "doctorLogin" && (
        <DoctorLogin
          onBack={() => setPage("role")}
          onRegister={() => setPage("doctorRegister")}
        />
      )}

      {/* DOCTOR REGISTER */}
      {page === "doctorRegister" && (
        <DoctorRegister
          onBack={() => setPage("doctorLogin")}
          onLogin={() => setPage("doctorLogin")}
        />
      )}

      {/* PATIENT EMAIL PAGE */}
      {page === "check" && (
        <Check
          onBack={() => setPage("role")}
          setGeneratedOtp={setGeneratedOtp}
          onConfirm={(enteredEmail) => {
            setEmail(enteredEmail);

            console.log("Language:", language);
            console.log("Role:", role);
            console.log("Email:", enteredEmail);

            setPage("otp");
          }}
        />
      )}

      {/* PATIENT OTP PAGE */}
      {page === "otp" && (
        <OTPVerification
          email={email}
          generatedOtp={generatedOtp}
          onBack={() => setPage("check")}
        />
      )}
    </>
  );
}

export default App;