/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const API_KEY = "52b2a50250de0b7306b76a36c51029e8";

export default function DetailMovie() {
  const location = useLocation();
  const [detail, setDetail] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${location.state.id}?language=en-US&api_key=${API_KEY}`,
          { headers: { accept: "application/json" } }
        );
        console.log("responsen data id detail", response.data.id);
        setDetail(response.data);
      } catch (error) {
        console.error("Error fetching detail data: ", error);
      }
    };

    fetchDetail();
  }, []);

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
      <div className="flex items-center justify-between mt-3 absolute w-screen px-5">
        <p className="flex items-center text-5xl text-red-600">
          <Link to="/">
            <strong>Movielist</strong>
          </Link>
        </p>
      </div>
      <div className="mx-auto flex justify-center items-center">
        <div
          className="shadow-lg"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${detail?.poster_path})`,
            height: "590px",
          }}
        >
          <div className="flex flex-col lg:flex-row p-5 justify-center items-center">
            <div className="flex-1 flex justify-center items-center mt-24">
              <img
                src={`https://image.tmdb.org/t/p/w500/${detail?.poster_path}`}
                alt={detail?.title}
                className="w-auto max-h-96 rounded-lg"
              />
            </div>
            <div className="mr-36 mt-24 flex-1 bg-white p-2 rounded-lg">
              <h2 className="text-3xl font-bold mb-2 text-black">
                {detail?.title}
              </h2>
              <h2 className="text-black mb-2">
                Release date: {detail?.release_date}
              </h2>
              <h2 className="mb-2">Status: {detail?.status}</h2>
              <h2 className="mb-2">Popularity: {detail?.popularity} viewers</h2>
              <h2 className="mb-2">Runtime: {detail?.runtime} minutes</h2>
              <p className="text-gray-800 mb-4">{detail?.overview}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
