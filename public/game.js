/** @format */

export default function createGame() {
	const state = {
		players: {},
		fruits: {},
		screen: {
			width: 10,
			height: 10,
		},
	}

	const observers = []

	function start() {
		const frequency = 2000

		setInterval(addFruit, frequency)
	}

	function subcribe(observersFunction) {
		observers.push(observersFunction)
	}

	function notifyAll(commad) {
		for (const observersFunction of observers) {
			observersFunction(commad)
		}
	}

	function setState(newState) {
		Object.assign(state, newState)
	}

	function addPlayer(command) {
		const playerId = command.playerId
		const playerX =
			"playerX" in command
				? command.playerX
				: Math.floor(Math.random() * state.screen.width)
		const playerY =
			"playerY" in command
				? command.playerY
				: Math.floor(Math.random() * state.screen.height)

		state.players[playerId] = {
			x: playerX,
			y: playerY,
		}

		notifyAll({
			type: "add-player",
			playerId: playerId,
			playerX: playerX,
			playerY: playerY,
		})
	}

	function removePlayer(command) {
		const playerId = command.playerId
		delete state.players[playerId]

		notifyAll({
			type: "remove-player",
			playerId: playerId,
		})
	}

	function addFruit(command) {
		const fruitId = command
			? command.fruitId
			: Math.floor(Math.random() * 10000000)
		const fruitX = command
			? command.fruitX
			: Math.floor(Math.random() * state.screen.width)
		const fruitY = command
			? command.fruitY
			: Math.floor(Math.random() * state.screen.height)

		state.fruits[fruitId] = {
			x: fruitX,
			y: fruitY,
		}

		notifyAll({
			type: "add-fruit",
			fruitId: fruitId,
			fruitX: fruitX,
			fruitY: fruitY,
		})
	}

	function removeFruit(command) {
		const fruitId = command.fruitId
		delete state.fruits[fruitId]

		notifyAll({
			type: "remove-fruit",
			fruitId: fruitId,
		})
	}

	function movePlayer(commad) {
		notifyAll(commad)

		const acceptedMoves = {
			ArrowUp(player) {
				if (player.y - 1 >= 0) {
					player.y = player.y - 1
				}
			},
			ArrowRight(player) {
				if (player.x + 1 < state.screen.width) {
					player.x = player.x + 1
				}
			},
			ArrowDown(player) {
				if (player.y + 1 < state.screen.height) {
					player.y = player.y + 1
				}
			},
			ArrowLeft(player) {
				if (player.x - 1 >= 0) {
					player.x = player.x - 1
				}
			},
		}

		const keyPressed = commad.keyPressed
		const playerId = commad.playerId
		const player = state.players[commad.playerId]
		const moveFunction = acceptedMoves[keyPressed]

		if (player && moveFunction) {
			moveFunction(player)
			ckeckForFruitCollision(playerId)
		}
	}

	function ckeckForFruitCollision(playerId) {
		const player = state.players[playerId]

		for (const fruitId in state.fruits) {
			const fruit = state.fruits[fruitId]

			console.log(`Checking ${playerId} and ${fruitId}`)

			if (player.x === fruit.x && player.y === fruit.y) {
				console.log(`Collision between ${playerId} and ${fruitId}`)
				removeFruit({ fruitId })
			}
		}
	}

	return {
		addPlayer,
		removePlayer,
		state,
		addFruit,
		removeFruit,
		movePlayer,
		setState,
		subcribe,
		start,
	}
}
