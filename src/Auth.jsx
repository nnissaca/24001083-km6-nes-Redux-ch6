import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./App.css";
import LogInGoogle from "./LogInGoogle";
import { useDispatch, useSelector } from "react-redux";
import { getNowPlaying } from "./redux/actions/movieActions";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false); // State untuk menentukan apakah login berhasil
  const [currentMovie, setCurrentMovie] = useState(0);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();
  const nowPlaying = useSelector((state) => state?.movies.movieCarousel);

  // Regex untuk validasi email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Regex untuk validasi password: minimal 8 karakter, minimal satu huruf besar, minimal satu huruf kecil, minimal satu angka, dan minimal satu karakter khusus
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleEmailChange = (event) => {
    const newEmail = event.target.value;
    setEmail(newEmail);

    if (!newEmail.trim()) {
      setEmailError("Silakan isi email");
    } else if (!emailRegex.test(newEmail)) {
      setEmailError("Format email kurang lengkap");
    } else {
      setEmailError(null);
    }
  };

  const handlePasswordChange = (event) => {
    const newPassword = event.target.value;
    setPassword(newPassword);

    if (!newPassword.trim() === "") {
      setPasswordError("Silakan isi password");
    } else if (!passwordRegex.test(newPassword)) {
      setPasswordError("Password tidak cukup kuat");
    } else {
      setPasswordError(null);
    }
  };

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `https://shy-cloud-3319.fly.dev/api/v1/auth/login`,
        {
          email: email,
          password: password,
          expiresInMins: 30,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("Login ", response.data.data);
      setUser({ token: response.data.data.token });
      if (response?.status === 200) {
        setUser(response.data.data);
        setLoggedIn(true);
        localStorage.setItem("token", response.data.data.token);
        navigate("/home", {
          state: { token: response.data.data.token },
        });
        alert(`Validasi login berhasil. Selamat Datang!`);
        setLoggedIn(true);
      }
    } catch (error) {
      console.error("Server response:", error.response.data);
      alert("Login gagal. Email atau password tidak valid.");
    }

    await handleAuthorization();
  };

  const handleAuthorization = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const response = await axios.get(
        `https://shy-cloud-3319.fly.dev/api/v1/auth/me`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      console.log("Auth ", response.data.data);
      if (response.status === 200) {
        setLoggedIn(true);
        console.log("Auth ", response.data.data);
      }
    } catch (error) {
      console.error("Error checking login:", error);
      setLoggedIn(false);
    }
  };

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getNowPlaying());
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMovie((prevMovie) => (prevMovie + 1) % nowPlaying.length);
    }, 3000); // Ganti dengan interval yang diinginkan (dalam milidetik)

    return () => clearInterval(interval);
  }, [nowPlaying]);

  return (
    <>
      <GoogleOAuthProvider clientId="583892685023-9pbvp107t96827a6sapnquka2qt8bjp5.apps.googleusercontent.com">
        <div className="flex items-center flex-col mt-3 absolute w-screen">
          <div
            onClick={() => {
              navigate("/");
            }}
            className="self-start mr-12 text-white"
          >
            <div className="flex mb-28 ml-3 text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1rem"
                height="1rem"
                viewBox="0 0 24 24"
                className="align-middle mt-1"
              >
                <path
                  fill="white"
                  d="M20 11H7.83l5.59-5.59L12 4l-8 8l8 8l1.41-1.41L7.83 13H20z"
                ></path>
              </svg>
              <span className="ml-1 align-middle">Back to Home</span>
            </div>
          </div>
          <span
            className="bg-white flex items-center px-4 p-3 border-b-[1px]"
            style={{ width: "360px" }}
          >
            Log in to Your Account
          </span>
          <div
            className="flex items-center justify-center p-5 bg-white flex-col"
            style={{ width: "360px" }}
          >
            <form
              onSubmit={(e) => {
                handleSubmitLogin(e);
                handleAuthorization(e);
              }}
            >
              <div className="flex flex-col ml-3">
                <div className="relative border-[2px] mb-2 p-2 mr-9 ml-5 rounded-full">
                  <input
                    type="text"
                    name="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={handleEmailChange}
                    className="bg-white outline-none px-[13px]"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1.2rem"
                    height="1.2rem"
                    viewBox="0 0 24 24"
                    className="absolute top-3 right-4"
                  >
                    <path
                      fill="black"
                      d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2zm-2 0l-8 5l-8-5zm0 12H4V8l8 5l8-5z"
                    ></path>
                  </svg>
                </div>
                <div>
                  {emailError && (
                    <p className=" ml-6 mb-2" style={{ color: "red" }}>
                      {emailError}
                    </p>
                  )}
                </div>
                <div className="relative border-[2px] p-2 mb-2 mr-9 ml-5 rounded-full">
                  <input
                    type={showPassword ? "text" : "password"} // Menentukan apakah password ditampilkan atau tidak
                    name="password"
                    placeholder="Password"
                    value={password}
                    onChange={handlePasswordChange}
                    className="bg-transparent outline-none px-3"
                  />
                  <div
                    className="absolute top-3 right-4 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1.2rem"
                        height="1.2rem"
                        viewBox="0 0 1024 1024"
                      >
                        <path
                          fill="black"
                          d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 0 0 0 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3c7.7-16.2 7.7-35 0-51.5M512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258s279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766m-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176s176-78.8 176-176s-78.8-176-176-176m0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112s112 50.1 112 112s-50.1 112-112 112"
                        ></path>
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1.2rem"
                        height="1.2rem"
                        viewBox="0 0 24 24"
                      >
                        <g
                          fill="none"
                          stroke="black"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                        >
                          <path d="M5.45 16.92a10.78 10.78 0 0 1-2.55-3.71a1.85 1.85 0 0 1 0-1.46A10.59 10.59 0 0 1 6.62 7.1A9 9 0 0 1 12 5.48a8.81 8.81 0 0 1 4 .85m2.56 1.72a10.85 10.85 0 0 1 2.54 3.7a1.85 1.85 0 0 1 0 1.46a10.59 10.59 0 0 1-3.72 4.65A9 9 0 0 1 12 19.48a8.81 8.81 0 0 1-4-.85"></path>
                          <path d="M8.71 13.65a3.28 3.28 0 0 1-.21-1.17a3.5 3.5 0 0 1 3.5-3.5c.4-.002.796.07 1.17.21m2.12 2.12c.14.374.212.77.21 1.17a3.5 3.5 0 0 1-3.5 3.5a3.28 3.28 0 0 1-1.17-.21M3 20L19 4"></path>
                        </g>
                      </svg>
                    )}
                  </div>
                </div>
                {passwordError && (
                  <p className=" ml-6 mb-2" style={{ color: "red" }}>
                    {passwordError}
                  </p>
                )}
                <div>
                  <button
                    className="border-double mb-3 focus:border-4 border-2 border-white rounded-full bg-red-600 hover:bg-red-700 focus:bg-red-800 text-white px-4 py-2 mr-72 ml-5"
                    type="submit"
                  >
                    Login
                  </button>
                </div>
              </div>
            </form>
            <LogInGoogle className="login-button" />
          </div>
        </div>

        <div className="carousel flex">
          {nowPlaying?.map((movie, index) => (
            <div
              key={index}
              className={`carousel-slide ${
                index === currentMovie ? "show" : ""
              }`}
              style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
              }}
            ></div>
          ))}
        </div>
      </GoogleOAuthProvider>
    </>
  );
}
