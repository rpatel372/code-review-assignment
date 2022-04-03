const { Client } = require('pg');

module.exports = (function () {

    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });

    var insertRotationType = function (slackChannelId, rotationType) {
        client.connect();
        client.query(
        `INSERT INTO channels(channel, rotation_type) VALUES('${slackChannelId}', '${rotationType}')`,
        (err, res) => {
            console.log(err, res);
            client.end();
        }
        );
        
    };

    return {
        insertRotationType: insertRotationType
    };



})();
