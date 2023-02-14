import axios from "axios";
async function fetchMovies() {
  const tmdbRequest = Array(20)
    .fill(null)
    .map((_n, idx) => {
      return axios.get(
        `https://api.themoviedb.org/3/movie/popular?api_key=ebd02a02c91cc571a5143e6ec6241552&language=en-US&page=${
          idx + 1
        }`
      );
    });
  const neo4jRequest = axios.get("http://localhost:5000/movies");
  const promiseTab = [...tmdbRequest, neo4jRequest];
  const moviesRequest = await Promise.all(promiseTab);
  const movies = moviesRequest.map((elem) => elem.data);
  const fromTMDB = movies
    .slice(0, -1)
    .map((elem) => {
      return elem.results;
    })
    .reduce((acum, item) => [...acum, ...item], [])
    .map((elem) => {
      return { ...elem, private: false };
    })
    .reduce((acum, item) => {
      return acum.find((movie) => movie.id === item.id) || !item.backdrop_path
        ? acum
        : [...acum, item];
    }, []);
  const fromNeo4j = movies[movies.length - 1];
  return [...fromTMDB, ...fromNeo4j];
}
export default fetchMovies;
