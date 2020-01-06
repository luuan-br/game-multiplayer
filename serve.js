/** @format */

import express from "express"
import http from "http"
import createGame from "./public/game"
import socketio from "socket.io"

const app = express()
const server = http.createServer(app)
const sockets = socketio(server)

app.use(express.static("public"))

const game = createGame()
game.start()

game.subcribe(command => {
	sockets.emit(command.type, command)
})

sockets.on("connection", socket => {
	const playerId = socket.id
	console.log(`> Player connected on Server with id: ${playerId}`)

	game.addPlayer({ playerId: playerId })

	socket.emit("setup", game.state)

	socket.on("disconnect", () => {
		game.removePlayer({ playerId: playerId })
		console.log(`> Player disconnected: ${playerId}`)
	})

	socket.on("move-player", command => {
		command.playerId = playerId
		command.type = "move-player"

		game.movePlayer(command)
	})
})

server.listen(3000, () => {
	console.log(`> server listening on port: 3000`)
})
