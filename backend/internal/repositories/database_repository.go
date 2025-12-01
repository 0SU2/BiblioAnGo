package repositories

import (
	"0SU2/biblioteca/internal/config"
	"0SU2/biblioteca/internal/models"
	"database/sql"

	"github.com/blockloop/scan"
)

type DatabaseRepository interface {
	AllBooks() (*[]models.Libro, error)
	AllBooksWithAutor() (*[]models.LibroWithAutor, error)
	AllUsersLoans() (*[]models.PrestamosWithData, error)
	AllAutors() (*[]models.Autor, error)
	AllEditorial() (*[]models.Editorial, error)
	AllUsers() (*[]models.Editorial, error)
	AllClubs() (*[]models.Clubs, error)
}

type dbRepository struct{ dbRepo *sql.DB }

func NewRepository(conf *config.AppStruct) DatabaseRepository {
	return &dbRepository{dbRepo: conf.DB}
}

func (r *dbRepository) AllBooks() (*[]models.Libro, error) {
	query, err := r.dbRepo.Query("SELECT * FROM libros;")
	// select * from libros INNER JOIN autores ON libros.autor_id = autores.ID_AUTOR INNER JOIN editoriales ON libros.editoria_id = editoriales.ID_EDITORIA;
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

func (r *dbRepository) AllUsers() (*[]models.Editorial, error) {
	query, err := r.dbRepo.Query("SELECT * FROM usuarios WHERE rol = 'usuario';")
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

func (r *dbRepository) AllClubs() (*[]models.Clubs, error) {
	query, err := r.dbRepo.Query("SELECT * FROM club;")
	if err != nil {
		return nil, err
	}

	var autorQuery []models.Clubs

	err = scan.Rows(&autorQuery, query)
	if err != nil {
		return nil, err
	}
	return &autorQuery, nil
}

func (r *dbRepository) AllBooksWithAutor() (*[]models.LibroWithAutor, error) {
	query, err := r.dbRepo.Query("SELECT * FROM libros INNER JOIN autores ON libros.autor_id = autores.ID_AUTOR;")
	if err != nil {
		return nil, err
	}

	var autorQuery []models.LibroWithAutor

	err = scan.Rows(&autorQuery, query)
	if err != nil {
		return nil, err
	}
	return &autorQuery, nil
}

func (r *dbRepository) AllUsersLoans() (*[]models.PrestamosWithData, error) {
	query, err := r.dbRepo.Query("select ID_PRESTAMOS, prestamos.fecha_de_creacion, fecha_de_entrega, estatus, usuarios.correo, usuarios.nombre, usuarios.correo, usuarios.apaterno, usuarios.amaterno, usuarios.telefono, usuarios.avatar, libros.ISBN, libros.titulo,libros.imagen from prestamos INNER JOIN usuarios ON prestamos.pd_nua = usuarios.NUA INNER JOIN libros ON prestamos.pd_libro = libros.ISBN;")
	if err != nil {
		return nil, err
	}

	var autorQuery []models.PrestamosWithData

	err = scan.Rows(&autorQuery, query)
	if err != nil {
		return nil, err
	}
	return &autorQuery, nil

}
