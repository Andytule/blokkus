export function createLeaderboard(players) {
	let medals = ['', '&#x1f949;', '&#129352;', '&#x1f947;']
	let leaderboard = ``
	for (const player of rankPlayers(players)) {
		leaderboard += `<p class="text-black w-100 overflow-hidden">
							${player.score} ${medals.pop()} - ${player.name}
						</p>`
	}

	return `
	<div id="leaderboard" class="floating fixed-top v-flex w-100 h-100">
		<div class="container-white v-flex">
			<p class="font-large text-black">Final Scores</p>
			<div class="v-flex w-100 align-left">
				${leaderboard}
			</div>
			<button class="btn" onclick="$('#leaderboard').remove()">[X] Close</button>
		</div>
	</div>
	`
}

function rankPlayers(players) {
	// Insertion sort
	for (let i = 1; i < players.length; i++) {
		let j = i - 1
		let temp = players[i]
			while (j >= 0 && players[j].score < temp.score) {
				players[j + 1] = players[j]
				j--
			}
		players[j+1] = temp
	}
	return players
}