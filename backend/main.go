package main

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/go-chi/chi"
	"github.com/go-chi/cors"
)

const PORT = "8080"

func main() {
	r := chi.NewRouter()

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"https://*", "http://*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	}))

	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		host := r.RemoteAddr
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		if err := json.NewEncoder(w).Encode(map[string]any{"success": true}); err != nil {
			log.Fatalf("[ERROR] Check response in server: %s\n", err)
		}
		log.Printf("User %s request \\\n", host)
	})

	log.Printf("[SUCCESS] Listeting in port %s\n", PORT)
	if err := http.ListenAndServe(":"+PORT, r); err != nil {
		log.Fatalf("[ERROR] Something happend with the server: %s\n", err)
	}
}
