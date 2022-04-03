var available_rotation_types = ["round-robin", "point-ranking"]

var Slack = require('node-slack');

module.exports = (function () {

function noop() {}

var setupRotation  = function (channelId, rotationType, webhookUrl) {
    var rotation = rotationType.trim();
    if (available_rotation_types.includes(rotation)) {
        // TODO: add to db
    } else {
        sendMessage(webhookUrl, channelId, "This is an invalid rotation type! Please select round-robin or point-ranking")
    }
}

var addRepositoryToTeam = function(channelId, bitbucketUrl) {

}

var addUserToRotation = function(channelId, user) {

}

var sendMessage = function(webhookUrl, channelId, message) {
    var slack = new Slack(webhookUrl);
    var params = {
        attachments: [],
        text: message,
        username: "Code Review Assignment",
        channel: channelId
    };
    slack.send(params, noop);
}

return {
    setupRotation: setupRotation
};

})();
