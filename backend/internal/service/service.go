package service

import (
	"0SU2/biblioteca/internal/database"
	"0SU2/biblioteca/internal/models"
	"database/sql"
)

func AllUsers(db *sql.DB) (*[]models.Libro, error) {
	query, err := db.Query("SELECT * FROM libros;")
	if err != nil {
		return nil, err
	}

	resultDb, err := database.GetBooks(query)
	if err != nil {
		return nil, err
	}

	return resultDb, nil
}
