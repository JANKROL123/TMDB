const express = require("express");
const cors = require("cors");
const moviesRouter = require("./routes/moviesRoute");
const commentsRouter = require("./routes/commentsRouter");
const usersRouter = require("./routes/usersRouter");
const statisticsRouter = require("./routes/statisticsRouter");
const app = express();


app.use(cors());
app.use(express.json());
app.use("/movies", moviesRouter);
app.use("/comments", commentsRouter);
app.use("/users", usersRouter);
app.use("/statistics", statisticsRouter);




app.listen(5000, () => console.log("Server started on port 5000"));
