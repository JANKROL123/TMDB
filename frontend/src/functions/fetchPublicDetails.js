import axios from "axios";
async function fetchPublicDetails(movieId) {
    const arr = [
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=ebd02a02c91cc571a5143e6ec6241552&language=en-US`),
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=ebd02a02c91cc571a5143e6ec6241552&language=en-US`),
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}/images?api_key=ebd02a02c91cc571a5143e6ec6241552`),
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=ebd02a02c91cc571a5143e6ec6241552&language=en-US`)
    ];
    const request = await Promise.all(arr);
    const result = request.map(elem => elem.data);
    const {crew, cast} = result[1];
    const credits = {main_roles: cast, director: crew.find(member => member.job === "Director").original_name}
    const {backdrops} = result[2];
    const video = result[3].results.find(elem => elem.type === "Trailer");
    return {...result[0], ...credits, backdrops, ...video};
}
export default fetchPublicDetails