import React, { useEffect, useState } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getNowPlaying, getPopular } from "../redux/actions/movieActions";
import axios from "axios";

export default function AfterLogIn() {
  const API_KEY = "52b2a50250de0b7306b76a36c51029e8";
  const nowPlaying = useSelector((state) => state?.movies.movieCarousel);
  const popular = useSelector((state) => state?.movies.moviePopular);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentMovie, setCurrentMovie] = useState(0);
  const filteredMovie = popular.slice(0, 4);
  const [searchResult, setSearchResult] = useState([]);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getNowPlaying());
  }, []);

  useEffect(() => {
    dispatch(getPopular());
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMovie((prevMovie) => (prevMovie + 1) % nowPlaying.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [nowPlaying]);

  useEffect(() => {
    const fetchSearchMovies = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchTerm}}`,
          { header: { accept: "application/json" } }
        );
        setSearchResult(response.data.results);
      } catch (err) {
        console.log("error fetching data: ", err);
      }
    };

    fetchSearchMovies();
  }, [searchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Apakah Anda yakin ingin logout?");
    if (confirmLogout) {
      localStorage.removeItem("token");
      navigate("/");
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <>
      <div className="flex items-center justify-between w-[100%] mt-3 absolute px-5">
        <div className="flex items-center text-5xl text-red-600">
          <strong
            onClick={() => {
              navigate("/");
            }}
          >
            Movielist
          </strong>
        </div>
        <div className="flex items-center border py-2 px-4 rounded-full border-red-600 text-white">
          <input
            type="text"
            placeholder="What do you want to search?"
            value={searchTerm}
            onChange={handleSearch}
            autoFocus={true}
            className="bg-transparent w-[300px] outline-none mr-10 px-2"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="m19.6 21l-6.3-6.3q-.75.6-1.725.95T9.5 16q-2.725 0-4.612-1.888T3 9.5q0-2.725 1.888-4.612T9.5 3q2.725 0 4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l6.3 6.3zM9.5 14q1.875 0 3.188-1.312T14 9.5q0-1.875-1.312-3.187T9.5 5Q7.625 5 6.313 6.313T5 9.5q0 1.875 1.313 3.188T9.5 14"
            ></path>
          </svg>
        </div>
        <div className="flex">
          <ul className="flex justify-center items-center align-center text-white">
            <div className="relative">
              <div
                className="flex flex-row mr-2"
                style={{ color: isHovered ? "red" : "white" }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={32}
                  height={32}
                  viewBox="0 0 1024 1024"
                >
                  <path
                    fill="currentColor"
                    d="M160 448a32 32 0 0 1-32-32V160.064a32 32 0 0 1 32-32h256a32 32 0 0 1 32 32V416a32 32 0 0 1-32 32zm448 0a32 32 0 0 1-32-32V160.064a32 32 0 0 1 32-32h255.936a32 32 0 0 1 32 32V416a32 32 0 0 1-32 32zM160 896a32 32 0 0 1-32-32V608a32 32 0 0 1 32-32h256a32 32 0 0 1 32 32v256a32 32 0 0 1-32 32zm448 0a32 32 0 0 1-32-32V608a32 32 0 0 1 32-32h255.936a32 32 0 0 1 32 32v256a32 32 0 0 1-32 32z"
                  ></path>
                </svg>
                <button
                  className="text-white ml-1 mr-14"
                  onClick={toggleDropdown}
                  onMouseEnter={(e) => {
                    e.currentTarget.previousSibling.style.fill = "red";
                    e.currentTarget.style.color = "red";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.previousSibling.style.fill = "white";
                    e.currentTarget.style.color = "white";
                  }}
                >
                  Menu
                </button>
              </div>
              {isDropdownOpen && (
                <div className="absolute z-10 bg-black border border-white text-white mt-2 rounded-md shadow-lg">
                  <div
                    onClick={() => {
                      navigate("/nowPlaying");
                    }}
                    className="block px-4 py-2 hover:bg-red-600"
                  >
                    Now Playing
                  </div>
                  <div
                    onClick={() => {
                      navigate("/genre");
                    }}
                    className="block px-4 py-2 hover:bg-red-600"
                  >
                    Genre
                  </div>
                  <div
                    onClick={() => {
                      navigate("/popularMovie");
                    }}
                    className="block px-4 py-2 hover:bg-red-600"
                  >
                    Popular Movie
                  </div>
                  <div
                    onClick={() => {
                      navigate("/favMovie");
                    }}
                    className="block px-4 py-2 hover:bg-red-600"
                  >
                    Favorite Movie
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="focus:border-double p-2 px-5 focus:border-2 border-2 border-white rounded-full hover:bg-red-700 focus:bg-red-800 text-white mx-5 bg-red-600"
            >
              Logout
            </button>
          </ul>
        </div>
      </div>

      <div className="carousel flex">
        {nowPlaying?.map((movie, index) => (
          <div
            key={index}
            className={`carousel-slide ${index === currentMovie ? "show" : ""}`}
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
            }}
          >
            <div className="overlay flex flex-col max-w-sm mb-24 text-white">
              <h1 className="text-6xl mb-5 text-shadow-black">{movie.title}</h1>
              <p className="mb-5 text-shadow-black">
                {movie.overview.slice(0, 100)}...
              </p>
              <div className="rounded-full flex items-center px-8 p-3 bg-red-600 mr-44 border-double border">
                See in Now Playing
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        className="font-poppins"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        <div className="mx-auto p-4">
          <h1 className="text-3xl flex items-center font-bold mt-7 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={48}
              height={48}
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="#ff0000"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19V5"
              ></path>
            </svg>
            <span className="text-white">POPULAR MOVIES</span>
          </h1>
          <div
            onClick={() => {
              navigate("/popularMovie");
            }}
          >
            <div className="flex text-red-600 justify-end mb-4">
              <span className="mr-1">See All Movie</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M4 11v2h12l-5.5 5.5l1.42 1.42L19.84 12l-7.92-7.92L10.5 5.5L16 11z"
                ></path>
              </svg>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-3 mb-8 m-2">
            {filteredMovie?.map((movie) => (
              <div
                key={movie.id}
                className="mt-2 rounded-lg flex flex-col max-w[350px] max-sm:min-w-[250px] items-center shadow-[0_0_2px_1px_rgb(0,0,0,0.3)] hover:shadow-xl hover:shadow-red-600 hover:scale-105"
                style={{ height: "100%" }}
              >
                <div
                  className="bg-cover min-h-[410px] w-full rounded-md flex flex-col items-center justify-center relative"
                  onClick={() => {
                    navigate("/detailMovie", { state: { id: movie.id } });
                  }}
                >
                  <h2 className="font-bold flex absolute left-0 top-4 bg-white p-2 rounded-e-md">
                    ⭐
                    <div className="ml-1">{movie?.vote_average.toFixed(1)}</div>
                  </h2>
                  <img
                    className="absolute -z-10 max-h-[420px] object-cover w-full top-0 left-0 filter blur-[4px]"
                    src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                    alt=""
                  />
                  <img
                    src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                    alt={movie.title}
                    className="max-w-56 rounded-sm"
                  />
                </div>
              </div>
            ))}
          </div>
          <h1 className="text-2xl font-bold mb-10 text-center mt-16 text-white">
            Search Result {searchTerm}
          </h1>
          {searchResult.length > 0 ? (
            <div className="grid grid-cols-4 gap-3 mb-8 m-2">
              {searchResult.map((movie) => (
                <>
                  <div
                    className="mt-2 rounded-lg flex flex-col max-w[350px] max-sm:min-w-[250px] items-center shadow-[0_0_2px_1px_rgb(0,0,0,0.3)] hover:shadow-xl hover:shadow-red-600 hover:scale-105"
                    style={{ height: "100%" }}
                  >
                    <div
                      className="bg-cover min-h-[410px] w-full rounded-md flex flex-col items-center justify-center relative"
                      onClick={() => {
                        navigate("/detailMovie", { state: { id: movie.id } });
                      }}
                    >
                      <h2 className="font-bold flex absolute left-0 top-4 bg-white p-2 rounded-e-md">
                        ⭐
                        <div className="ml-1">
                          {movie?.vote_average.toFixed(1)}
                        </div>
                      </h2>
                      <img
                        className="absolute -z-10 max-h-[420px] object-cover w-full top-0 left-0 filter blur-[4px]"
                        src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                        alt=""
                      />
                      <img
                        src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                        alt={movie.title}
                        className="max-w-56 rounded-sm"
                      />
                    </div>
                  </div>
                </>
              ))}
            </div>
          ) : (
            <p className="text-center text-white mb-6">None</p>
          )}
        </div>
      </div>
    </>
  );
}
