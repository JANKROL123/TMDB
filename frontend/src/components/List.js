import Sorter from "./Sorter";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import sortMovies from "../redux/actions/sortMovies";
import setSelectedGenres from "../redux/actions/setSelectedGenres";
import clearGenres from "../redux/actions/clearGenres";
import MovieFilter from "./MovieFilter";
import ListElem from "./ListElem";
import handleFilters from "../functions/handleFilters";
import { Content } from "antd/es/layout/layout";
function List({genres, movies, sortMovies, selectedGenres, clearGenres, setSelectedGenres}) {
  const [query, setQuery] = useState("");  
  const [moviesSortedBy, setMoviesSortedBy] = useState(true);
  useEffect(() => {
    clearGenres();
  }, []);
  function sortMainListByProperty(property) {
    sortMovies(!moviesSortedBy, property)
    setMoviesSortedBy(!moviesSortedBy);
  }
  function handleClick(arr) {
    setSelectedGenres(arr);
  }
  return (
    <Content id="content">
      {movies ? <MovieFilter
        genres={genres} 
        handleClick={handleClick} 
        setQuery={setQuery} 
      /> : null}
      <Sorter sortMainListByProperty={sortMainListByProperty} />
      <div id="mainList">
        {movies ? handleFilters(movies, selectedGenres, query).map((movie) => (
          <ListElem key={movie.id} movie={movie} />
        )) : null}
      </div>
      {!movies ? <div>Loading</div> : null}
    </Content>
  );
}
const mapStateToProps = state => ({
  movies: state.movies,
  genres: state.genres,
  selectedGenres: state.selectedGenres,
});
const mapDispatchToProps = {
  sortMovies,
  clearGenres,
  setSelectedGenres
}
export default connect(mapStateToProps,mapDispatchToProps)(List);