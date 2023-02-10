import axios from "axios";
async function fetchPrivateStatistics() {
    const tab = await Promise.all([
        axios.get("http://localhost:5000/statistics/roles"),
        axios.get("http://localhost:5000/statistics/commented"),
        axios.get("http://localhost:5000/statistics/genres"),
    ]);
    return tab.map(elem => elem.data);
}
export default fetchPrivateStatistics;