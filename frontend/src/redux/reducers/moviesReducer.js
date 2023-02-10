const moviesReducer = (state = [], action) => {
    switch (action.type) {
        case "SET_MOVIES":
            return action.payload;
        case "SORT_MOVIES":
            return action.method 
            ? [...state].sort((a,b) => a[action.property] > b[action.property] ? 1 : -1)
            : [...state].sort((a,b) => a[action.property] > b[action.property] ? -1 : 1);
        case "ADD_MOVIES":
            return [...state, ...action.payload];
        case "DELETE_MOVIE":
            return state.filter(movie => movie.id !== action.id);
        default:
            return state;
    }
}
export default moviesReducer;