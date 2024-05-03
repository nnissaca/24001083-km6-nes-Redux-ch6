import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import movieReducers from "./reducers/movieReducers";

//nanti yang bakal ketambah" itu di sini, nambah file apa gitu kek todoReducers
const rootReducers = combineReducers({
  movies: movieReducers,
});

const persistConfig = {
  key: "root",
  storage,
  //buat nyimpan banyak state
  // blacklist: ["todo"],
  //buat nyimpan state sedikit
  // whitelist: ["todo"],
};

const persistedReducer = persistReducer(persistConfig, rootReducers);

// Create the store
export const store = configureStore({
  reducer: persistedReducer,
  devTools: import.meta.env.NODE_ENV === "development",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(thunk), // It not necessary if your feature is not too complex, you can just comment this line if you don't need it
});

export const persistor = persistStore(store);
