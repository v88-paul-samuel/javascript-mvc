import UserModel from "../models/user.model.js";
import { validationResult } from 'express-validator';

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
        let error_list = UserModel.htmlErrors(validationResult(this.#req).errors);
        if(error_list.length > 0){
            this.#res.json({error_list});
        }
        else{
            let user_details = this.#req.body;
            let [fetched_user] = await UserModel.getOneUser(user_details);
            if(fetched_user === undefined){
                error_list.push("<p>Invalid Credentials!</p>");
                this.#res.json({error_list});
            }
            else{
                this.#req.session.user = fetched_user;
                this.#res.json({status : this.#req.session.user});
            }
        }

    }

    logoff = async () => {
        delete this.#req.session.user;
        this.#res.redirect("/homepage")
    }
    
    register = async () => {
        let error_list = UserModel.htmlErrors(validationResult(this.#req).errors);
        if(error_list.length > 0){
            this.#res.json({error_list});
        }
        else{
            let is_email_unique = await UserModel.hasEmail(this.#req.body["email_address"]);
            if(!is_email_unique){
                error_list.push("<p>Email Already Taken</p>");
                this.#res.json({error_list});
            }
            else{
                await UserModel.addUser(this.#req.body);
                this.#res.json({status : true});
            }
        }        
    }
}

export default ViewController;