const { Router }     = require("express");
const ViewController = require("../controllers/view.controller");
const WallController = require("../controllers/wall.controller");
const validateUser = require("../helpers/validator.js");
const WallRoute = Router();


WallRoute.get("/", (req, res) => { new ViewController(req, res).homepage(); });
WallRoute.get("/homepage", (req, res) => { new ViewController(req, res).homepage(); });
WallRoute.get("/logoff", (req, res) => { new ViewController(req, res).logoff(); });
WallRoute.post("/login", validateUser.login, (req, res) => { new ViewController(req, res).login(); })
WallRoute.post("/register", validateUser.register,  (req, res) => { new ViewController(req, res).register(); })

WallRoute.get("/wall", (req, res) => { new WallController(req, res).wall(); })
WallRoute.post("/post_message", validateUser.post_message, (req, res) => { new WallController(req, res).post_message(); })
WallRoute.post("/post_comment", validateUser.post_comment, (req, res) => { new WallController(req, res).post_comment(); })
WallRoute.post("/delete_comment", (req, res) => { new WallController(req, res).delete_comment(); } )
WallRoute.post("/delete_message", (req, res) => { new WallController(req, res).delete_message(); })

module.exports = WallRoute;