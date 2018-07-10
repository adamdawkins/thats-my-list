var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser')

var app = express();

// your manifest must have appropriate CORS headers, you could also use '*'
app.use(cors({ origin: '*' }));

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
app.use(bodyParser.json())
app.post('/board-webhook', (req, res, next) => {
  console.log('Webhook triggered!')
  console.log(req.body)
  res.status(200).end()
})

// http://expressjs.com/en/starter/basic-routing.html
app.get("*", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
