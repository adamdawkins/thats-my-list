/* global TrelloPowerUp, Trello */

var Promise = TrelloPowerUp.Promise;
	const token = localStorage.getItem('trello_token')
Trello.setToken(token)
	var POWER_UP_ROOT = 'https://thats-my-list.glitch.me'
	var BLACK_ROCKET_ICON = 'https://cdn.glitch.com/1b42d7fe-bda8-4af8-a6c8-eff0cea9e08a%2Frocket-ship.png?1494946700421';

	const toggleMemberOnList = (t, listId, memberId) => {
	t.get('board', 'shared', listId, null)
		.then((listData) => {
				const apiURL = `${POWER_UP_ROOT}/lists/${listId}/members/${memberId}`
				if (listData && listData.memberIds.indexOf(memberId) > -1) {
					$.ajax({
						url: apiURL,
						type: 'DELETE',
						success: () => {
						const memberIds = listData ? listData.memberIds : []
						return t.set('board', 'shared', listId, { memberIds: memberIds.filter(id => id !== memberId) })
						}
					})
				} else {
					// add member
					$.post(`${POWER_UP_ROOT}/lists/${listId}/members/${memberId}`, () => {
						console.log('callback')
						const memberIds = listData ? listData.memberIds : []
						memberIds.push(memberId)
						return t.set('board', 'shared', listId, { memberIds })
					})
				}
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
		const { list } = t.getContext()
		return t.board('members', 'id')
			.then(function (board) {
				console.log(board.id) 
				return t.get('board', 'shared', list)
					.then((listData) => {
						console.log({listData})
						return [{
							text: "Assign to...",
							callback: function (t) {
                 t.popup({
                    title: "Get started with That's My List",
                    url: './members.html',
                    height: 380,
                  })
							}
						}];
					})
			});
	}
})
