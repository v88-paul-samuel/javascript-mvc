const dbs = require("./connection.js");
const moment = require("moment/moment.js");

class Wall{
    months;
    
    constructor(){
        this.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    }

    get_all_message = async() => {
        let query = dbs.format(`SELECT messages.id as messages_id, user_id, message, messages.created_at,
                                    first_name, last_name
                                    FROM messages
                                    INNER JOIN users ON messages.user_id = users.id
                                    ORDER BY messages.created_at DESC`);
                            
        let result_query = await dbs.DBconnection.executeQuery(query);
        let fetched_messages = result_query.result;
        for(let key in fetched_messages){
            let d = fetched_messages[key]["created_at"];
            let day = d.getDate();
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

            fetched_messages[key]["created_at"] = this.months[d.getMonth()]+" "+day+" "+d.getFullYear();
        }

        return fetched_messages;
    }

    get_all_comments = async() => {
        let query = dbs.format(`SELECT comments.id as comments_id, message_id, user_id, comment, comments.created_at,
                                    first_name, last_name 
                                    FROM comments
                                    INNER JOIN users ON comments.user_id = users.id
                                    ORDER BY comments.created_at ASC`);

        let result_query = await dbs.DBconnection.executeQuery(query);
        let fetched_comments = result_query.result;
        for(let key in fetched_comments){
            let d = fetched_comments[key]["created_at"];
            let day = d.getDate();
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

            fetched_comments[key]["created_at"] = this.months[d.getMonth()]+" "+day+" "+d.getFullYear();
        }

        return result_query.result;
    }

    create_message = async(user_details, message_details) => {
        let query = dbs.format(`INSERT messages(user_id, message, created_at, updated_at) 
                                    VALUES(?,?,?,?)`, [user_details["id"], message_details["message_box"],  moment().format('YYYY-MM-DD HH:mm:ss'),  moment().format('YYYY-MM-DD HH:mm:ss')]);
        
        return await dbs.DBconnection.executeQuery(query);
    }

    delete_message = async(user_details, messages_id) => {
        let query = dbs.format(`SELECT user_id FROM messages WHERE id = ?`, [messages_id]);
        let message = await dbs.DBconnection.executeQuery(query);
        if(message.result[0]["user_id"] !== user_details["id"]){
            return;
        }

        /* Delete all subcomments */
        query = dbs.format("DELETE FROM comments WHERE message_id = ?", [messages_id]);
        await dbs.DBconnection.executeQuery(query);
        
        /* Delete the message */
        query = dbs.format(`DELETE FROM messages WHERE id = ?`, [messages_id]);

        return await dbs.DBconnection.executeQuery(query);        
    }

    create_comment = async(user_details, comment_details) => {
        let query = dbs.format(`INSERT comments(message_id, user_id, comment, created_at, updated_at)
                                     VALUES(?,?,?,?,?)`, [comment_details["message_id"], user_details["id"], comment_details["comment_box"], moment().format('YYYY-MM-DD HH:mm:ss'), moment().format('YYYY-MM-DD HH:mm:ss')]);
        
        return await dbs.DBconnection.executeQuery(query);
    }

    delete_comment = async(user_details, comment_id) => {
        let query = dbs.format(`SELECT user_id FROM comments WHERE id = ?`, [comment_id]);
        let comment = await dbs.DBconnection.executeQuery(query);
        if(comment.result[0]["user_id"] !== user_details["id"]){
            return;
        }
        query = dbs.format(`DELETE FROM comments WHERE id = ?`, [comment_id]);

        return await dbs.DBconnection.executeQuery(query);
    }

    organized_content = async () => {
        let fetched_messages = await this.get_all_message();
        let fetched_comments = await this.get_all_comments();
        let organized_comments = {};
        for(let comment of fetched_comments){
            if(organized_comments[comment["message_id"]] === undefined){
                organized_comments[comment["message_id"]] = [];
            }
            organized_comments[comment["message_id"]].push(comment);
        }

        let organized_contents = fetched_messages;
        for(let key in organized_contents){
            if(organized_comments[organized_contents[key]["messages_id"]] !== undefined){
                if(organized_contents[key]["comments"] === undefined){
                    organized_contents[key]["comments"] = [];
                }
                organized_contents[key]["comments"] = organized_comments[organized_contents[key]["messages_id"]];
            }
            else{
                organized_contents[key]["comments"] = [];
            }
        }
        
        return organized_contents;
    }

    html_errors = (errors = []) => {
        let result = [];
        for(let e in errors){
            result.push("<p>" + errors[e].msg + "</p>");
        }

        return result;
    }
}

module.exports = new Wall();