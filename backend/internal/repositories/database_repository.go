package repositories

import (
	"0SU2/biblioteca/internal/config"
	"0SU2/biblioteca/internal/models"
	"database/sql"

	"github.com/blockloop/scan"
)

type DatabaseRepository interface {
	AllBooks() (*[]models.Libro, error)
	AllAutors() (*[]models.Autor, error)
	AllEditorial() (*[]models.Editorial, error)
}

type dbRepository struct{ dbRepo *sql.DB }

func NewRepository(conf *config.AppConfig) DatabaseRepository {
	return &dbRepository{dbRepo: conf.DB}
}

func (r *dbRepository) AllBooks() (*[]models.Libro, error) {
	query, err := r.dbRepo.Query("SELECT * FROM libros;")
	if err != nil {
		return nil, err
	}

	var bookQuery []models.Libro

	err = scan.Rows(&bookQuery, query)
	if err != nil {
		return nil, err
	}
	return &bookQuery, nil
}

func (r *dbRepository) AllAutors() (*[]models.Autor, error) {
	query, err := r.dbRepo.Query("SELECT * FROM autores;")
	if err != nil {
		return nil, err
	}

	var autorQuery []models.Autor

	err = scan.Rows(&autorQuery, query)
	if err != nil {
		return nil, err
	}
	return &autorQuery, nil
}

func (r *dbRepository) AllEditorial() (*[]models.Editorial, error) {
	query, err := r.dbRepo.Query("SELECT * FROM editoriales;")
	if err != nil {
		return nil, err
	}

	var autorQuery []models.Editorial

	err = scan.Rows(&autorQuery, query)
	if err != nil {
		return nil, err
	}
	return &autorQuery, nil
}
