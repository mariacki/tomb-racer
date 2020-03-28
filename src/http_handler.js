const fs = require('fs');

const INDEX_FILE = 'public/index.html';
const ENDCODING = 'utf8';

const sendTo = (response) => {
    return (err, data) => {
        if (err) {
            console.log(err);
        }

        response.end(data);
    }
}

const handleHTTPRequest = (request, response) => {
    fs.readFile(INDEX_FILE, ENDCODING, sendTo(response));  
}

module.exports = {
    handleHTTPRequest
}