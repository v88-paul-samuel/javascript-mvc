import { Router } from "express";
import ViewController from "../controllers/view.controller.js";
import WallController from "../controllers/wall.controller.js";
import validateUser from "../helpers/validator.js";
const WallRoute = Router();


WallRoute.get("/", (req, res) => { new ViewController(req, res).homepage(); });
WallRoute.get("/homepage", (req, res) => { new ViewController(req, res).homepage(); });
WallRoute.get("/logoff", (req, res) => { new ViewController(req, res).logoff(); });
WallRoute.post("/login", validateUser.login, (req, res) => { new ViewController(req, res).login(); })
WallRoute.post("/register", validateUser.register,  (req, res) => { new ViewController(req, res).register(); })

WallRoute.get("/wall", (req, res) => { new WallController(req, res).wall(); })
WallRoute.post("/postMessage", validateUser.postMessage, (req, res) => { new WallController(req, res).postMessage(); })
WallRoute.post("/postComment", validateUser.postComment, (req, res) => { new WallController(req, res).postComment(); })
WallRoute.post("/deleteComment", (req, res) => { new WallController(req, res).deleteComment(); } )
WallRoute.post("/deleteMessage", (req, res) => { new WallController(req, res).deleteMessage(); })

export default WallRoute;