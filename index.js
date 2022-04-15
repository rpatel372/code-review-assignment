const express = require('express')
var bodyParser = require("body-parser");
var Slack = require('node-slack');

const app = express()

const port = process.env.PORT || 3000

app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({ extended: false }));

var slackService = require ('./service/slackService');

function noop() {}

app.post('/incoming-pr', (req,res) => {
    var prData = req.body.pullrequest;
    // TODO: get team
    getTeam();
    // TODO: pull next two members from rotation and add them to the database

    // TODO: tag them and send message to channel
    var message = `<${prData.links.html.href}|${prData.author.display_name} has opened a PR titled ${prData.title} for review!>`;  
    
    res.status(200).end();
    
});

app.post('/incoming-slack-event', (req, res) => {
  var slackData = req.body;
  console.log(slackData);
  res.send({ slackData : slackData });
  res.status(200).end();
});

app.post('/incoming-slack-event/setup', (req, res) => {
  res.status(200).end();
  var slackData = req.body;
  console.log(slackData);
  slackService.setupRotation(slackData.channel_id, slackData.text, slackData.response_url)
});


app.post('/incoming-slack-event/add-repo', (req,res) => {
  res.status(200).end();
  var slackData = req.body;
  console.log(slackData);
  slackService.addRepositoryToTeam(slackData.channel_id, slackData.text, slackData.response_url)
});

app.post('/incoming-slack-event/add-member', (req,res) => {
  res.status(200).end();
  var slackData = req.body;
  console.log(slackData);
  slackService.addUserToRotation(slackData.channel_id, slackData.text, slackData.response_url)
});


app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})