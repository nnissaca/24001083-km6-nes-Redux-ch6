import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getNowPlaying } from "./redux/actions/movieActions";

export default function nowPlaying() {
  const navigate = useNavigate();
  const nowPlaying = useSelector((state) => state?.movies.movieCarousel);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getNowPlaying());
  }, []);

  return (
    <>
      <div>
        <div className="flex items-center justify-between mt-3 w-screen px-5">
          <p className="flex items-center text-5xl text-red-600">
            <strong
              onClick={() => {
                navigate("/");
              }}
            >
              Movielist
            </strong>
          </p>
        </div>
      </div>
      <h1 className="text-center my-3 font-bold text-white text-3xl">
        Now Playing Movie
      </h1>
      <div className="grid grid-cols-4 gap-3 mb-8 m-2 mx-auto p-6">
        {nowPlaying?.map((movie) => (
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
