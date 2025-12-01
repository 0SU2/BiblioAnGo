package service

import (
	"0SU2/biblioteca/internal/models"
	"0SU2/biblioteca/internal/repositories"
)

type DatabaseService interface {
	AllBooks() (*[]models.Libro, error)
	AllBooksWithAutor() (*[]models.LibroWithAutor, error)
	AllAutors() (*[]models.Autor, error)
	AllEditorial() (*[]models.Editorial, error)
	AllUsersDB() (*[]models.Editorial, error)
	AllUsersLoans() (*[]models.PrestamosWithData, error)
	AllClub() (*[]models.Clubs, error)
}

type databaseService struct {
	repo repositories.DatabaseRepository
}

func NewDatabaseService(r repositories.DatabaseRepository) DatabaseService {
	return &databaseService{repo: r}
}

func (s *databaseService) AllBooks() (*[]models.Libro, error) {
	response, err := s.repo.AllBooks()
	if err != nil {
		return nil, err
	}
	return response, nil
}

func (s *databaseService) AllAutors() (*[]models.Autor, error) {
	response, err := s.repo.AllAutors()
	if err != nil {
		return nil, err
	}
	return response, nil
}

func (s *databaseService) AllEditorial() (*[]models.Editorial, error) {
	response, err := s.repo.AllEditorial()
	if err != nil {
		return nil, err
	}
	return response, nil
}

func (s *databaseService) AllUsersDB() (*[]models.Editorial, error) {
	response, err := s.repo.AllUsers()
	if err != nil {
		return nil, err
	}
	return response, nil
}

func (s *databaseService) AllClub() (*[]models.Clubs, error) {
	response, err := s.repo.AllClubs()
	if err != nil {
		return nil, err
	}
	return response, nil
}

func (s *databaseService) AllBooksWithAutor() (*[]models.LibroWithAutor, error) {
	response, err := s.repo.AllBooksWithAutor()
	if err != nil {
		return nil, err
	}
	return response, nil
}

func (s *databaseService) AllUsersLoans() (*[]models.PrestamosWithData, error) {
	response, err := s.repo.AllUsersLoans()
	if err != nil {
		return nil, err
	}
	return response, nil
}
