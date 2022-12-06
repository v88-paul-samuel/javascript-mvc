import moment from "moment/moment.js";
import dbs from "./connection.js";

class Wall{
    months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    createMessage = async(user_id, message) => {
        let response_data = {status : false, result : {}, err : null}
        let query = dbs.format(`
            INSERT messages(user_id, message, created_at, updated_at)
                VALUES(?,?,?,?)`, [
                    user_id, 
                    message, 
                    moment().format("YYYY-MM-DD HH:mm:ss"),
                    moment().format("YYYY-MM-DD HH:mm:ss")
                ]
        )
        
        response_data = await dbs.DBconnection.executeQuery(query);

        return response_data.result;
    }

    createComment = async(user_id, message_id, comment) => {
        let response_data = {status : false, result : {}, err :null}
        let query = dbs.format(`
            INSERT comments(message_id, user_id, comment, created_at, updated_at)
                VALUES(?,?,?,?,?)`, [
                    message_id,
                    user_id,
                    comment,
                    moment().format("YYYY-MM-DD HH:mm:ss"),
                    moment().format("YYYY-MM-DD HH:mm:ss")
                ]
        )
        response_data = await dbs.DBconnection.executeQuery(query);

        return response_data.result;
    };

    deleteComment = async(user_id, comment_id) => {
        let response_data = {status : false, result : {}, err :null}

        /* Server side security check */
        let query = dbs.format(`SELECT user_id FROM comments WHERE id = ?`, [comment_id]);
        response_data = await dbs.DBconnection.executeQuery(query);
        if(response_data.result[0].user_id !== user_id){
            return response_data.result;
        }

        query = dbs.format(`DELETE FROM comments WHERE id = ?`, [comment_id]);
        response_data = await dbs.DBconnection.executeQuery(query);

        return response_data.result;
    }

    deleteMessage = async(user_id, message_id) => {
        let response_data = {status : false, result : {}, err :null}

        /* Server side security check */
        let query = dbs.format(`SELECT user_id FROM messages WHERE id = ?`, [message_id]);
        response_data = await dbs.DBconnection.executeQuery(query);
        if(response_data.result[0].user_id !== user_id){
            return response_data.result;
        }

        /* Delete the sub comments */
        query = dbs.format(`DELETE FROM comments WHERE message_id = ?`, [message_id]);
        response_data = await dbs.DBconnection.executeQuery(query);

        /* Delete the message */
        query = dbs.format(`DELETE FROM messages WHERE id = ?`, [message_id]);
        response_data = await dbs.DBconnection.executeQuery(query);
        
        return response_data.result;
    }

    /* The hardest part Combine message and comments with their respecitve user/authors in one query */
    getWallContent = async () => {
        let response_data = {status : false, result : {}, err : null};
        let query = dbs.format(`
                SELECT
                    messages.id as messages_id, messages.user_id as messages_user_id, message, messages.created_at as messages_created_at,
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

        /* 
            This is the only process I know that is linear in time complexity. The problem with JSON_OBJECT
            at MYSQL is that it destroys the proper arrangement of order by (I can't sort it in mySQL) 
        */
        response_data = await dbs.DBconnection.executeQuery(query);
        let fetched_contents = response_data.result;
        let organized_content = [];
        for(let key in fetched_contents){
            let current_content = fetched_contents[key];
            let comment_value = null;
            if(current_content.comments_id !== null){
                comment_value = {
                    comments_id : current_content.comments_id,
                    user_id : current_content.comments_user_id,
                    first_name : current_content.comments_first_name,
                    last_name : current_content.comments_last_name,
                    comment : current_content.comment,
                    created_at : this.dateFormatter(current_content.comments_created_at)
                }
            }
            let oc_key = organized_content.length - 1;
            if(key === "0" || current_content.messages_id !== organized_content[oc_key]["messages_id"]){
                organized_content.push(
                    {
                        messages_id : current_content.messages_id,    
                        user_id : current_content.messages_user_id,
                        first_name : current_content.messages_first_name,
                        last_name : current_content.messages_last_name,
                        message : current_content.message,
                        comments : [comment_value],
                        created_at : this.dateFormatter(current_content.messages_created_at)
                    }
                )
            }
            else{
                organized_content[oc_key]["comments"].push(comment_value);
            }
        }

        return organized_content;
    }

    dateFormatter = (my_date) => {
        if(my_date === null){
            return my_date;
        }
        let day = my_date.getDate();
        if(day === 1){
            day = `${day}st`;
        }
        else if(day === 2){
            day = `${day}nd`;
        }
        else if(day === 3){
            day = `${day}rd`;
        }
        else{
            day = `${day}th`;
        }

        return `${this.months[my_date.getMonth()]} ${day} ${my_date.getFullYear()}`;
    }
}

export default new Wall();