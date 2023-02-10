const express = require("express");
const neo4j = require("neo4j-driver");
const bcrypt = require("bcrypt");
const userSchema = require("../validation/userSchema");
const usersRouter = express.Router();
const driver = neo4j.driver(
    "neo4j://localhost:7687",
    neo4j.auth.basic("neo4j", "test1234")
);
usersRouter.post("/", async (req, res) => {
    const {error, value} = userSchema.validate(req.body);
    if (error || !value) return res.status(400).send(error);
    const session = driver.session();
    const userExists = await session.run(`MATCH (u:User {login: "${value.login}"}) RETURN u`);
    if (userExists.records.length > 0) return res.send({result: false});
    try {
        const hashedPassword = await bcrypt.hash(value.password, 10);
        const newUserRequest = await session.run(`MERGE (u:User {login: "${value.login}",
        password: "${hashedPassword}", isAdmin: false}) RETURN u`);
        await session.close();
        const newUser = newUserRequest.records[0]._fields[0]
        return res.send({userId: newUser.identity.low, login: newUser.properties.login, isAdmin: newUser.properties.isAdmin});
    } catch {
        return res.status(500).send();
    }
});
usersRouter.post("/login", async (req, res) => {
    const session = driver.session();
    const userRequest = await session.run(`MATCH (u:User {login: "${req.body.login}"}) RETURN u`);
    if (userRequest.records.length === 0) return res.send({result: false});
    const hashedPassword = userRequest.records[0]._fields[0].properties.password;
    await session.close();
    try {
        const user = userRequest.records[0]._fields[0]
        const result = await bcrypt.compare(req.body.password, hashedPassword);
        return result 
        ? res.send({userId: user.identity.low, login: user.properties.login, isAdmin: user.properties.isAdmin}) 
        : res.send({result: false});
    } catch {
        return res.status(500).send();
    }
});
module.exports = usersRouter;