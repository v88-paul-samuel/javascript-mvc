import { validationResult } from "express-validator";
import WallModel from "../models/wall.model.js";

class Walls{
    #req;
    #res;

    constructor(req, res){
        this.#req = req;
        this.#res = res;
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

    postMessage = async () => {
        let error = validationResult(this.#req).errors[0];
        if(error !== undefined){
            this.#res.json({message_error :  `<p>${error.msg}</p>`});
        }
        else{
            let post_details = this.#req.body;       
            await WallModel.createMessage(this.#req.session.user["id"], post_details["message"]);
            this.#res.json({});
        }
    }

    postComment = async () => {
        let error = validationResult(this.#req).errors[0];
        if(error !== undefined){
            this.#res.json({comment_error : `<p>${error.msg}</p>`});
        }
        else{
            let post_details = this.#req.body;
            await WallModel.createComment(this.#req.session.user["id"], post_details["message_id"], post_details["comment"]);
            this.#res.json({});
        }
    }

    deleteComment = async () => {
        let post_details = this.#req.body;
        await WallModel.deleteComment(this.#req.session.user["id"], post_details["comments_id"])
        this.#res.redirect("/wall");
    }

    deleteMessage = async () => {
        let post_details = this.#req.body;
        await WallModel.deleteMessage(this.#req.session.user["id"], post_details["messages_id"])
        this.#res.redirect("/wall");
    }
}

export default Walls;