package repositories

import (
	"0SU2/biblioteca/internal/config"
	"0SU2/biblioteca/internal/models"
	"database/sql"

	"github.com/blockloop/scan"
	"github.com/zachvictor/sqlinsert"
)

type UserRepository interface {
	GetByUsername(username string) (*models.Usuario, error)
	Register(datosUsuario *models.TemplateUsuarioSQL) (*models.Usuario, error)
}

type userRepository struct{ dbUser *sql.DB }

func NewUserRepository(conf *config.AppStruct) UserRepository {
	return &userRepository{dbUser: conf.DB}
}

func (r *userRepository) GetByUsername(username string) (*models.Usuario, error) {
	var temp models.Usuario
	query, err := r.dbUser.Prepare("SELECT * FROM usuarios WHERE usuario = ?")
	if err != nil {
		return nil, err
	}

	queryResult, err := query.Query(username)
	if err != nil {
		return nil, err
	}

	err = scan.Row(&temp, queryResult)
	if err != nil {
		return nil, err
	}
	return &temp, nil

}

func (r *userRepository) Register(datosUsuario *models.TemplateUsuarioSQL) (*models.Usuario, error) {
	ins := sqlinsert.Insert{Table: "usuarios", Data: datosUsuario}
	_, err := ins.Insert(r.dbUser)
	if err != nil {
		return nil, err
	}
	temp, err := r.GetByUsername(datosUsuario.Usuario)
	if err != nil {
		return nil, err
	}

	temp.Contraseña = ""

	return temp, nil
}
