const BodyParser = require('body-parser');
const Express    = require('express');
const Path       = require('path');
const Session    = require('express-session');

const Constants  = require('./configs/constants');
const App        = Express();

const WallRoutes = require("./routes/wall.route");

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