import DBConnection from "./connection.js";

class Wall{
    months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    createMessage = async(user_id, message) => {
        let response_data = {status : false, result : {}, error : null}
        let query = DBConnection.format(`
            INSERT messages(user_id, message, created_at, updated_at)
                VALUES(?,?, NOW(), NOW())`, [
                    user_id, 
                    message,                     
                ]);
    
        response_data = await DBConnection.executeQuery(query);
        
        if(response_data.result.affectedRows === 0){
            response_data.status = false;
            response_data.error = "<p>Message not sent! Something went wrong</p>";
        }

        return response_data;
    }

    createComment = async(user_id, message_id, comment) => {
        let response_data = {status : false, result : {}, error :null}
        let query = DBConnection.format(`
            INSERT comments(message_id, user_id, comment, created_at, updated_at)
                VALUES(?,?,?, NOW(), NOW())`, [
                    message_id,
                    user_id,
                    comment,
                ])

        response_data = await DBConnection.executeQuery(query);

        if(response_data.result.affectedRows === 0){
            response_data.status = false;
            response_data.error = "<p>Message not sent! Something went wrong</p>";
        }
        
        return response_data;
    };

    deleteComment = async(user_id, comment_id) => {
        let response_data = {status : false, result : {}, error :null}

        let query = DBConnection.format(`
            DELETE 
            FROM comments 
            WHERE id = ? AND user_id = ?`, [comment_id, user_id]);
        response_data = await DBConnection.executeQuery(query);
        
        if(response_data.result.affectedRows === 0){
            response_data.status = false;
            response_data.error = "<p>Something went wrong!</p>";
        }

        return response_data;
    }

    deleteMessage = async(user_id, message_id) => {
        let response_data = {status : false, result : {}, err :null}

        /* Deletes the message along with its sub comments */
        let query = DBConnection.format(`
            DELETE messages
            FROM messages 
            WHERE messages.id = ? AND user_id = ?`, [message_id, user_id]
        );

        response_data = await DBConnection.executeQuery(query);
        
        if(response_data.result.affectedRows === 0){
            response_data.status = false;
            response_data.error = "<p>Something went wrong!</p>";
        }

        return response_data;
    }

    /* The hardest part Combine message and comments with their respecitve user/authors in one query */
    getWallContent = async () => {
        let response_data = {status : false, result : {}, error : null};
        let query = DBConnection.format(`
                SELECT JSON_OBJECT(
                                    "messages_id", messages.id, "message", message, "created_at", DATE_FORMAT(messages.created_at, "%M %D, %Y"),
                                    "user_id", m_users.id, "first_name", m_users.first_name, "last_name", m_users.last_name) AS json_message,
                    JSON_ARRAYAGG(JSON_OBJECT(
                                                "comments_id", named_comments.id, "comment", named_comments.comment, "created_at", DATE_FORMAT(named_comments.created_at, "%M %D, %Y"), 
                                                "user_id", named_comments.user_id, "first_name", named_comments.first_name, "last_name", named_comments.last_name)) AS json_comments
                FROM messages
                INNER JOIN users as m_users ON messages.user_id = m_users.id
                LEFT JOIN 
                (	SELECT 
                            comments.id, comments.message_id, comments.user_id, comments.comment, comments.created_at,
                            c_users.first_name, c_users.last_name
                    FROM comments 
                    INNER JOIN users as c_users ON comments.user_id = c_users.id
                ) AS named_comments ON messages.id = named_comments.message_id
                GROUP BY messages.id
                ORDER BY messages.created_at DESC, named_comments.created_at ASC;
        `);
        
        response_data = await DBConnection.executeQuery(query);
 
        return response_data.result;
    }
}

export default new Wall();