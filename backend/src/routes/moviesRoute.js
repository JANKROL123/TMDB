const express = require("express");
const neo4j = require("neo4j-driver");
const movieSchema = require("../validation/movieSchema");
const moviesRouter = express.Router();
const dateToString = require("../functions/dateToString");
const driver = neo4j.driver(
    "neo4j://localhost:7687",
    neo4j.auth.basic("neo4j", "test1234")
);


moviesRouter.get("/", async (_req, res) => {
    try {
        const session = driver.session();
        const moviesRequest = await session.run(`MATCH (m: Movie)-[r:GENRE]-(g:Genre) RETURN m, g`);
        const response = moviesRequest.records.map(res => res._fields).map(res => ({...res[0].properties, id: res[0].identity.low, genre_id: res[1].properties.genreId.low})).reduce((acum,item) => {
            const {genre_id, ...rest} = item;
            const thisItem = acum.find(el => el.title === item.title);
            if (!thisItem) return [...acum, {...rest, genre_ids: [genre_id]}];
            else {
                thisItem.genre_ids = [...thisItem.genre_ids, genre_id];
                return acum;
            }
        }, []).map(movie => {
            movie.popularity = movie.popularity.low;
            const {id, title, popularity, release_date, vote_average, genre_ids, private, poster_path} = movie;
            const date = dateToString(new Date(release_date));
            return {id, title, popularity, poster_path, release_date: date, vote_average, genre_ids, private};
        });
        await session.close();
        return res.send(response);
    } catch (err) {
        return res.status(500).send(err);
    }
});

moviesRouter.get("/:id", async (req, res) => {
    try {
        const session = driver.session();
        const movieRequest = await session.run(`MATCH (m:Movie) WHERE id(m) = ${req.params.id} RETURN m`);
        const genresRequest = await session.run(`MATCH (m:Movie)-[:GENRE]-(g:Genre) WHERE id(m) = ${req.params.id} RETURN g`)
        const rolesRequest = await session.run(`MATCH (m:Movie)-[r:ACT_IN]-(p:Person) WHERE id(m) = ${req.params.id} RETURN r,p`)
        await session.close();
        if (movieRequest.records.length === 0) return res.status(404).send("Movie does not exist");
        else {
            const movieProto = movieRequest.records[0]._fields[0].properties;
            const genre_ids = genresRequest.records.map(genre => genre._fields[0].properties.genreId.low);
            const main_roles = rolesRequest.records.map(elem => elem._fields.map(item => item.properties)).map(elem => {
                return {name: elem[1].name, character: elem[0].character}
            });
            const movie = {
                id: parseInt(req.params.id), 
                ...movieProto, 
                popularity: movieProto.popularity.low, 
                genre_ids, 
                main_roles, 
                release_date: dateToString(new Date(movieProto.release_date)),
                vote_count: movieProto.vote_count.low,
                vote_average: movieProto.vote_average
            }
            return res.send(movie);
        }
    } catch (err) {
        return res.status(404).send(err);
    }
});

