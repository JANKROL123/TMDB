import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
function ListElem({ movie }) {
  return (
    <div className="listItem">
      <Link to={movie.private ? `/private/${movie.id}` : `/${movie.id}`}>
        {movie.private ? (
          <img alt="" src={movie.poster_path} />
        ) : (
          <img
            alt=""
            src={`https://image.tmdb.org/t/p/w500/${movie.backdrop_path}`}
          />
        )}
      </Link>
      <div>
        <Link
          className="movieLink"
          to={movie.private ? `/private/${movie.id}` : `/${movie.id}`}
        >
          {movie.title}
        </Link>
        <div className="date">{movie.release_date}</div>
      </div>
      <span id="avg">{movie.vote_average}</span>
    </div>
  );
}
ListElem.propTypes = {
  movie: PropTypes.object
};
export default ListElem;
