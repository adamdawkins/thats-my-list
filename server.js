var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser')
var request = require('request')
var app = express();

var jonathan = '55c9e22d65f6abc235d2fee5'
var theList = '5b3f56bbd7b627a11f616bd3'
const db = require('./database');


//db.remove({}, {multi: true})

// Keep Glitch from sleeping by periodically sending ourselves a http request
setInterval(function() {
  console.log('❤️ Keep Alive Heartbeat');
  request.get('https://thats-my-list.glitch.me')
  .then(() => {
    console.log('💗 Successfully sent http request to Glitch to stay awake.');
  })
  .catch((err) => {
    console.error(`💔 Error sending http request to Glitch to stay awake: ${err.message}`);
  });
}, 150000); // every 2.5 minutes

function assignCard({id, idList}) {
  db.find({ listId: idList }, (err, docs) => {
    if (err) {
        console.error(err);
        console.error(`Error trying to find list with id ${idList}`, err.message);
    }
    
    if (docs.length === 0) {
     return console.log(`We're not watching the list with id ${idList}, doing nothing`)
    }
    const { memberIds } = docs[0]
    console.log(`Assigning the card (${id}) to members: ${memberIds}`)
        request({
    method: 'PUT',
        uri: `https://api.trello.com/1/cards/${id}`,
        qs: {
          idMembers: memberIds.join(','),
          key: process.env.APP_KEY,
          token: process.env.TOKEN
        },
        json: true,
        timeout: 120000
    }, (error, res, billoddy) => {
      console.log({billoddy})
    })
  })
//   if (idList !== theList) {
   
//   }
  
//   console.log(`We need to assign the card to ${jonathan}`)

}

// your manifest must have appropriate CORS headers, you could also use '*'
app.use(cors({ origin: '*' }));

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
app.use(bodyParser.json())

app.post('/lists/:listId/members/:memberId', (req, res, next) => {
  const {listId, memberId }  = req.params
  
  db.update({ listId }, {$addToSet: { memberIds: memberId } }, { upsert: true }, function (err, added) {
          if (err) {
            console.error(err);
            console.error(err.message);
            return res.sendStatus(500);
          }
          console.log(`🎉 Added member (${memberId}) to list (${listId})`);
          
          return res.sendStatus(200);
        });
})

app.delete('/lists/:listId/members/:memberId', (req, res, next) => {
  const {listId, memberId}  = req.params

  
  db.update({ listId }, {$pull: { memberIds:  memberId } }, {}, function (err, added) {
          if (err) {
            console.error(err);
            console.error(err.message);
            return res.sendStatus(500);
          }
          console.log(`🎉 Removed member (${memberId}) from list (${listId})`);
          return res.sendStatus(200);
        });
})

app.get('/lists', (req, res, next) => {
    db.find({}, function(err, docs) {
    if (err) return console.error(err.message)
    
      res.send(docs)
    })
    
})

app.post('/board-webhook', (req, res, next) => {
  console.log('Webhook triggered!')
  if(req.body.action.display.translationKey === 'action_move_card_from_list_to_list') {
    assignCard(req.body.action.data.card)
  } else {
    console.log('They did something else', req.body.action.display.translationKey)
  }
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
