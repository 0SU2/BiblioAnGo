package routes

import (
	"0SU2/biblioteca/internal/controller"
	"encoding/json"
	"log"
	"net/http"

	"github.com/go-chi/chi"
	"github.com/go-chi/cors"
)

func DefineRoutes(handler *chi.Mux, dbc *controller.DatabaseController) http.Handler {
	handler.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"https://*", "http://*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	}))
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
	handler.Route("/api", func(r chi.Router) {
		r.Get("/allBooks", dbc.GetBooks)
		r.Get("/allAutors", dbc.GetAllAutors)
		r.Get("/allEditorial", dbc.GetAllEditorial)
		r.Route("/user", func(r chi.Router) {
			// r.Use() // TODO: Crear middleware con jwt
			r.Get("/", func(w http.ResponseWriter, r *http.Request) {
				host := r.RemoteAddr
				routeReq := &r.URL
				w.Header().Set("Content-Type", "application/json")
				w.WriteHeader(http.StatusOK)
				if err := json.NewEncoder(w).Encode(map[string]any{"TODO": "Implementacion para usuarios"}); err != nil {
					log.Fatalf("[ERROR] Check response in server: %s\n", err.Error())
				}
				log.Printf("User %s request %s\n", host, *routeReq)
			})
		})
	})
	return handler
}
