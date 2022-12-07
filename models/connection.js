import Mysql from "mysql2";
import Constants from "../configs/constants.js";

const DBconnection = Mysql.createPool(Constants.DATABASE);
const format = Mysql.format;

DBconnection.executeQuery = async (query) => {
    return new Promise((resolve, reject) => {
        DBconnection.query(query, function(error, result){
            let response_data = { status: false, result: null, error: null };

            if(error){
                response_data.error = error;
            }
            else{
                response_data.status = true;
                response_data.result = result;
            }

            resolve(response_data);
        });
    });
}

export default {DBconnection : DBconnection, 'format' : format};