const UserModel =  require("../models/users.model");
const { validationResult } = require('express-validator');
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
    login = async () => {     
        let error_list = UserModel.html_errors(validationResult(this.#req).errors);
        if(error_list.length > 0){
            this.#res.json({errors : error_list});
        }
        else{
            let user_details = this.#req.body;
            this.#req.session.user = await UserModel.get_one_user(user_details);
            if(this.#req.session.user === "invalid"){
                error_list.push("<p>Invalid Credentials!</p>");
                this.#res.json({errors : error_list});
            }
            else{
                this.#res.json({status : this.#req.session.user});
            }
        }

    }
    logoff = async () => {
        delete this.#req.session.user;
        this.#res.redirect("/homepage")
    }
    register = async () => {
        let error_list = UserModel.html_errors(validationResult(this.#req).errors);
        if(error_list.length > 0){
            this.#res.json({errors : error_list});
        }
        else{
            let is_email_unique = await UserModel.check_email(this.#req.body["email_address"]);
            if(!is_email_unique){
                error_list.push("<p>Email Already Taken</p>");
                this.#res.json({errors : error_list});
            }
            else{
                await UserModel.add_user(this.#req.body);
                this.#res.json({status : true});
            }
        }        
    }
}

module.exports = ViewController;