function handleFilters(movies, selectedGenres, query) {
    return movies.filter(movie => {
        if (selectedGenres.length === 0) return movie;
        else {
          if (selectedGenres.every(genreId => movie.genre_ids.some(n => n === genreId))) return movie;
          else return;
        }
    }).filter(movie => {
        if (query === "") return movie;
        else if (movie.title.toLowerCase().includes(query.toLowerCase())) {
          return movie;
        } else return;
    });
}
export default handleFilters;