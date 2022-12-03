const md5 = require("md5");
const moment = require("moment/moment.js");
const dbs = require("./connection.js");


class User{
    get_all_users = async () => {
        return await dbs.DBconnection.executeQuery ("SELECT * FROM users");
    }

    get_one_user = async (user_details) => {
        let query = dbs.format("SELECT * FROM users WHERE email = ?", user_details["email_address"]);
        let user = await dbs.DBconnection.executeQuery(query);
        if(user.result.length === 0){
            return "invalid";
        }
        else{
            let encrypted_password = md5(user_details["password"]);
            if(encrypted_password !== user.result[0].password){
                return "invalid";
            }
            return user.result[0];
        }
        return; 
    }

    add_user = async (user_details = "") => {
        let encrypted_password = md5(user_details['password']);
        let query = dbs.format(`INSERT users(first_name, last_name, email, password, created_at, updated_at) 
                                VALUES(?,?,?,?,?,?)`, 
                                [user_details["first_name"], 
                                user_details["last_name"] , 
                                user_details["email_address"],
                                encrypted_password,
                                moment().format('YYYY-MM-DD HH:mm:ss'),
                                moment().format('YYYY-MM-DD HH:mm:ss')
                            ]);

        return await dbs.DBconnection.executeQuery(query);
    }

    html_errors = (errors = []) => {
        let result = [];
        for(let e in errors){
            result.push("<p>" + errors[e].msg + "</p>");
        }

        return result;
    }

    check_email = async (email) => {
        let query = dbs.format("SELECT * FROM users WHERE email = ?", email);
        let user = await dbs.DBconnection.executeQuery(query);
        return user.result.length === 0;
    }

}

module.exports = new User();