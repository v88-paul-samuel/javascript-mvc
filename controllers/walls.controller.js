import { validationResult } from "express-validator";
import  Helper  from "../helpers/index.helper.js";
import WallModel from "../models/wall.model.js";

class Walls{
    #req;
    #res;
    #is_logged_out;

    constructor(req, res){
        this.#req = req;
        this.#res = res;
        this.#is_logged_out = this.#req.session.user === undefined;
    }

    postMessage = async () => {
        if(this.#is_logged_out){
            this.#res.json({errors : "<p>You must be logged in to use this feature</p>"});
            
            return;
        }
        
        /* response_ prefix on variables means it contains the ff. {status : bool, result : {}, error : string/null}  */
        let response_check_fields = Helper.checkFields(["message"], this.#req.body)

        if(!response_check_fields.status){
            this.#res.json({errors : `<p>${response_check_fields.error}</p>`});
            
            return;
        }   

        let response_create_post = await WallModel.createMessage(this.#req.session.user["id"], response_check_fields.result["message"]);
        
        if(!response_create_post.status){
            this.#res.json({errors : `<p>${response_create_post.error}</p>`});
            
            return;
        }

        this.#res.json({});
    }

    postComment = async () => {
        if(this.#is_logged_out){
            this.#res.json({errors : "<p>You must be logged in to use this feature</p>"});
            
            return;
        }

        /* response_ prefix on variables means it contains the ff. {status : bool, result : {}, error : string/null}  */
        let response_check_fields = Helper.checkFields(["message_id", "comment"], this.#req.body);

        if(!response_check_fields.status){
            this.#res.json({errors : `<p>${response_check_fields.error}</p>`});
            
            return;
        }   

        let sanitized_posts = response_check_fields.result;
        let response_create_comment = await WallModel.createComment(this.#req.session.user["id"], sanitized_posts["message_id"], sanitized_posts["comment"]);
        
        if(!response_create_comment.status){
            this.#res.json({errors : `<p>${response_create_comment.error}</p>`});
            
            return;            
        }
        
        this.#res.json({});
        
    }

    deleteComment = async () => {
        if(this.#is_logged_out){
            this.#res.json({errors : "<p>You must be logged in to use this feature</p>"});
            
            return;
        }

        /* response_ prefix on variables means it contains the ff. {status : bool, result : {}, error : string/null}  */
        let response_check_fields = Helper.checkFields(["comments_id"], this.#req.body);    
        
        if(!response_check_fields.status){
            this.#res.json({errors : `<p>${response_check_fields.error}</p>`});
            
            return;
        }   
        
        let response_data = await WallModel.deleteComment(this.#req.session.user["id"], response_check_fields.result["comments_id"])
        
        if(!response_data.status){
            this.#res.json({errors : response_data.error});
            
            return;
        }

        this.#res.json({});
    }

    deleteMessage = async () => {
        if(this.#is_logged_out){
            this.#res.json({errors : "<p>You must be logged in to use this feature</p>"});
            
            return;
        }

        /* response_ prefix on variables means it contains the ff. {status : bool, result : {}, error : string/null}  */
        let response_check_fields = Helper.checkFields(["messages_id"], this.#req.body);    
        
        if(!response_check_fields.status){
            this.#res.json({errors : `<p>${response_check_fields.error}</p>`});
            
            return;
        }   
        
        let response_data = await WallModel.deleteMessage(this.#req.session.user["id"], response_check_fields.result["messages_id"])
        
        if(!response_data.status){
            this.#res.json({errors : response_data.error});
            
            return;
        }

        this.#res.json({errors : response_data.err});
    }
}

export default Walls;