import dbs from "./connection.js";
import moment from "moment/moment.js";
import constant_helper from "../helpers/constants.js";

class Wall{
    months;
    
    constructor(){
        this.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    }

    getAllMessage = async() => {
        let response_data = {status: false, result: {}, err: null};
        let query = dbs.format(`
                SELECT 
                        messages.id as messages_id, user_id, message, messages.created_at,
                        first_name, last_name
                FROM messages
                INNER JOIN users ON messages.user_id = users.id
                ORDER BY messages.created_at DESC`
        );
                            
        response_data = await dbs.DBconnection.executeQuery(query);
        let fetched_messages = response_data.result;
        for(let key in fetched_messages){
            fetched_messages[key]["created_at"] = this.dateFormatter(fetched_messages[key]["created_at"]);
        }

        return fetched_messages;
    }

    getAllComments = async() => {
        let response_data = {status: false, result: {}, err: null};
        let query = dbs.format(`
                SELECT 
                        comments.id as comments_id, message_id, user_id, comment, comments.created_at,
                        first_name, last_name 
                FROM comments
                INNER JOIN users ON comments.user_id = users.id
                ORDER BY comments.created_at ASC`
        );
        response_data = await dbs.DBconnection.executeQuery(query);
        let fetched_comments = response_data.result;
        for(let key in fetched_comments){
            fetched_comments[key]["created_at"] = this.dateFormatter(fetched_comments[key]["created_at"]);
        }

        return fetched_comments;
    }

    createMessage = async(user_details, message_details) => {
        let query = dbs.format(`
                INSERT messages(user_id, message, created_at, updated_at) 
                VALUES(?,?,?,?)`, [
                    user_details["id"], 
                    message_details["message_box"], 
                    moment().format('YYYY-MM-DD HH:mm:ss'), 
                    moment().format('YYYY-MM-DD HH:mm:ss')
                ]
        );
        
        return await dbs.DBconnection.executeQuery(query);
    }

    deleteMessage = async(user_id, messages_id) => {
        let query = dbs.format(`
                SELECT user_id 
                FROM messages 
                WHERE id = ?`, [messages_id]
        );
        let message = await dbs.DBconnection.executeQuery(query);
        if(message.result[0]["user_id"] !== user_id){
            return constant_helper.INVALID_VALIDATION_MESSAGE;
        }

        /* Delete all subcomments */
        query = dbs.format(`
                DELETE 
                FROM comments 
                WHERE message_id = ?`, [messages_id]
        );
        await dbs.DBconnection.executeQuery(query);
        
        /* Delete the message */
        query = dbs.format(`
                DELETE 
                FROM messages 
                WHERE id = ?`, [messages_id]
        );

        return await dbs.DBconnection.executeQuery(query);        
    }

    createComment = async(user_details, comment_details) => {
        let query = dbs.format(`
                INSERT comments(message_id, user_id, comment, created_at, updated_at)
                    VALUES(?,?,?,?,?)`, [
                        comment_details["message_id"], 
                        user_details["id"], 
                        comment_details["comment_box"], 
                        moment().format('YYYY-MM-DD HH:mm:ss'), 
                        moment().format('YYYY-MM-DD HH:mm:ss')
                    ]
        );
        
        return await dbs.DBconnection.executeQuery(query);
    }

    deleteComment = async(user_id, comment_id) => {
        let query = dbs.format(`
                SELECT user_id 
                FROM comments 
                WHERE id = ?`, [comment_id]
        );

        let comment = await dbs.DBconnection.executeQuery(query);
        if(comment.result[0]["user_id"] !== user_id){
            return constant_helper.INVALID_VALIDATION_MESSAGE;
        }
        query = dbs.format(`
                DELETE 
                FROM comments 
                WHERE id = ?`, [comment_id]
        );

        return await dbs.DBconnection.executeQuery(query);
    }

    organizedContent = async () => {
        let fetched_messages = await this.getAllMessage();
        let fetched_comments = await this.getAllComments();

        /* 
            Groups together the comments with respect to their message_id and organizes them into 
            and an object where the key is the message_id
        */
        let organized_comments = {};
        for(let comment of fetched_comments){
            if(organized_comments[comment["message_id"]] === undefined){
                organized_comments[comment["message_id"]] = [];
            }
            organized_comments[comment["message_id"]].push(comment);
        }

        /* Adds the organized comments to its respective message */
        for(let key in fetched_messages){                            
            if(organized_comments[fetched_messages[key]["messages_id"]] !== undefined){
                fetched_messages[key]["comments"] ??= [];
                fetched_messages[key]["comments"] = organized_comments[fetched_messages[key]["messages_id"]];
            }
            else{
                fetched_messages[key]["comments"] = [];
            }
        }
        
        return fetched_messages;
    }

    htmlErrors = (errors = []) => {
        let result = [];
        for(let e in errors){
            result.push("<p>" + errors[e].msg + "</p>");
        }

        return result;
    }

    dateFormatter = (my_date) => {
        let day = my_date.getDate();

        if(day === 1){
            day = day+"st";
        }
        else if(day === 2){
            day = day+"nd";
        }
        else if(day === 3){
            day = day+"rd";
        }
        else{
            day = day+"th";
        }

        return `${this.months[my_date.getMonth()]} ${day} ${my_date.getFullYear()}`;
    }
}

export default new Wall();