package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

// Configure the upgrader
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

// Define our message object
type Message struct {
	Email        string `json:"email"`
	Username     string `json:"username"`
	Message      string `json:"message"`
	ProfileImage string `json:"profileImage"`
}

var broadcast = make(chan Message)           // broadcast channel
var clients = make(map[*websocket.Conn]bool) // connected clients

func main() {
	// Create a simple file server
	fs := http.FileServer(http.Dir("../public"))
	http.Handle("/", fs)

	// Configure websocket route
	http.HandleFunc("/websockets", handleConnections)

	// Start listening for incoming chat messages
	go handleMessages()

	// Start the server on localhost port 3000 and log any errors
	log.Println("http server started on :3000")
	err := http.ListenAndServe(":3000", nil)
	fmt.Println(err)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}

func handleConnections(w http.ResponseWriter, r *http.Request) {
	// Upgrade initial GET request to a websocket
	websockets, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Fatal(err)
	}
	// Make sure we close the connection when the function returns
	defer websockets.Close()

	// Register our new client
	clients[websockets] = true

	for {
		var msg Message
		// Read in a new message as JSON and map it to a Message object
		err := websockets.ReadJSON(&msg)
		if err != nil {
			log.Printf("error: %v", err)
			delete(clients, websockets)
			break
		}
		// Send the newly received message to the broadcast channel
		broadcast <- msg
	}
}

func storeMessageToDatabase() {
	var msg Message
	msg.Email = "goo@foo"
}

func handleMessages() {
	for {
		// Grab the next message from the broadcast channel
		msg := <-broadcast
		// Send it out to every client that is currently connected
		for client := range clients {
			err := client.WriteJSON(msg)
			if err != nil {
				log.Printf("error: %v", err)
				client.Close()
				delete(clients, client)
			}
		}
	}
}
