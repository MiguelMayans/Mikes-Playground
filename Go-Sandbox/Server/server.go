package main

import (
	"net/http"
	"server/api"
)

func main() {
	srv := api.NewServer()
	http.ListenAndServe(":8082", srv)
}
