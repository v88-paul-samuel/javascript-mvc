const { Router }     = require("express");
const ViewController = require("../controllers/view.controller");

const WallRoute = Router();

WallRoute.get("/", (req, res) => { new ViewController(req, res).homepage(); });

module.exports = WallRoute;