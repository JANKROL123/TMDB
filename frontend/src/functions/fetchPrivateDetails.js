import axios from "axios";
async function fetchPrivateDetails(movieId) {
  const arr = [
    axios.get(`http://localhost:5000/movies/${movieId}`),
    axios.get(`http://localhost:5000/comments/${movieId}`)
  ];
  const request = await Promise.all(arr);
  return { ...request[0].data, comments: request[1].data };
}
export default fetchPrivateDetails;
