import Md5 from "Md5";
import DBConnection from "./connection.js";

/**
 * @class
 * Class representing User Model
 */
class User{
    /**
     * DOCU: get one user from the database 
     * Triggered by 'login' in view.controller.js
     * @param {object} user_details 
     * @returns {object} the user details {id: string, first_name: string, last_name: string, email: string, password: string, created_at: string, updated_at: string}
     * @author Paul Samuel Lacap
     */
    getOneUser = async ({email_address, password}) => {
        let response_data = {status: false, result: {}, err: null};
        let query = DBConnection.format(`
                SELECT id, first_name, last_name, email, password 
                FROM users 
                WHERE email = ?`, [email_address]
        );
        
        response_data = await DBConnection.executeQuery(query);
        
        if(Md5(password) !== response_data.result[0]?.password){
            return [];            
        }

        return response_data.result; 
    }

    /**
     * DOCU: Add one user to the database
     * Triggered by: "register" in view.controller.js* 
     * @param {object} user_details=""
     * @returns {object} the response data
     * @author Paul Samuel Lacap
     */
    addUser = async ({email_address, first_name, last_name, password}) => {
        let response_data = {status: false, result: {}, err: null};
        let query = DBConnection.format(`
                INSERT users(first_name, last_name, email, password, created_at, updated_at) 
                    VALUES(?,?,?,?, NOW(), NOW())`, [
                        first_name, 
                        last_name, 
                        email_address,
                        Md5(password),                    
                    ]);

        response_data = await DBConnection.executeQuery(query)

        return response_data.result;      
    }

    /**
     * DOCU: Organized the validation errors for display
     * @param {array} errors=[]
     * @returns {array} an array of error messages in <p></p> tags
     * @author Paul Samuel Lacap
     */
    htmlErrors = (errors = []) => {
        let result = [];
        for(let e in errors){
            result.push(`<p>${errors[e].msg}</p>`);
        }

        return result;
    }

    /**
     * DOCU: Checks if an email already registered
     * Triggered by "register" in view.controller.js
     * @param {string} email 
     * @returns {int} 0 if no email is found and > 0 otherwise
     * @author Paul Samuel Lacap
     */
    hasEmail = async (email) => {
        let response_data = {status: false, result: {}, err: null};
        let query = DBConnection.format(`
                SELECT COUNT(id) as number 
                FROM users 
                WHERE email = ?`, [email]);

        response_data = await DBConnection.executeQuery(query);
        
        return response_data.result[0]["number"] === 0;
    }

}

export default new User();