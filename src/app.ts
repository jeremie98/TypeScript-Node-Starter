import express from "express";
import compression from "compression";
import mongo from "connect-mongo";
import bodyParser from "body-parser";
import session from "express-session";
import mongoose from "mongoose";
import bluebird from "bluebird";
import { MONGODB_URI, SESSION_SECRET } from "./util/secrets";

const MongoStore = mongo(session);

// controllers (route handlers)

// create Express server
const app = express();

// connect to MongoDB
const mongoUrl = MONGODB_URI;
mongoose.Promise = bluebird;

mongoose.connect(`${mongoUrl}`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(
    () => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */ }
).catch((err: string) => {
    console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
    // process.exit();
})

// express configuration
app.set("port", process.env.PORT || 5000);
app.use(compression());
app.use(bodyParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: `${SESSION_SECRET}`,
    store: new MongoStore({
        url: `${mongoUrl}`,
        autoReconnect: true
    })
}));

/**
 * Primary app routes.
 */
app.get("/", (req, res) => { res.send("Hello TypeScriptNodeStarter !") });


export default app;