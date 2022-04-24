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
                return res.rows[0]["channel_id"];
            }
            return null;
        } catch (err) {
            console.log(err);
            return null;
        }
    };

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

    var insertUser = function (channelId, user) {
        var nextRotationOrder = 1;
        pool.connect()
        .then(client => {
            return client.query(`SELECT user_order FROM members WHERE channel_id = '${channelId}'`)
                .then(res => {
                    if (res.rows.length > 0) {
                        nextRotationOrder = parseInt(res.rows[0]["user_order"]) + 1;
                    }
                    client.query(`INSERT INTO members(channel_id, user_id, user_order) VALUES('${channelId}', '${user}', '${nextRotationOrder}')`)
                    client.release();
                })
                .catch(e => {
                    client.release()
                    console.log(e.stack); 
                })
            });
    };

    var getTeamByRepository = async function (repoName) {
        try {
            const res = await pool.query(
                `SELECT channel_id FROM repos WHERE repo = '${repoName}'`
            );
            
            if (res.rows.length > 0) {
                return res.rows[0]["channel_id"];
            }
            return null;
        } catch (err) {
            console.log(err);
            return null;
        }
    };

    var getLastAssigned = async function (channelId) {
        try {
            const res = await pool.query(
                `SELECT member_id FROM reviews WHERE channel_id = '${channelId} ORDER BY assignment_id LIMIT 1;'`
            );
            
            if (res.rows.length > 0) {
                return res.rows[0]["member_id"];
            }
            return null;
        } catch (err) {
            console.log(err);
            return null;
        }
    };

    return {
        insertRotationType: insertRotationType,
        getChannelId: getChannelId,
        insertRepo: insertRepo,
        insertUser: insertUser,
        getTeamByRepository: getTeamByRepository,
        getLastAssigned: getLastAssigned
    };



})();
