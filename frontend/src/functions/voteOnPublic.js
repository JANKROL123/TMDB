import axios from "axios";
import {message} from "antd";
async function voteOnPublic(rate, id) {
    try {
        const getGuestSessionId = await axios.get("https://api.themoviedb.org/3/authentication/guest_session/new?api_key=ebd02a02c91cc571a5143e6ec6241552");
        const sendRate = await axios.post(`https://api.themoviedb.org/3/movie/${id}/rating?api_key=ebd02a02c91cc571a5143e6ec6241552&guest_session_id=${getGuestSessionId.data.guest_session_id}`, {value: rate});
        if (sendRate.data.success) message.success("Voted successfully");
        else message.error("Failed to vote");
    } catch (err) {
        console.error(err);
    }
}
export default voteOnPublic;