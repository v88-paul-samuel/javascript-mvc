import WallModel from "../models/wall.model.js";

class ViewController {
    #req;
    #res;
    
    constructor(req, res){
        this.#req = req;
        this.#res = res;
    }

    homepage = async () => {    
        if(this.#req.session.user !== undefined){
            this.#res.redirect("/wall")
        }
        else{
            this.#res.render("login.ejs");
        }
    }

    wall = async () => {
        let user_details = this.#req.session.user

        if(user_details === undefined){
            this.#res.redirect("/homepage");
            
            return;
        }

        let wallContent = await WallModel.getWallContent();

        this.#res.render("walls.ejs", {wallContent, user_details});
    }
}

export default ViewController;