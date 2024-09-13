const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectToMongoDB } = require("./connect");
const userRoute = require("./routes/user");
const adRoute = require("./routes/ad");
const adStats = require("./routes/adStats");

const app = express();
const PORT = process.env.PORT;
const uri = process.env.MONGODB; // TODO: change ip if connection err occurs in atlas
const uri_old = process.env.MONGODB_OLD;

app.use(cors());

// TODO: connect to mongoDB
connectToMongoDB(uri).then(() => console.log("MongoDB connected"));
// TODO: middlewares
// To support form data
app.use(express.urlencoded({ extended: true }));
// To support json
app.use(express.json());

// Logger [logs routes and ip with timestamp]

// TODO: routes
app.use("/user", userRoute);
app.use("/ad", adRoute);
// app.use("/stats", adStats); //TODO: not sure whether required or not

// TODO: listen
app.listen(PORT, () => {
  console.log(`Server Started at PORT:${PORT}`);
});
