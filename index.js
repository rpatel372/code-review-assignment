const express = require('express')
var bodyParser = require("body-parser");
var Slack = require('node-slack');

const app = express()

const port = process.env.PORT || 3000

app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({ extended: false }));

var databaseService = require('./service/databaseService');
var slackService = require ('./service/slackService');

function noop() {}

app.post('/incoming-pr', (req,res) => {
    var prData = req.body.pullrequest;
    var message = `<${prData.links.html.href}|${prData.author.display_name} has opened a PR titled ${prData.title} for review!>`;  
    var slack = new Slack('https://hooks.slack.com/services/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');
    var params = {
        attachments: [],
        text: message,
        username: "Code Review Assignment",
        channel: "random"
    };
    databaseService.connectToDatabase();
    slack.send(params, noop);
    res.status(200).end();
    
});

app.post('/incoming-slack-event', (req, res) => {
  var slackData = req.body;
  console.log(slackData);
  res.send({ slackData : slackData });
  res.status(200).end();
});

app.post('/incoming-slack-event/setup', (req, res) => {
  var slackData = req.body;
  console.log(slackData);
  slackService.setupRotation(slackData.channel_id, slackData.text, slackData.response_url)
  res.status(200).end();
});


app.post('/incoming-slack-event/add-repo', (req,res) => {
  res.status(200).end();
  
});


app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})