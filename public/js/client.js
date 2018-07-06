/* global TrelloPowerUp */

var Promise = TrelloPowerUp.Promise;

var BLACK_ROCKET_ICON = 'https://cdn.glitch.com/1b42d7fe-bda8-4af8-a6c8-eff0cea9e08a%2Frocket-ship.png?1494946700421';

window.TrelloPowerUp.initialize({
	'list-actions': function (t) {
    console.log({members: t.board('members')})
		return t.board('members')
			.then(function (board) {
        console.log(JSON.stringify(board, null, 2))
				return [{
					text: "Assign to...",
					callback: function (t) {
					  t.popup({
							title: 'Assign these cards to...',
							items: board.members.map(({ id, fullName}) => ({
							  text: fullName,
							  callback: function(t, opts) { alert(`member ${id} selected`); return t.closePopup() }
							}))
            })
				  }
        }];
			});
	}
});
