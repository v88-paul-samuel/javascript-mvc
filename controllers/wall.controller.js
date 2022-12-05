const WallModel = require("../models/wall.model");
const { validationResult } = require('express-validator');
const wallModel = require("../models/wall.model");

class WallController{
    #req;
    #res;

    constructor(req, res){
        this.#req = req;
        this.#res = res;
    }

    wall = async () => {     
        let user_details = this.#req.session.user;   
        if(user_details === undefined){
            this.#res.redirect("/homepage")
        }
        else{
            let fetched_contents = await WallModel.organizedContent();
            this.#res.render("wall.ejs", {user_details, fetched_contents});
        }
    }
    
    postMessage = async () => {
        let error_list = wallModel.htmlErrors(validationResult(this.#req).errors);
        if(error_list.length > 0){
            this.#res.json({errors : error_list});
        }
        else{
            let user_details = this.#req.session.user;   
            let post_details = this.#req.body;        
            WallModel.createMessage(user_details, post_details);   
            this.#res.json({});   
        }     
    }

    deleteMessage = async () => {
        let user_details = this.#req.session.user;
        let post_details = this.#req.body;
        WallModel.deleteMessage(user_details["id"], post_details["messages_id"]);
        this.#res.redirect("/wall");
    }

    postComment = async () => {
        let error_list = wallModel.htmlErrors(validationResult(this.#req).errors);
        if(error_list.length > 0){
            this.#res.json({errors : error_list});
        }
        else{
            let user_details = this.#req.session.user;   
            let post_details = this.#req.body;
            WallModel.createComment(user_details, post_details);
            this.#res.json({});
        }
    }

    deleteComment = async () => {
        let user_details = this.#req.session.user;
        let post_details = this.#req.body;
        WallModel.deleteComment(user_details["id"], post_details["comments_id"]);
        this.#res.redirect("/wall");
    }
}

module.exports = WallController;