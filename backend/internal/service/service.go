package service

import (
	"0SU2/biblioteca/internal/database"
	"0SU2/biblioteca/internal/models"
	"database/sql"
)

func AllUsers(db *sql.DB) (*[]*models.Usuario, error) {
	query, err := db.Query("SELECT * FROM usuario;")
	if err != nil {
		return nil, err
	}

	resultDb, err := database.GetAllUsers(query)
	if err != nil {
		return nil, err
	}

	return resultDb, nil
}
