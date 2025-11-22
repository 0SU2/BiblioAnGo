package routes

import (
	"0SU2/biblioteca/internal/service"
	"database/sql"
	"encoding/json"
	"log"
	"net/http"

	"github.com/go-chi/chi"
)

func DefineRoutes(handler *chi.Mux, biDatabase *sql.DB) {
	handler.Get("/", func(w http.ResponseWriter, r *http.Request) {
		host := r.RemoteAddr
		routeReq := &r.URL
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		if err := json.NewEncoder(w).Encode(map[string]any{"success": true}); err != nil {
			log.Fatalf("[ERROR] Check response in server: %s\n", err.Error())
		}
		log.Printf("User %s request %s\n", host, *routeReq)
	})
	handler.Get("/api", func(w http.ResponseWriter, r *http.Request) {
		host := r.RemoteAddr
		routeReq := &r.URL
		w.Header().Set("Content-Type", "application/json")
		resultDB, err := service.AllUsers(biDatabase)
		if err != nil {
			log.Fatalf("[ERROR] Check response in server: %s\n", err.Error())
		}
		w.WriteHeader(http.StatusOK)
		if err := json.NewEncoder(w).Encode(map[string]any{"success": true, "response": resultDB}); err != nil {
			log.Fatalf("[ERROR] Check response in server: %s\n", err.Error())
		}
		log.Printf("User %s request %s\n", host, *routeReq)
	})
}
