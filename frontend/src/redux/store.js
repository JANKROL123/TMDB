import { combineReducers, createStore } from "redux";
import moviesReducer from "./reducers/moviesReducer";
import selectedGenresReducer from "./reducers/selectedGenresReducer";
import allGenresReducer from "./reducers/allGenresReducer";
const store = createStore(combineReducers({
    movies: moviesReducer,
    selectedGenres: selectedGenresReducer,
    genres: allGenresReducer,
}));
export default store;