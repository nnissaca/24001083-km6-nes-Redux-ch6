import React, { useEffect, useState } from "react";
import "./App.css";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import AfterLogIn from "./components/AfterLogIn";
import BeforeLogIn from "./components/BeforeLogIn";

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, [location]);

  useEffect(() => {
    const handleNavigation = () => {
      const path = window.location.pathname;
      const token = localStorage.getItem("token");
      if (path === "/home" && !token) {
        navigate("/");
        alert("Anda harus login terlebih dahulu.");
      } else if (path === "/" && token) {
        alert(
          "Ingat, Anda masih login, silakan tekan logout untuk kembali ke tampilan non-login."
        );
        navigate("/home");
      }
    };
    handleNavigation();
  }, []);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Apakah Anda yakin ingin logout?");
    if (confirmLogout) {
      localStorage.removeItem("token");
      setLoggedIn(false);
      navigate("/"); // Navigate back to "/" after logout
    }
  };

  return (
    <>
      {loggedIn ? <AfterLogIn handleLogout={handleLogout} /> : <BeforeLogIn />}
    </>
  );
}
