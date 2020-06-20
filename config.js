const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    consumer_key: process.env.API_token,  
    consumer_secret: process.env.API_secret,
    access_token: process.env.access_token,  
    access_token_secret: process.env.access_secret
}