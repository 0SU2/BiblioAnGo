package database

import (
	"0SU2/biblioteca/internal/models"
	"database/sql"
)

func GetAllUsers(query *sql.Rows) (*[]*models.Usuario, error) {
	userQuery := []*models.Usuario{}
	for query.Next() {
		userTemp := &models.Usuario{}
		query.Scan(&userTemp.Nua, &userTemp.Nombre)
		userQuery = append(userQuery, userTemp)
	}
	return &userQuery, nil

}
