import express from "express";
import userRoutes from "./src/routes/userRoutes.js";
import parkingRoutes from "./src/routes/parkingSlotRoute.js";
import bookingRoutes from "./src/routes/bookingRoute.js";
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import helmet from "helmet";
import config from "config";

const app = express();
const v1 = express.Router();

// mongoose connection
mongoose.Promise = global.Promise;
mongoose.connect(config.get("mongoConnectionString"), {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// bodyparser setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// for security
app.use(helmet())

//TODO modify error Handler
app.use((err, req, res, next) => {
    res.status(500).send();
})

userRoutes(v1);
parkingRoutes(v1);
bookingRoutes(v1);
app.use("/v1", v1);
process.on("uncaughtException", error => {
   console.log(error);
});
process.on("unhandledRejection", error => {
    console.log(error);
});

const PORT = 4000;

app.get('/', (req, res) => {
    res.send(`server status: running`);
});

app.listen(PORT, (req, res) => {
    console.log(`server started and listening on ${PORT}`);
});