var available_rotation_types = ["round-robin", "point-ranking"]

var Slack = require('node-slack');
var databaseService = require('./databaseService');

module.exports = (function () {

function noop() {}

var setupRotation  = function (channel, rotationType, webhookUrl) {
    var rotation = rotationType.trim();
    if (available_rotation_types.includes(rotation)) {
        // TODO: add to db
        databaseService.insertRotationType(channel, rotationType);
        sendMessage(webhookUrl, channel, "Setup has succeeded! Now you must add your repositories and members to the rotation.");
    } else {
        sendMessage(webhookUrl, channel, "This is an invalid rotation type! Please select round-robin or point-ranking");
    }
}

var addRepositoryToTeam = async function(channel, repoNames, webhookUrl) {
    var channelId = await databaseService.getChannelId(channel);
    console.log("test 1: " + channelId);
    if (channelId == null) {
        sendMessage(webhookUrl, channel, "This Slack channel needs to be setup first! Please use the setup command to begin.");
    } else {
        var repos = repoNames.split(" ");
        for (var repo of repos) {
            databaseService.insertRepo(channelId, repo);
        }
        sendMessage(webhookUrl, channel, "These repositories has been successfully added!");
    }
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
    setupRotation: setupRotation,
    addRepositoryToTeam: addRepositoryToTeam
};

})();
