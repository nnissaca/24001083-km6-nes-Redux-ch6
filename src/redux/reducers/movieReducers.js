import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  movieCarousel: [],
  moviePopular: [],
};

const movieSlicer = createSlice({
  name: "movie",
  initialState,
  reducers: {
    setNowPlaying: (state, action) => {
      state.movieCarousel = action.payload;
    },
    setPopular: (state, action) => {
      state.moviePopular = action.payload;
    },
  },
});

export const { setNowPlaying, setPopular } = movieSlicer.actions;

export default movieSlicer.reducer;
