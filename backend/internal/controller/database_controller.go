package controller

import (
	"0SU2/biblioteca/internal/service"
	"encoding/json"
	"log"
	"net/http"
)

type DatabaseController struct{ dbc service.DatabaseService }

func NewDatabaseController(s service.DatabaseService) *DatabaseController {
	return &DatabaseController{dbc: s}
}

func (c *DatabaseController) GetBooks(w http.ResponseWriter, r *http.Request) {
	response, err := c.dbc.AllBooks()
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	respondJSON(w, r, http.StatusOK, map[string]any{"status": true, "data": response})
}

func (c *DatabaseController) GetAllAutors(w http.ResponseWriter, r *http.Request) {
	response, err := c.dbc.AllAutors()
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	respondJSON(w, r, http.StatusOK, map[string]any{"status": true, "data": response})
}

func (c *DatabaseController) GetAllEditorial(w http.ResponseWriter, r *http.Request) {
	response, err := c.dbc.AllEditorial()
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	respondJSON(w, r, http.StatusOK, map[string]any{"status": true, "data": response})
}

func respondJSON(w http.ResponseWriter, r *http.Request, code int, payload any) {
	host := r.RemoteAddr
	routeReq := &r.URL
	log.Printf("User %s request %s\n", host, *routeReq)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	if err := json.NewEncoder(w).Encode(payload); err != nil {
		log.Fatalf("[ERROR] Check response in server: %s\n", err.Error())
	}
}
