const allGeneresReducer = (state = [], action) => {
  switch (action.type) {
    case "SET_ALL_GENRES":
      return action.payload;
    default:
      return state;
  }
};
export default allGeneresReducer;
