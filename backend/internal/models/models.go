package models

type Usuario struct {
	NUA               string `json:"nua"`
	Nombre            string `json:"nombre"`
	Apaterno          string `json:"apaterno"`
	Amaterno          string `json:"amaterno"`
	Correo            string `json:"correo"`
	Direccion         string `json:"direccion"`
	Ciudad            string `json:"ciudad"`
	Estado            string `json:"estado"`
	Pais              string `json:"pais"`
	Telefono          string `json:"telefono"`
	Fecha_de_creacion string `json:"fecha_de_creacion"`
	Usuario           string `json:"usuario"`
	Contraseña        string `json:"contraseña,omitempty"`
	Rol               string `json:"rol"`
	Avatar            string `json:"avatar"`
	Biografia         any    `json:"biografia"`
	Facebook_link     any    `json:"facebook_link"`
	Instagram_link    any    `json:"instagram_link"`
	Twitter_link      any    `json:"twitter_link"`
}

type TemplateUsuarioSQL struct {
	Nombre         string `col:"nombre"`
	Apaterno       string `col:"apaterno"`
	Amaterno       string `col:"amaterno"`
	Correo         string `col:"correo"`
	Direccion      string `col:"direccion"`
	Ciudad         string `col:"ciudad"`
	Estado         string `col:"estado"`
	Pais           string `col:"pais"`
	Telefono       string `col:"telefono"`
	Usuario        string `col:"usuario"`
	Avatar         string `col:"avatar"`
	Biografia      string `col:"biografia"`
	Contraseña     string `col:"contraseña"`
	Facebook_link  string `col:"facebook_link"`
	Instagram_link string `col:"instagram_link"`
	Twitter_link   string `col:"twitter_link"`
}

type Coleccion struct {
	Id_col            string `json:"id_col"`
	Fecha_de_creacion string `json:"fecha_de_creacion"`
	Col_nua           string `json:"col_nua"`
	Col_isbn          string `json:"col_isbn"`
}

type Libro struct {
	ISBN                 string `json:"isbn"`
	Titulo               string `json:"titulo"`
	Fecha_de_publicacion string `json:"fecha_de_publicacion"`
	Cantidad             int    `json:"cantidad"`
	No_edicion           string `json:"no_edicion"`
	No_paginas           string `json:"no_paginas"`
	Prologo              string `json:"prologo"`
	Imagen               string `json:"imagen"`
	Categoria            string `json:"categoria"`
	Calificacion         int    `json:"calificacion"`
	Tag                  string `json:"tag"`
	Tipo_de_documento    string `json:"tipo_de_documento"`
	Lenguaje             string `json:"lenguaje"`
	Autor_id             string `json:"autor_id"`
	Editoria_id          string `json:"editoria_id"`
}

type LibroWithAutor struct {
	ISBN                 string `json:"isbn"`
	Titulo               string `json:"titulo"`
	Fecha_de_publicacion string `json:"fecha_de_publicacion"`
	Cantidad             int    `json:"cantidad"`
	No_edicion           string `json:"no_edicion"`
	No_paginas           string `json:"no_paginas"`
	Prologo              string `json:"prologo"`
	Imagen               string `json:"imagen"`
	Categoria            string `json:"categoria"`
	Calificacion         int    `json:"calificacion"`
	Tag                  string `json:"tag"`
	Tipo_de_documento    string `json:"tipo_de_documento"`
	Lenguaje             string `json:"lenguaje"`
	Autor_id             string `json:"autor_id"`
	Editoria_id          string `json:"editoria_id"`
	Nombre               string `json:"nombre_autor"`
	Apaterno             string `json:"apaterno_autor"`
	Amaterno             any    `json:"amaterno_autor"`
}

type Autor struct {
	ID_AUTOR            string `json:"id_autor"`
	Nombre              string `json:"nombre"`
	Apaterno            string `json:"apaterno"`
	Amaterno            any    `json:"amaterno"`
	Ciudad              string `json:"ciudad"`
	Pais                string `json:"pais"`
	Fecha_de_nacimiento string `json:"fecha_de_nacimiento"`
}

type Editorial struct {
	ID_EDITORIA        string `json:"id_editoria"`
	Nombre             string `json:"Nombre"`
	Direccion          string `json:"direccion"`
	Ciudad             string `json:"ciudad"`
	Pais               string `json:"pais"`
	Fecha_de_fundacion string `json:"fecha_de_fundacion"`
}

type Clubs struct {
	ID_CLUB      string `json:"id_club"`
	Titulo       string `json:"titulo"`
	Descripcion  string `json:"descripcion"`
	Imagen       string `json:"imagen"`
	Miembros     int    `json:"miembros"`
	Tipo         string `json:"tipo"`
	Categoria    string `json:"categoria"`
	Calificacion int    `json:"calificacion"`
	Tag          string `json:"tag"`
}

type Prestamos struct {
	ID_PRESTAMO       string `json:"id_prestamo"`
	Fecha_de_creacion string `json:"fecha_de_creacion"`
	Fecha_de_entrega  string `json:"fecha_de_entrega"`
	Estatus           string `json:"estatus"`
	Pd_nua            string `json:"pd_nua"`
	Pd_libro          string `json:"pd_libro"`
}

type PrestamosWithData struct {
	ID_PRESTAMO       string `json:"id"`
	Titulo            string `json:"titulo,omitempty"`
	ISBN              string `json:"isbn,omitempty"`
	Imagen            string `json:"imagen,omitempty"`
	Fecha_de_creacion string `json:"fecha_de_creacion"`
	Fecha_de_entrega  any    `json:"fecha_de_entrega"`
	Estatus           string `json:"estatus"`
	Nombre            string `json:"usuario_nombre"`
	Apaterno          string `json:"usuario_apaterno"`
	Correo            string `json:"usuario_correo,omitempty"`
	Avatar            string `json:"usuario_avatar"`
}
