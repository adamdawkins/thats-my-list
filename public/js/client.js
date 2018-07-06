/* global TrelloPowerUp */

var Promise = TrelloPowerUp.Promise;

var BLACK_ROCKET_ICON = 'https://cdn.glitch.com/1b42d7fe-bda8-4af8-a6c8-eff0cea9e08a%2Frocket-ship.png?1494946700421';

window.TrelloPowerUp.initialize({
	'list-actions': function (t) {
		return t.list('name', 'id')
			.then(function (list) {
        console.log('list', {list})
				return [{
					text: "Assign to...",
					callback: function (t) {
						// Trello will call this if the user clicks on this action
						// we could for example open a new popover...
						t.popup({
							title: 'Assign users',
							items: [{
								text: 'User 1',
								callback: function (t, opts) { alert('User 1') }
							}, {
								text: 'User 2',
								callback: function (t, opts) { alert('User 2') }
							}, {
								text: 'User 3',
								callback: function (t, opts) { alert('User 3') }
							}]
						});
					}
				}];
			});
	}
});
