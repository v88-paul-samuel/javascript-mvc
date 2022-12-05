import { Router } from "express";
import ViewController from "../controllers/view.controller.js";
import validateUser from "../helpers/validator.js";
const WallRoute = Router();


WallRoute.get("/", (req, res) => { new ViewController(req, res).homepage(); });
WallRoute.get("/homepage", (req, res) => { new ViewController(req, res).homepage(); });
WallRoute.get("/logoff", (req, res) => { new ViewController(req, res).logoff(); });
WallRoute.post("/login", validateUser.login, (req, res) => { new ViewController(req, res).login(); })
WallRoute.post("/register", validateUser.register,  (req, res) => { new ViewController(req, res).register(); })

export default WallRoute;