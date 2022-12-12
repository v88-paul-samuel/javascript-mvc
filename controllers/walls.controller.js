import Helper from "../helpers/index.helper.js";
import WallModel from "../models/wall.model.js";

class Walls{
    #req;
    #res;
    #user;
    
    constructor(req, res){
        this.#req = req;
        this.#res = res;
        this.#user  = this.#req.session.user;
        if(this.#user !== undefined){
            
        }
        else{
            throw new Error("<p>Must be logged in to use this feature</p>")
        }
    }

    postMessage = async () => {
        let response_check_fields = Helper.checkFields(["message"], this.#req.body);

        if(!response_check_fields.status){
            this.#res.json(response_check_fields);
            
            return;
        }

        let response_post_message = await WallModel.postMessage(this.#user.id, response_check_fields.result.message);
        
        this.#res.json(response_post_message);

        return;
    }

    postComment = async () => {
        let response_check_fields = Helper.checkFields(["message_id", "comment"], this.#req.body);

        if(!response_check_fields.status){
            this.#res.json(response_check_fields);
            
            return;
        }

        let sanitized_data = response_check_fields.result;

        let response_post_message = await WallModel.postComment(this.#user.id, sanitized_data.message_id, sanitized_data.comment);
        
        this.#res.json(response_post_message);

        return;
    }

    deleteComment = async () => {
        let response_check_fields = Helper.checkFields(["comments_id"], this.#req.body);

        if(!response_check_fields.status){
            this.#res.json(response_check_fields);
            
            return;
        }    
        
        let response_delete_comment = await WallModel.deleteComment(this.#user.id, response_check_fields.result.comments_id);
        
        this.#res.json(response_delete_comment);

        return;
    }

    deleteMessage = async () => {
        let response_check_fields = Helper.checkFields(["messages_id"], this.#req.body);

        if(!response_check_fields.status){
            this.#res.json(response_check_fields);
            
            return;
        }    
        
        let response_delete_message = await WallModel.deleteMessage(this.#user.id, response_check_fields.result.messages_id);
        
        this.#res.json(response_delete_message);

        return;
    }

}

export default Walls;
