import React from "react";
import "./SplashScreen.css";
import splashVideo from "../assests/farm-splash1.mp4";

function SplashScreen() {
  return (
    <div className="splash">

      <video
        className="video-bg"
        src={splashVideo}
        autoPlay
        muted
        loop
        playsInline
      />

      <div className="overlay"></div>

      <div className="center-card">

        <div className="circle-loader"></div>

        <h1 className="logo-text">🌿 FarmConnect</h1>

        <p className="tag">Smart Agriculture Marketplace</p>

      </div>

      <div className="bottom-loader">
        <div className="line"></div>
      </div>

    </div>
  );
}

export default SplashScreen;