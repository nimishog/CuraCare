import { useEffect } from "react";
import "./SplashScreen.css";
import animation from "../assets/animation.mp4";

export default function SplashScreen({ onComplete }) {

  useEffect(() => {
    // Move to Select Language after 5 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="splash-screen">

      {/* Video Animation */}
      <video
        className="logo-animation"
        autoPlay
        muted
        playsInline
      >
        <source src={animation} type="video/mp4" />
      </video>

      {/* CuraCare Text */}
      <h1 className="app-name">
        CuraCare
      </h1>

    </div>
  );
}