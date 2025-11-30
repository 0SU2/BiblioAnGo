package controller

import (
	"0SU2/biblioteca/internal/models"
	"0SU2/biblioteca/internal/service"
	"0SU2/biblioteca/internal/utils"
	"encoding/json"
	"errors"
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

	utils.RespondJSON(w, r, http.StatusOK, map[string]any{"status": true, "token": token, "user": user})
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

	utils.RespondJSON(w, r, http.StatusOK, map[string]any{"status": true, "token": token, "data": result})
}
