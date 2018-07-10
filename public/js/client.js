/* global TrelloPowerUp, Trello */

var Promise = TrelloPowerUp.Promise;
const token = localStorage.getItem('trello_token')
Trello.setToken(token)

var BLACK_ROCKET_ICON = 'https://cdn.glitch.com/1b42d7fe-bda8-4af8-a6c8-eff0cea9e08a%2Frocket-ship.png?1494946700421';

const assignAllCards = (t, opts, memberId) => {
   
 
   
   if(!token) {
   return t.popup({
     title: 'You need to authorize',
     url: './auth.html'
   })
   }
  
  console.log({ token, authorized: Trello.authorized() })
  
  console.log({memberId, opts})
  console.log({canWrite: t.memberCanWriteToModel('card')})
  return t.list('cards')
    .then((list) => {
      list.cards.forEach(({id}) => (
        Trello.post(
          `cards/${id}/idMembers`,
          { value: memberId },
          (result) => (console.log('it worked!', result) ), 
          (error) => (console.error('the error', error))
        )
      ))
  })
}

window.TrelloPowerUp.initialize({
  'authorization-status': (t, options) => {
   console.log(Trello.authorized())
    return {
      authorized: Trello.authorized()
    }
  },
  'show-authorization': (t, options) => {
    return t.popup({
      title: "Get started with That's My List",
      url: './auth.html',
      height: 140,
    })
  },
	'list-actions': function (t) {
		return t.board('members', 'id')
			.then(function (board) {
        console.log({board})
				return [{
					text: "Assign to...",
					callback: function (t) {
					  t.popup({
							title: 'Assign these cards to...',
							items: board.members.map(({ id, fullName}) => ({
							  text: fullName,
							  callback: function(t, opts) {
                  assignAllCards(t, opts, id);
                  return t.closePopup()
                }
							}))
            })
				  }
        }];
			});
	}
})