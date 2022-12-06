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
        let response_data = {status : false, result : {}, err : null}
        let query = dbs.format(`
                SELECT
                    messages.id as messages_id, messages.user_id as user_id, message, messages.created_at as messages_created_at,  
                    users.first_name as messages_first_name, users.last_name as messages_last_name,
                    named_comments.id as comments_id, named_comments.user_id as comments_user_id, named_comments.comment, named_comments.first_name as comments_first_name, named_comments.last_name as comments_last_name, named_comments.created_at as comments_created_at
                FROM messages
                INNER JOIN users ON users.id = messages.user_id
                LEFT JOIN (
                    SELECT c.id, c.user_id, c.message_id, c.comment, u.first_name, u.last_name, c.created_at
                    FROM comments as c
                    INNER JOIN users as u ON c.user_id = u.id 
                ) as named_comments ON messages.id = named_comments.message_id
                ORDER BY messages_created_at DESC, comments_created_at ASC
        `)

        response_data = await dbs.DBconnection.executeQuery(query);
        
        let fetched_contents = response_data.result;
        let organized_content = [];
        for(let key in fetched_contents){
            let cur = fetched_contents[key];
            let comment_value = null;  
            if(cur.comments_id !== null){            
                comment_value = 
                    {
                        comments_id : cur.comments_id,
                        user_id : cur.comments_user_id,
                        first_name : cur.comments_first_name,
                        last_name : cur.comments_last_name, 
                        comment : cur.comment,
                        created_at : this.dateFormatter(cur.comments_created_at)
                    }
            }
            let oc_key = organized_content.length - 1;
            if(key === "0" || (cur.messages_id !== organized_content[oc_key]["messages_id"])){
                organized_content.push(
                    {
                        messages_id : cur.messages_id, 
                        user_id : cur.user_id,
                        message : cur.message, 
                        first_name : cur.messages_first_name,
                        last_name : cur.messages_last_name,
                        comments : [comment_value],
                        created_at : this.dateFormatter(cur.messages_created_at)
                    }
                );
            }
            else{
                organized_content[oc_key]["comments"].push(comment_value)
            }
        }

         return organized_content;
    }

    htmlErrors = (errors = []) => {
        let result = [];
        for(let e in errors){
            result.push("<p>" + errors[e].msg + "</p>");
        }

        return result;
    }

    dateFormatter = (my_date) => {
        if(my_date === null){
            return null;
        }
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