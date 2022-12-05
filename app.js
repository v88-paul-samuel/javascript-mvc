import BodyParser from 'body-parser';
import Express from 'express';
import Path from 'path';
import Session from 'express-session';
import Constants from './configs/constants.js';
const App = Express();

import WallRoutes from "./routes/wall.route.js";
import {fileURLToPath} from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = Path.dirname(__filename);

App.use(BodyParser.json({limit: '50mb'}));
App.use(BodyParser.urlencoded({limit: '50mb', extended: true}));
App.set("view engine", "ejs");
App.set('views', Path.join(__dirname, "/views"));
App.use('/assets', Express.static(Path.join(__dirname, "/assets")));

App.use(Session({
    secret: "wall-session",
    resave: true,
    saveUninitialized: true,
    cookie: {secure: false }
}));

App.use("/", WallRoutes);

App.listen(Constants.PORT, () => {
    console.log(`Example app listening on port ${Constants.PORT}`);
})