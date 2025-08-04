// store/persist.ts
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "@reduxjs/toolkit";

import gameReducer from "./game/reducer";

const rootReducer = combineReducers({
  game: gameReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["game"],
};

export const persistedReducer = persistReducer(persistConfig, rootReducer);
