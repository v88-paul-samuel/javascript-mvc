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
        let query = dbs.DBconnection.format(`
                SELECT JSON_OBJECT("messages_id", messages.id, "user_id", m_users.id, "message", message, "first_name", m_users.first_name, "last_name", m_users.last_name, "created_at", DATE_FORMAT(messages.created_at, "%M %D, %Y")) AS json_message,
                    json_arrayagg(JSON_OBJECT("comments_id", named_comments.id, "user_id", named_comments.user_id, "first_name", named_comments.first_name, "last_name", named_comments.last_name, "created_at", DATE_FORMAT(named_comments.created_at, "%M %D, %Y"), "comment", named_comments.comment)) AS json_comments
                FROM messages
                INNER JOIN users as m_users ON messages.user_id = m_users.id
                LEFT JOIN 
                (	SELECT comments.id, comments.message_id, comments.user_id, comments.comment, comments.created_at,
                        c_users.first_name, c_users.last_name
                    FROM comments 
                    INNER JOIN users as c_users ON comments.user_id = c_users.id
                ) AS named_comments ON messages.id = named_comments.message_id
                GROUP BY messages.id
                ORDER BY messages.created_at DESC, named_comments.created_at ASC;
        `);
        
        response_data = await dbs.DBconnection.executeQuery(query);
 
        return response_data.result;
    }
}

export default new Wall();