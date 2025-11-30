package controller

import (
	"0SU2/biblioteca/internal/models"
	"0SU2/biblioteca/internal/service"
	"encoding/json"
	"errors"
	"log"
	"net/http"
)

type UserController struct{ usc service.UserService }

func NewUserController(s service.UserService) *UserController {
	return &UserController{usc: s}
}

func (userController *UserController) UserLogin(w http.ResponseWriter, r *http.Request) {
	var body struct{ Usuario, Password string }
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	token, user, err := userController.usc.Login(body.Usuario, body.Password)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	host := r.RemoteAddr
	routeReq := &r.URL
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(map[string]any{"status": true, "token": token, "user": user}); err != nil {
		log.Fatalf("[ERROR] Check response in server: %s\n", err.Error())
	}
	log.Printf("User %s request %s\n", host, *routeReq)

}

func (userController *UserController) UserRegister(w http.ResponseWriter, r *http.Request) {
	var body models.TemplateUsuarioSQL
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if body.Usuario == "" || body.Contraseña == "" {
		err := errors.New("faltante de datos")
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	token, result, err := userController.usc.Register(&body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	host := r.RemoteAddr
	routeReq := &r.URL
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(map[string]any{"status": true, "data": result, "token": token}); err != nil {
		log.Fatalf("[ERROR] Check response in server: %s\n", err.Error())
	}
	log.Printf("User %s request %s\n", host, *routeReq)

}
