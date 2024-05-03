import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const API_KEY = "52b2a50250de0b7306b76a36c51029e8";

export default function GenreMovie() {
  const [movies, setMovies] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState([]);
  const navigate = useNavigate();
  const [formSubmitted, setFormSubmitted] = useState(false);

  const fetchGenreMovie = async () => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${selectedGenre}`,
        { headers: { accept: "application/json" } }
      );
      setMovies(response.data.results);
      setCurrentIndex(0);
    } catch (err) {
      console.log("error fetching data: ", err);
    }
    if (!selectedGenre && formSubmitted) {
      alert("Please choose a genre first.");
      return; // Menghentikan pengiriman formulir jika genre belum dipilih
    }
  };

  const handleGenreChange = (event) => {
    setSelectedGenre(event.target.value);
  };

  const handleSubmit = () => {
    setFormSubmitted(true);
    fetchGenreMovie();
  };

  useEffect(() => {
    fetchGenreMovie();
  }, []);

  useEffect(() => {
    const updateVisibleCards = () => {
      setVisibleCards(movies.slice(currentIndex, currentIndex + 4));
    };
    updateVisibleCards();
  }, [currentIndex, movies]);

  const handleBackClick = () => {
    setCurrentIndex((backIndex) => Math.max(0, backIndex - 1));
  };

  const handleNextClick = () => {
    setCurrentIndex((backIndex) => Math.min(movies.length - 3, backIndex + 1));
  };

  return (
    <>
      <div>
        <div className="flex items-center justify-between mt-3 w-screen px-5">
          <p className="flex items-center text-5xl text-red-600">
            <Link to="/">
              <strong>Movielist</strong>
            </Link>
          </p>
        </div>

        <h1 className="text-center my-3 font-bold text-white text-3xl">
          Genre Movie
        </h1>
        <div className="container mx-auto flex justify-center m-7">
          <select
            onChange={handleGenreChange}
            value={selectedGenre}
            className="ml-2 select-cst border-4 border-double border-gray-300 rounded-md px-4 py-2 hover:shadow-lg hover:border-red-600"
            defaultValue=""
          >
            <option value="" disabled hidden>
              Pilih Genre
            </option>
            <option value="28">Action</option>
            <option value="12">Adventure</option>
            <option value="16">Animation</option>
            <option value="35">Comedy</option>
            <option value="80">Crime</option>
            <option value="27">Horor</option>
            <option value="10752">War</option>
            <option value="53">Thriller</option>
            <option value="10749">Romance</option>
            <option value="878">Science Fiction</option>
          </select>
          <button
            onClick={handleSubmit}
            className="ml-2 px-4 py-2 hover:bg-red-800 text-white rounded-md bg-red-600 border-none"
          >
            Submit
          </button>
        </div>
      </div>
      <div className="flex justify-between mb-4 px-10">
        <button
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
          onClick={handleBackClick}
          disabled={currentIndex === 0}
        >
          Back
        </button>
        <button
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
          onClick={handleNextClick}
          disabled={currentIndex === movies.length - 4}
        >
          Next
        </button>
      </div>
      <div className="grid grid-cols-4 gap-3 mb-8 m-2 mx-auto p-6">
        {visibleCards.map((movie) => (
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
                ⭐<div className="ml-1">{movie?.vote_average.toFixed(1)}</div>
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
    </>
  );
}
