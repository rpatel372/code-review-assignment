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

var addUserToRotation = async function(channel, users, webhookUrl) {
    var channelId = await databaseService.getChannelId(channel);
    if (channelId == null) {
        sendMessage(webhookUrl, channel, "This Slack channel needs to be setup first! Please use the setup command to begin.");
    } else {
        var userIds = users.split(" ");
        var successful = [];
        var unsuccessful = [];
        for (var user of userIds) {
            try {
                if (user.includes("|")) {
                    var parsedUser = user.split("|")[0].substring(2);
                    successful.push(parsedUser);
                } else {
                    unsuccessful.push(user);
                }
            } catch {
                unsuccessful.push(user);
            }
        }

        for (var successfulUser of successful) {
            databaseService.insertUser(channelId, successfulUser);
        }

        var successUsersStr = "";
        for (var success in successful) {
            successUsersStr += ` <@${successful[success]}>`;
        }
        var unsuccessUsersStr = "";
        for (var unsuccess in unsuccessful) {
            unsuccessUsersStr += ` ${unsuccessful[unsuccess]}`;
        }
        var messageStr = `User(s)${successUsersStr} have been added!`;
        if (unsuccessful.length > 0) {
            messageStr += ` Users(s)${unsuccessUsersStr} were invalid users and were not added!`;
        }

        sendMessage(webhookUrl, channel, messageStr);
    }
}

var sendMessage = async function(webhookUrl, channelId, message) {
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
    addRepositoryToTeam: addRepositoryToTeam,
    addUserToRotation: addUserToRotation
};

})();
