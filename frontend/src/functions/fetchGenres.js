import axios from "axios";
function fetchGenres() {
  return axios.get(
    "https://api.themoviedb.org/3/genre/movie/list?api_key=ebd02a02c91cc571a5143e6ec6241552"
  );
}
export default fetchGenres;