moviesRouter.post("/", async (req, res) => {
    const {value, error} = movieSchema.validate(req.body);
    if (!error && value) {
        const checkSession = driver.session();
        const movie = await checkSession.run(`MATCH (m:Movie) WHERE m.title = "${req.body.title}" RETURN m`);
        if (movie.records.length > 0) return res.status(400).send("Already exists");
        await checkSession.close();
        try {
            value.genre_ids.forEach(async (genreId) => {
                const genreIdSession = driver.session();
                await genreIdSession.run(`MERGE (g:Genre {genreId: ${genreId}})`);
                await genreIdSession.close();
            });
            value.main_roles.forEach(async (role) => {
                const roleSession = driver.session();
                await roleSession.run(`MERGE (p:Person {name: "${role.name}"})`);
                await roleSession.close();
            });
            const mainSession = driver.session();
            const result = await mainSession.run(`MERGE (m:Movie {title: "${value.title}", 
            poster_path: "${value.poster_path}", overview: "${value.overview}", 
            release_date: "${value.release_date}", director: "${value.director}", 
            vote_average: ${value.vote_average}, trailer: "${value.trailer}", 
            vote_count: ${value.vote_count}, popularity: ${value.popularity}, private: true}) RETURN m`);
            await mainSession.close();
            
            value.genre_ids.forEach(async (genreId) => {
                const genreIdRelationSession = driver.session();
                await genreIdRelationSession.run(`MATCH (m:Movie {title: "${value.title}"}),
                (g: Genre {genreId: ${genreId}}) MERGE (g)-[:GENRE]->(m)`);
                await genreIdRelationSession.close();
            });
    
            value.main_roles.forEach(async (role) => {
                const roleReleationSession = driver.session();
                await roleReleationSession.run(`MATCH (m:Movie {title: "${value.title}"}),
                (p:Person {name: "${role.name}"}) MERGE (p)-[:ACT_IN {character: "${role.character}"}]->(m)`);
                await roleReleationSession.close();
            });
            const properties = result.records[0]._fields[0].properties;
            const identity = result.records[0]._fields[0].identity;
            return res.send({
                ...properties, 
                popularity: properties.popularity.low,
                vote_average: properties.vote_average.low,
                vote_count: properties.vote_count.low,
                id: identity.low 
            });
        } catch (err) {
            return res.status(500).send(err);
        }
    } else return res.status(400).send(error);
});


moviesRouter.put("/:id", async (req, res) => {
    const {value, error} = movieSchema.validate(req.body);
    const errorContent = error.details[0].message
    const session = driver.session();
    const movie = await session.run(`MATCH (m:Movie) WHERE id(m) = ${req.params.id} RETURN m`);
    if (movie.records.length === 0) return res.status(400).send("Movie does not exist");
    if ((!error || errorContent === `"${"main_roles" || "genre_ids"}" is required`) && value) {
        try {
            await session.run(`MATCH (m:Movie) WHERE id(m) = ${req.params.id} SET 
            m.title="${value.title}", m.poster_path="${value.poster_path}", m.overview="${value.overview}",
            m.release_date="${value.release_date}", m.director="${value.director}", m.vote_average=${value.vote_average},
            m.vote_count=${value.vote_count}, m.trailer="${value.trailer}", m.popularity=${value.popularity}`);
            await session.close();
            return res.send("Movie updated");

        } catch (err) {
            return res.status(500).send(err);
        }
    } else return res.status(400).send(errorContent);
});

moviesRouter.delete("/:id", async (req, res) => {
    const session = driver.session();
    const movie = await session.run(`MATCH (m:Movie) WHERE id(m) = ${req.params.id} RETURN m`);
    if (movie.records.length === 0) {
        await session.close();
        return res.send("Movie does not exit");
    }
    try {
        await session.run(`MATCH (m:Movie)-[:REFERS_TO]-(c:Comment) WHERE id(m) = ${req.params.id} DETACH DELETE c`);
        await session.run(`MATCH (m:Movie) WHERE id(m) = ${req.params.id} DETACH DELETE m`);
        await session.close();
        return res.send("Movie deleted");
    } catch (err) {
        return res.status(500).send(err);
    }
});

moviesRouter.patch("/:id/vote", async (req, res) => {
    const session = driver.session();
    const dataRequest = await session.run(`MATCH (m:Movie) WHERE id(m) = ${req.params.id}
    RETURN m.vote_average, m.vote_count`);
    if (dataRequest.records.length === 0) return res.status(404).send("Movie does not exist");
    else {
        const data = dataRequest.records[0]._fields;
        const vote_average = data[0];
        const vote_count = data[1].low;
        const new_vote_average = ((vote_count * vote_average) + parseFloat(req.body.vote)) / (vote_count+1);
        await session.run(`MATCH (m:Movie) WHERE id(m) = ${req.params.id} SET 
        m.vote_count=${vote_count+1}, m.vote_average=${new_vote_average}`);
        await session.close();
        return res.send("Vote average updated");
    }
});

module.exports = moviesRouter;
