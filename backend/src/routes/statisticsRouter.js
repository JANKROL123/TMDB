const express = require("express");
const neo4j = require("neo4j-driver");
const statisticsRouter = express.Router();
const dateToString = require("../functions/dateToString");
const driver = neo4j.driver(
    "neo4j://localhost:7687",
    neo4j.auth.basic("neo4j", "test1234")
);

statisticsRouter.get("/roles", async (_req, res) => {
   const session = driver.session();
   const request = await session.run(`MATCH (p:Person)-[r:ACT_IN]-(:Movie) 
   RETURN p, count(r) ORDER BY count(r) DESC`);
   await session.close();
   const response = request.records.map(elem => elem._fields).map(elem => {
    const [person, roleCount] = elem;
    return {id: person.identity.low, name: person.properties.name, roles: roleCount.low}
   });
   return res.send(response);
});

statisticsRouter.get("/commented", async (_req, res) => {
    const session = driver.session();
    const request = await session.run(`MATCH (u:User)-[r:COMMENTED]-(c:Comment)
    RETURN u, count(r) ORDER BY count(r) DESC`);
    await session.close();
    const response = request.records.map(elem => elem._fields).map(elem => {
        const [user, comments] = elem;
        return {id: user.identity.low, login: user.properties.login, comments: comments.low}
    });
    return res.send(response);
});

statisticsRouter.get("/genres", async (req, res) => {
    const session = driver.session();
    const request = await session.run(`MATCH (g:Genre)-[r:GENRE]-(m:Movie)
    RETURN g, count(r) ORDER BY count(r) DESC`);
    await session.close();
    const response = request.records.map(elem => elem._fields).map(elem => {
        const [genre, amount] = elem;
        return {id: genre.identity.low, genreId: genre.properties.genreId.low, amount: amount.low};
    })
    return res.send(response);
});


module.exports = statisticsRouter;
