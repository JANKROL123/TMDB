const express = require("express");
const neo4j = require("neo4j-driver");
const dateToString = require("../functions/dateToString");
const commentSchema = require("../validation/commentSchema");
const commentsRouter = express.Router();
const driver = neo4j.driver(
    "neo4j://localhost:7687",
    neo4j.auth.basic("neo4j", "test1234")
);

commentsRouter.get("/:movieId", async (req, res) => {
    try {   
        const session = driver.session();
        const movie = await session.run(`MATCH (m:Movie) WHERE id(m) = ${req.params.movieId} RETURN m`);
        if (movie.records.length === 0) return res.status(404).send("Movie does not exist");
        const commentsRequest = await session.run(`MATCH (m:Movie) WHERE id(m) = ${req.params.movieId} 
        MATCH (m)-[:REFERS_TO]-(c:Comment)-[:COMMENTED]-(u:User) RETURN c,u`);
        await session.close();
        const response = commentsRequest.records.map(elem => elem._fields).map(elem => {
            const [comment, author] = elem;
            return {...comment.properties, id: comment.identity.low, login: author.properties.login}
        });
        return res.send(response);
    } catch (err) {
        return res.status(500).send(err);
    }
});

commentsRouter.post("/:movieId", async (req, res) => {
    const {error, value} = commentSchema.validate(req.body);
    const checkSession = driver.session();
    const checkIfExists = await checkSession.run(`MATCH (m:Movie) WHERE 
    id(m) = ${req.params.movieId} RETURN m`);
    if (checkIfExists.records.length === 0) return res.status(400).send("Movie does not exist");
    if (!error && value) {
        const session = driver.session();
        const commentAddRequest = await session.run(`CREATE (c:Comment {
            content: "${value.content}",
            title: "${value.title}", 
            date: "${dateToString(value.date)}"
        }) RETURN c`);
        await session.run(`MATCH (m:Movie) WHERE id(m) = ${req.params.movieId}
        MATCH (c:Comment {title: "${value.title}"}) CREATE (c)-[:REFERS_TO]->(m)`);
        await session.run(`MATCH (u:User) WHERE id(u) = ${value.userId} MATCH 
        (c:Comment {title: "${value.title}"}) CREATE (u)-[:COMMENTED]->(c)`);
        await session.close();
        const id = commentAddRequest.records[0]._fields[0].identity.low;
        const newComment = commentAddRequest.records[0]._fields[0].properties;
        return res.send({id, ...newComment});
    } else return res.status(400).send(error);
});

commentsRouter.put("/:commentId", async (req, res) => {
    const {error, value} = commentSchema.validate(req.body);
    const session = driver.session();
    const checkIfExists = await session.run(`MATCH (c:Comment) WHERE 
    id(c) = ${req.params.commentId} RETURN c`);
    if (checkIfExists.records.length === 0) return res.status(400).send("Comment does not exist");  
    else if (!error && value) {
        await session.run(`MATCH (c:Comment) WHERE id(c) = ${req.params.commentId}
        SET c.title="${value.title}", c.content="${value.content}", c.date="${dateToString(value.date)}"`);
        await session.close();
        return res.send("Comment updated");
    } else return res.send("error");
});

commentsRouter.delete("/:commentId", async (req, res) => {
    const session = driver.session();
    const checkIfExists = await session.run(`MATCH (c:Comment) WHERE 
    id(c) = ${req.params.commentId} RETURN c`);
    if (checkIfExists.records.length === 0) return res.status(400).send("Movie does not exist");
    else {
        await session.run(`MATCH (c:Comment) WHERE id(c) = ${req.params.commentId}
        DETACH DELETE c`);
        await session.close();
        return res.send("Comment deleted");
    }
});

module.exports = commentsRouter;