package service

import (
	"0SU2/biblioteca/internal/models"
	"0SU2/biblioteca/internal/repositories"
	"0SU2/biblioteca/internal/utils"
	"errors"

	"golang.org/x/crypto/bcrypt"
)

type UserService interface {
	Login(username string, password string) (string, *models.Usuario, error)
	Register(usuario *models.TemplateUsuarioSQL) (string, *models.Usuario, error)
}

type userService struct{ repo repositories.UserRepository }

func NewUserService(r repositories.UserRepository) UserService { return &userService{repo: r} }

func (s *userService) Login(username string, password string) (string, *models.Usuario, error) {
	result, err := s.repo.GetByUsername(username)
	if err != nil {
		return "", nil, errors.New("usuario no encontrado")
	}

	if bcrypt.CompareHashAndPassword([]byte(result.Contraseña), []byte(password)) != nil {
		return "", nil, errors.New("contraseña incorrecta")
	}

	token, err := utils.GenerateToken(result.NUA, result.Usuario)
	if err != nil {
		return "", nil, err
	}
	result.Contraseña = ""
	return token, result, nil
}

func (s *userService) Register(usuario *models.TemplateUsuarioSQL) (string, *models.Usuario, error) {
	_, err := s.repo.GetByUsername(usuario.Usuario)
	if err == nil {
		return "", nil, errors.New("usuario existente")
	}
	usuario.Contraseña, _ = utils.HashPassword(usuario.Contraseña)

	result, err := s.repo.Register(usuario)
	if err != nil {
		return "", nil, err
	}

	token, err := utils.GenerateToken(result.NUA, result.Usuario)
	if err != nil {
		return "", nil, err
	}

	return token, result, nil
}
