const { Pool } = require('pg')
const connectionString = 'postgres://igaljzqztaxmoj:dcdf19fa750f184b8eae3413f94058720ded74046eb848f03ab2c1e6e6f31f62@ec2-18-215-96-22.compute-1.amazonaws.com:5432/d7670tflruut4b';
const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = (function () {

    var insertRotationType = function (slackChannelId, rotationType) {
        pool.connect()
        .then(client => {
            return client.query(`INSERT INTO channels(channel, rotation_type) VALUES('${slackChannelId}', '${rotationType}')`)
                .then(res => {
                    client.release();
                })
                .catch(e => {
                    client.release()
                    console.log(e.stack); 
                })
            });
    };

    var getChannelId = async function (slackChannel) {
        try {
            const res = await pool.query(
                `SELECT channel_id FROM channels WHERE channel = '${slackChannel}'`
            );
            
            if (res.rows.length > 0) {
                console.log(res.rows[0]);
                return res.rows[0]["channel_id"];
            }
            return null;
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    var insertRepo = function (channelId, repo) {
        pool.connect()
        .then(client => {
            return client.query(`INSERT INTO repos(channel_id, repo) VALUES('${channelId}', '${repo}')`)
                .then(res => {
                    client.release();
                })
                .catch(e => {
                    client.release()
                    console.log(e.stack); 
                })
            });
    };

    return {
        insertRotationType: insertRotationType,
        getChannelId: getChannelId,
        insertRepo: insertRepo
    };



})();
