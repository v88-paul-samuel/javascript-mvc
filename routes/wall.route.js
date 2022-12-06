import { Router } from "express";
import ViewController from "../controllers/view.controller.js";
import WallsController from "../controllers/walls.controller.js";
import validateUser from "../helpers/validator.js";
const WallRoute = Router();


WallRoute.get("/", (req, res) => { new ViewController(req, res).homepage(); });
WallRoute.get("/homepage", (req, res) => { new ViewController(req, res).homepage(); });
WallRoute.get("/logoff", (req, res) => { new ViewController(req, res).logoff(); });
WallRoute.post("/login", validateUser.login, (req, res) => { new ViewController(req, res).login(); })
WallRoute.post("/register", validateUser.register,  (req, res) => { new ViewController(req, res).register(); })

WallRoute.get("/wall", (req, res) => { new WallsController(req, res).wall(); })
WallRoute.post("/postMessage", validateUser.post_message, (req, res) => { new WallsController(req, res).postMessage(); })
WallRoute.post("/postComment", validateUser.post_comment, (req, res) => { new WallsController(req, res).postComment(); })
WallRoute.post("/deleteComment", (req, res) => { new WallsController(req, res).deleteComment(); })
WallRoute.post("/deleteMessage", (req, res) => { new WallsController(req, res).deleteMessage(); })


export default WallRoute;