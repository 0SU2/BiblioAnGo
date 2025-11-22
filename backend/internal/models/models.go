package models

type Usuario struct {
	Nua         string
	Nombre      string
	Apaterno    string
	Amaterno    string
	Ciudad      string
	Pais        string
	CreadoEn    string
	Usuario     string
	Contraseña  string
	Colecciones string
}

type Coleccion struct {
	Nua      string
	Isbn     string
	CreadoEn string
}

type Libro struct {
	Isbn             string
	Titulo           string
	FechaPublicacion string
	Editorial        string
	Disponiblidad    string
	NoEdicion        string
	NoPaginas        string
	Prologo          string
}

type Autor struct {
	IdAutor    string
	Nombre     string
	Apaterno   string
	Amaterno   string
	Ciudad     string
	Pais       string
	FechaDeCum string
}

type Editorial struct {
	IdEditora string
	Nombre    string
	Direccion string
	Ciudad    string
	Pais      string
	FundadoEn string
}
