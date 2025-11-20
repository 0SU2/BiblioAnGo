package models

type Usuario struct {
	nua         string
	nombre      string
	apaterno    string
	amaterno    string
	ciudad      string
	pais        string
	creadoEn    string
	usuario     string
	contraseña  string
	colecciones string
}

type Coleccion struct {
	nua      string
	isbn     string
	creadoEn string
}

type Libro struct {
	isbn             string
	titulo           string
	fechaPublicacion string
	editorial        string
	disponiblidad    string
	noEdicion        string
	noPaginas        string
	Prologo          string
}

type Autor struct {
	idAutor    string
	nombre     string
	apaterno   string
	amaterno   string
	ciudad     string
	pais       string
	fechaDeCum string
}

type Editorial struct {
	idEditora string
	nombre    string
	direccion string
	ciudad    string
	pais      string
	fundadoEn string
}
