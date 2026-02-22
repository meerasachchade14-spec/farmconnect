import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";

import Landing from "./pages/Landing";
import Login from "./pages/login";
import Register from "./pages/register";
import Features from "./pages/features";
import SplashScreen from "./pages/SplashScreen";

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <SplashScreen key="splash" onFinish={() => setLoading(false)} />
      ) : (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/features" element={<Features />} />
          </Routes>
        </BrowserRouter>
      )}
    </AnimatePresence>
  );
}

export default App;