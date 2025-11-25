package database

import (
	"0SU2/biblioteca/internal/models"
	"database/sql"

	"github.com/blockloop/scan"
)

func GetBooks(query *sql.Rows) (*[]models.Libro, error) {
	var bookQuery []models.Libro
	err := scan.Rows(&bookQuery, query)
	if err != nil {
		return nil, err
	}
	return &bookQuery, nil
}
