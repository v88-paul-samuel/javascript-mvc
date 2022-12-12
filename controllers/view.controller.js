import WallModel from "../models/wall.model.js";

class ViewController {
    #req;
    #res;
    #user;
    
    constructor(req, res){
        this.#req = req;
        this.#res = res;
        this.#user = this.#req.session.user;
    }

    homepage = async () => {    
        this.#res.render("login.ejs");
    }

    wall = async () => {
        if(this.#user === undefined){
            this.#res.redirect("/homepage");
            
            return;
        }

        let response_content = await WallModel.getWallContent();
        this.#res.render("walls.ejs", {user : this.#user, wall_content : response_content.result});
    } 
}

export default ViewController;