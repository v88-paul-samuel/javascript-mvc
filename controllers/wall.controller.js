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
            let fetched_contents = await WallModel.organized_content();
            this.#res.render("wall.ejs", {user : user_details, fetched_contents : fetched_contents});
        }
    }
    
    post_message = async () => {
        let error_list = wallModel.html_errors(validationResult(this.#req).errors);
        if(error_list.length > 0){
            this.#res.json({errors : error_list});
        }
        else{
            let user_details = this.#req.session.user;   
            let post_details = this.#req.body;        
            WallModel.create_message(user_details, post_details);   
            this.#res.json({});   
        }     
    }

    delete_message = async () => {
        let user_details = this.#req.session.user;
        let post_details = this.#req.body;
        WallModel.delete_message(user_details, post_details["messages_id"]);
        this.#res.redirect("/wall");
    }

    post_comment = async () => {
        let error_list = wallModel.html_errors(validationResult(this.#req).errors);
        if(error_list.length > 0){
            this.#res.json({errors : error_list});
        }
        else{
            let user_details = this.#req.session.user;   
            let post_details = this.#req.body;
            WallModel.create_comment(user_details, post_details);
            this.#res.json({});
        }
    }

    delete_comment = async () => {
        let user_details = this.#req.session.user;
        let post_details = this.#req.body;
        WallModel.delete_comment(user_details, post_details["comments_id"]);
        this.#res.redirect("/wall");
    }
}

module.exports = WallController;