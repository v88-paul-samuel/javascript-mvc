import DBConnection from "./connection.js";

class Wall{
    getWallContent = async () => {
        let response_data = {status : true, result : {}, error : null};
        let query = DBConnection.format(`
        SELECT
            JSON_OBJECT(
                "messages_id", messages.id, "user_id", messages.user_id,  "message", message, "created_at", date_format(messages.created_at, "%M %D, %Y"),
                "sender_name", CONCAT(users.first_name, " ", users.last_name)
            ) AS message_object,
            (
                SELECT
                    JSON_OBJECTAGG(comments.id, JSON_OBJECT(
                        "comments_id", comments.id, "user_id", comments.user_id, "comment", comment, "created_at", date_format(comments.created_at, "%M %D, %Y"),
                        "sender_name", CONCAT(u.first_name, " ", u.last_name)
                    )
            ) 
                FROM comments 
                INNER JOIN users AS u ON comments.user_id = u.id
                WHERE comments.message_id = messages.id
            ) as comment_object
        FROM messages
        INNER JOIN users ON messages.user_id = users.id
        ORDER BY messages.created_at DESC`, []
        );

        response_data = await DBConnection.executeQuery(query);

        return response_data;
    }

    postMessage = async(user_id, message) => {
        let response_data = {status : true, result : {}, error : null};
        let query = DBConnection.format(`
            INSERT INTO messages(user_id, message, created_at, updated_at)
                VALUES(?,?, NOW(), NOW())`, [user_id, message]
            );

        response_data = await DBConnection.executeQuery(query);

        return response_data;
    } 

    postComment = async(user_id, message_id, comment) => {
        let response_data = {status : true, result : {}, error : null};
        let query = DBConnection.format(`
            INSERT INTO comments(user_id, message_id, comment, created_at, updated_at)
                VALUES(?,?, ?, NOW(), NOW())`, [user_id, message_id, comment]
            );

        response_data = await DBConnection.executeQuery(query);

        return response_data;
    }
    
    deleteComment = async(user_id, comments_id) => {
        let response_data = {status : true, result : {}, error : null};
        let query = DBConnection.format(`
            DELETE 
            FROM comments 
            WHERE comments.user_id = ? AND comments.id = ?`, [user_id, comments_id]
        );

        response_data = await DBConnection.executeQuery(query);

        return response_data;
    }

    deleteMessage = async(user_id, messages_id) => {
        let response_data = {status : true, result : {}, error : null};
        let query = DBConnection.format(`
            DELETE 
            FROM messages 
            WHERE messages.user_id = ? AND messages.id = ?`, [user_id, messages_id]
        );

        response_data = await DBConnection.executeQuery(query);

        return response_data;
    }
}

export default new Wall();