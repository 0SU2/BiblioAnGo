package models

type Usuario struct {
	NUA               string
	Nombre            string
	Apaterno          string
	Amaterno          string
	Correo            string
	Direccion         string
	Ciudad            string
	Estado            string
	Pais              string
	Telefono          string
	Fecha_de_creacion string
	Usuario           string
	Contraseña        string
	Rol               string
}

type Coleccion struct {
	Id_col            string
	Fecha_de_creacion string
	Col_nua           string
	Col_isbn          string
}

type Libro struct {
	ISBN                 string
	Titulo               string
	Fecha_de_publicacion string
	Cantidad             int
	No_edicion           string
	No_paginas           string
	Prologo              string
	Autor_id             string
	Editoria_id          string
}

type Autor struct {
	Id_autor            string
	Nombre              string
	Apaterno            string
	Amaterno            string
	Ciudad              string
	Pais                string
	Fecha_de_nacimiento string
}

type Editorial struct {
	Id_editoria        string
	Nombre             string
	Direccion          string
	Ciudad             string
	Pais               string
	Fecha_de_fundacion string
}
