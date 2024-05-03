import axios from "axios";
import { setNowPlaying, setPopular } from "../reducers/movieReducers";

export const getNowPlaying = () => async (dispatch, getState) => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1&api_key=52b2a50250de0b7306b76a36c51029e8`
    );
    // console.log("response", response.data.results);
    dispatch(setNowPlaying(response.data.results));
  } catch (error) {
    // console.log("error", error);
    if (axios.isAxiosError(error)) {
      alert(error.message);
      return;
    }
    alert(error.message);
  }
};

export const getPopular = () => async (dispatch, getState) => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/popular?api_key=52b2a50250de0b7306b76a36c51029e8`
    );
    dispatch(setPopular(response.data.results));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      alert(error.message);
      return;
    }
    alert(error.message);
  }
};
