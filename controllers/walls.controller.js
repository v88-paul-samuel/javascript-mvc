import  Helper  from "../helpers/index.helper.js";
import WallModel from "../models/wall.model.js";

class Walls{
    #req;
    #res;
    #user;

    constructor(req, res){
        this.#req = req;
        this.#res = res;

        if(this.#req.session && this.#req.session.user !== undefined){
            this.#user = this.#req.session.user;
        }
        else{
            throw new Error("<p>You must be logged in to use this feature</p>");
        }

    }

    postMessage = async () => {        
        /* response_ prefix on variables means it contains the ff. {status : bool, result : {}, error : string/null}  */
        let response_check_fields = Helper.checkFields(["message"], this.#req.body)

        if(!response_check_fields.status){
            this.#res.json(response_check_fields); 

            return
        }   

        let response_create_post = await WallModel.createMessage(this.#user["id"], response_check_fields.result["message"]);
        
        this.#res.json(response_create_post);
    }

    postComment = async () => {
        /* response_ prefix on variables means it contains the ff. {status : bool, result : {}, error : string/null}  */
        let response_check_fields = Helper.checkFields(["message_id", "comment"], this.#req.body);

        if(!response_check_fields.status){
            this.#res.json(response_check_fields);
            
            return;
        }   

        let sanitized_posts = response_check_fields.result;
        let response_create_comment = await WallModel.createComment(this.#user["id"], sanitized_posts["message_id"], sanitized_posts["comment"]);
                
        this.#res.json(response_create_comment);
    }

    deleteComment = async () => {
        /* response_ prefix on variables means it contains the ff. {status : bool, result : {}, error : string/null}  */
        let response_check_fields = Helper.checkFields(["comments_id"], this.#req.body);    
        
        if(!response_check_fields.status){
            this.#res.json(response_check_fields);
            
            return;
        }  
        
        let response_data = await WallModel.deleteComment(this.#user["id"], response_check_fields.result["comments_id"])
        
        this.#res.json(response_data);
    }

    deleteMessage = async () => {
        /* response_ prefix on variables means it contains the ff. {status : bool, result : {}, error : string/null}  */
        let response_check_fields = Helper.checkFields(["messages_id"], this.#req.body);    
        
        if(!response_check_fields.status){
            this.#res.json(response_check_fields);
            
            return;
        }  
        
        let response_data = await WallModel.deleteMessage(this.#user["id"], response_check_fields.result["messages_id"])

        this.#res.json(response_data);
    }
}

export default Walls;