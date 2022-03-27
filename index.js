const express = require('express')
const app = express()
const port = process.env.PORT || 3000
var Slack = require('node-slack');

app.use(express.json()) 

/* 
    Incase you are using mongodb atlas database uncomment below line
    and replace "mongoAtlasUri" with your mongodb atlas uri.
*/
// mongoose.connect( mongoAtlasUri, {useNewUrlParser: true, useUnifiedTopology: true})
function noop() {}
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/incoming-pr',(req,res) => {
    var prData = req.body.pullrequest;
    var message = `<${prData.links.html.href}|${prData.author.display_name} has opened a PR titled ${prData.title} for review!>`;  
    var slack = new Slack('https://hooks.slack.com/services/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');
    var params = {
        attachments: [],
        text: message,
        username: "Code Review Assignment",
        channel: "nothing-lol"
    };
    slack.send(params, noop);
    res.status(200).end();
    
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})