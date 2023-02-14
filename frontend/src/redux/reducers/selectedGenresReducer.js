const selectedGenresReducer = (state = [], action) => {
  switch (action.type) {
    case "ADD_GENRE_ID":
      return [...state, action.id];
    case "DELETE_GENRE_ID":
      return state.filter((id) => id !== action.id);
    case "SET_SELECTED_GENRES":
      return action.payload;
    case "CLEAR_GENRES":
      return [];
    default:
      return state;
  }
};
export default selectedGenresReducer;
