import { Router } from "express";
import ViewController from "../controllers/view.controller.js";
import WallsController from "../controllers/walls.controller.js";
import UsersController from "../controllers/users.controller.js";
import ValidateUser from "../helpers/validator.js";
const WallRoute = Router();


WallRoute.get("/", (req, res) => { new ViewController(req, res).homepage(); });
WallRoute.get("/homepage", (req, res) => { new ViewController(req, res).homepage(); });
WallRoute.get("/wall", (req, res) => { new ViewController(req, res).wall(); })

WallRoute.get("/logoff", (req, res) => { new UsersController(req, res).logoff(); });
WallRoute.post("/login", ValidateUser.login, (req, res) => { new UsersController(req, res).login(); })
WallRoute.post("/register", ValidateUser.register,  (req, res) => { new UsersController(req, res).register(); })
WallRoute.post("/postMessage", (req, res) => { 
    try{
        new WallsController(req, res).postMessage(); 
    }
    catch(error){
        res.json({status : false, result : {}, error : error.message});
    }
});
WallRoute.post("/postComment", (req, res) => { 
    try{
        new WallsController(req, res).postComment();
    }
    catch(error){
        res.json({status : false, result : {}, error : error.message});
    }
});
WallRoute.post("/deleteComment", (req, res) => { 
    try{
        new WallsController(req, res).deleteComment(); 
    }
    catch(error){
        res.json({status : false, result : {}, error : error.message});
    }
});
WallRoute.post("/deleteMessage", (req, res) => {
    try{
        new WallsController(req, res).deleteMessage(); 
    }
    catch(error){
        res.json({status : false, result : {}, error : error.message});
    }
});


export default WallRoute;