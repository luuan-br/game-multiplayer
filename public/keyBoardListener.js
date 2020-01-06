/** @format */

export default function createKeyBoardListener(document) {
	const state = {
		observers: [],
		playerId: null,
	}

	function regristerPlayerId(playerId) {
		state.playerId = playerId
	}

	function subcribe(observersFunction) {
		state.observers.push(observersFunction)
	}

	function notifyAll(commad) {
		for (const observersFunction of state.observers) {
			observersFunction(commad)
		}
	}

	document.addEventListener("keydown", handleKeydown)

	function handleKeydown(evet) {
		const keyPressed = evet.key

		const commad = {
			type: "move-player",
			playerId: state.playerId,
			keyPressed,
		}

		notifyAll(commad)
	}

	return {
		subcribe,
		regristerPlayerId,
	}
}
