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
        if(this.#user !== undefined){
            this.#res.redirect("/wall")
        }
        else{
            this.#res.render("login.ejs");
        }
    }

    wall = async () => {
        if(this.#user === undefined){
            this.#res.redirect("/homepage");
            
            return;
        }

        /* response_ prefix on variables means it contains the ff. {status : bool, result : {}, error : string/null}  */
        let response_data = await WallModel.getWallContent();

        this.#res.render("walls.ejs", {wallContent : response_data.result, user_details : this.#user});
    }
}

export default ViewController;