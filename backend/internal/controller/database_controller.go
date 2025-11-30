package controller

import (
	"0SU2/biblioteca/internal/service"
	"0SU2/biblioteca/internal/utils"
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
	utils.RespondJSON(w, r, http.StatusOK, map[string]any{"status": true, "data": response})
}

func (c *DatabaseController) GetAllAutors(w http.ResponseWriter, r *http.Request) {
	response, err := c.dbc.AllAutors()
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	utils.RespondJSON(w, r, http.StatusOK, map[string]any{"status": true, "data": response})
}

func (c *DatabaseController) GetAllEditorial(w http.ResponseWriter, r *http.Request) {
	response, err := c.dbc.AllEditorial()
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	utils.RespondJSON(w, r, http.StatusOK, map[string]any{"status": true, "data": response})
}

func (c *DatabaseController) GetAllUsersDB(w http.ResponseWriter, r *http.Request) {
	response, err := c.dbc.AllUsersDB()
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	utils.RespondJSON(w, r, http.StatusOK, map[string]any{"status": true, "data": response})
}
