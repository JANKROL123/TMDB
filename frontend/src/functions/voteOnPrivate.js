import axios from "axios";
import { message } from "antd";
async function voteOnPrivate(score, movieId) {
  try {
    const vote = await axios.patch(
      `http://localhost:5000/movies/${movieId}/vote`,
      { vote: score }
    );
    if (vote.data === "Vote average updated")
      message.success("Voted successfully");
    else message.error("Failed to vote");
  } catch (err) {
    console.error(err);
  }
}
export default voteOnPrivate;
