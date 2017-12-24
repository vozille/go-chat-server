package main

import (
	"fmt"
)

var testchannel = make(chan int)

func main() {
	fmt.Println("foo bar")
	for i := 0; i < 10; i = i + 1 {
		go sendToChannel(i)
		receiveFromChannel()
	}
}

func sendToChannel(num int) {

	if num > 5 {
		close(testchannel)
	} else {
		testchannel <- num
	}
}

func receiveFromChannel() {
	y := <-testchannel
	fmt.Println(y)
}
