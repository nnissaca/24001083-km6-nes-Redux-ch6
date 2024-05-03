/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

// const API_KEY = "52b2a50250de0b7306b76a36c51029e8";
const ACC_ID = "21134706";
const token =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MmIyYTUwMjUwZGUwYjczMDZiNzZhMzZjNTEwMjllOCIsInN1YiI6IjY2MDEyMzEyN2Y2YzhkMDE2MzZmZDQ4NCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.owhLgAWxk1jrcJHXp2KuqjPgImpP1fch2iCpz-dOLj8";

const FavoriteMovie = () => {
  const [selectLanguage, setSelectLanguage] = useState("");
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const navigate = useNavigate();

  const favMovies = async () => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/account/${ACC_ID}/favorite/movies?language=${selectLanguage}&page=1&sort_by=created_at.asc`,
        {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("response.data ", response.data);
      setMovies(response.data.results);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    favMovies();
  }, []);

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Jika tidak ada token, arahkan pengguna kembali ke halaman login
      alert("Silakan login terlebih dahulu.");
      navigate("/");
    }
  }, []);

  return (
    <>
      <div className="flex items-center justify-between mt-3 w-screen px-5">
        <p className="flex items-center text-5xl text-red-600">
          <Link to="/">
            <strong>Movielist</strong>
          </Link>
        </p>
        <div className="flex items-center border py-2 px-4 rounded-full border-red-600 text-white">
          <input
            type="text"
            placeholder="What do yo want to search?"
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
      </div>

      <div>
        <h1 className="text-center my-8 font-bold mb-2 text-white text-3xl">
          Favorite Movie
        </h1>
        <div className="grid grid-cols-4 gap-3 mb-8 mx-auto p-6">
          {movies
            .filter(
              (movie) =>
                movie.original_title && // Periksa apakah original_title sudah terdefinisi
                movie.original_title
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
            )
            .map((movie) => (
              <div
                key={movie.id}
                className="mt-2 rounded-lg flex flex-col max-w[350px] max-sm:min-w-[250px] items-center shadow-[0_0_2px_1px_rgb(0,0,0,0.3)] hover:shadow-xl hover:shadow-red-600 hover:scale-105"
                style={{ height: "100%" }}
                onClick={() => {
                  navigate("/detailMovie", { state: { id: movie.id } });
                }}
              >
                <div className="bg-cover min-h-[410px] w-full rounded-md flex flex-col items-center justify-center relative">
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
      </div>
    </>
  );
};

export default FavoriteMovie;
