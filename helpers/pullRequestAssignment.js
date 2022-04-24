var databaseService = require('../service/databaseService');
var slackService = require('../service/slackService');
module.exports = (function () {

var assignPullRequest  = function (prData) {
    
    var channel_id = getTeamByRepository(prData.repository.name);
    var last_assigned = getLastAssigned(channel_id);

    // TODO: pull next two members for rotation

    // TODO: add them to the reviews table

    // TODO: tag them and send message to channel
    var message = `<${prData.links.html.href}|${prData.author.display_name} has opened a PR titled ${prData.title} for review!>`;  
    
}

return {
    assignPullRequest: assignPullRequest
};

})();
