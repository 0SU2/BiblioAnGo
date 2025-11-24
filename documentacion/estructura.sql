CREATE DATABASE IF NOT EXISTS BiblioAnGo;
USE BiblioAnGo;

CREATE TABLE usuarios (
    NUA INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY ,
    nombre VARCHAR(100) NOT NULL,
    apaterno VARCHAR(100) NOT NULL,
    amaterno VARCHAR(100),
    correo VARCHAR(255),
    direccion VARCHAR(255),
    ciudad VARCHAR(100),
    estado VARCHAR(100),
    pais VARCHAR(100),
    telefono VARCHAR(15),
    fecha_de_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    contraseña VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'user') DEFAULT 'user'
);

CREATE TABLE autores (
    ID_AUTOR INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apaterno VARCHAR(100) NOT NULL,
    amaterno VARCHAR(100),
    ciudad VARCHAR(100),
    pais VARCHAR(100),
    fecha_de_nacimiento DATE NOT NULL
);

CREATE TABLE editoriales (
    ID_EDITORIA INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    direccion VARCHAR(100),
    ciudad VARCHAR(100),
    pais VARCHAR(100),
    fecha_de_fundacion DATE NOT NULL
);

CREATE TABLE libros (
    ISBN VARCHAR(100) NOT NULL PRIMARY KEY UNIQUE,
    titulo VARCHAR(100) NOT NULL,
    fecha_de_publicacion DATE DEFAULT CURRENT_TIMESTAMP,
    cantidad INT,
    no_edicion VARCHAR(20),
    no_paginas VARCHAR(100),
    prologo TEXT(1000),
    autor_id INT UNSIGNED NOT NULL,
    editoria_id INT UNSIGNED NOT NULL,
    CONSTRAINT `fk_libro_editoria`
        FOREIGN KEY (editoria_id) REFERENCES editoriales(ID_EDITORIA),
    CONSTRAINT `fk_libro_autor` 
        FOREIGN KEY (autor_id) REFERENCES autores (ID_AUTOR)
);

CREATE TABLE colecciones (
    ID_COL INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    fecha_de_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    col_nua INT UNSIGNED NOT NULL,
    col_isbn VARCHAR(100) NOT NULL UNIQUE,
    CONSTRAINT `fk_col_nua`
        FOREIGN KEY (col_nua) REFERENCES usuarios(NUA),
    CONSTRAINT `fk_col_isbn`
        FOREIGN KEY (col_isbn) REFERENCES libros(ISBN)
);

CREATE TABLE pedidos (
    ID_PEDIDO INT UNSIGNED NOT NULL PRIMARY KEY,
    fecha_de_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_de_entrega TIMESTAMP,
    estatus ENUM('activo', 'finalizado') DEFAULT 'activo',
    pd_nua INT UNSIGNED NOT NULL,
    pd_libro VARCHAR(100) NOT NULL UNIQUE,
    CONSTRAINT `fk_pedidos_nua`
        FOREIGN KEY (pd_nua) REFERENCES usuarios(NUA),
    CONSTRAINT `fk_pedidos_libro`
        FOREIGN KEY (pd_libro) REFERENCES libros(ISBN)
);

INSERT INTO usuarios(
    nombre,apaterno,amaterno,correo,direccion,ciudad,estado,pais,telefono,usuario, contraseña, rol
) VALUES (
    'Oscar', 'Rosas', 'Zavala', 'or@ugto.mx', 'Villas', 'Irapuato', 'Guanajuato', 'Mexico', '123456789', 'ren01', 
    '123456789',  -- TODO: La contraseña es un ejemplo, pero esta va a ser encriptada en el siguiente ticket
    'admin'
);

INSERT INTO autores 
    ( nombre,apaterno,amaterno,ciudad,pais,fecha_de_nacimiento) 
VALUES 
    ('Gabriel' , 'García' , 'Márquez' , 'Aracataca' , 'Colombia' , '1927-03-06 00:00:00'),
    ('Miguel' , 'de' , 'Cervantes' , 'Alcalá de Henares' , 'España' , '1547-09-29 00:00:00'),
    ('Jane' , 'Austen' , NULL , 'Steventon' , 'Reino Unido' , '1775-12-16 00:00:00'),
    ('Lev' , 'Tolstoy' , NULL , 'Yásnaia Poliana' , 'Rusia' , '1828-09-09 00:00:00'),
    ('Virginia' , 'Woolf' , NULL , 'Londres' , 'Reino Unido' , '1882-01-25 00:00:00'),
    ('Samuel' , 'Clemens' , NULL , 'Florida, Missouri' , 'Estados Unidos' , '1835-11-30 00:00:00'),
    ('Haruki' , 'Murakami' , NULL , 'Kyoto' , 'Japón' , '1949-01-12 00:00:00'),
    ('Isabel' , 'Allende' , NULL , 'Lima' , 'Chile' , '1942-08-02 00:00:00'),
    ('Fyodor' , 'Dostoevsky' , NULL , 'Moscow Governorate' , 'Rusia' , '1821-11-11 00:00:00'),
    ('Joanne' , 'Rowling' , 'Murray' , 'Yate' , 'Reino Unido' , '1965-07-31 00:00:00');

INSERT INTO editoriales
    ( nombre,ciudad,direccion,pais,fecha_de_fundacion ) 
VALUES 
    ('Penguin Random House' , 'Nueva York' , '1745 Broadway' , 'Estados Unidos' , '2013-07-01 00:00:00'),
    ('HarperCollins' , 'Nueva York' , '195 Broadway' , 'Estados Unidos' , '1989-01-01 00:00:00'),
    ('Hachette Livre' , 'París' , '43 Quai de Grenelle' , 'Francia' , '1826-01-01 00:00:00'),
    ('Macmillan Publishers' , 'Londres' , '120 Broadway' , 'Reino Unido' , '1843-01-01 00:00:00'),
    ('Simon & Schuster' , 'Nueva York' , '1230 Avenue of the Americas' , 'Estados Unidos' , '1924-01-01 00:00:00'),
    ('Scholastic' , 'Nueva York' , '557 Broadway' , 'Estados Unidos' , '1920-01-01 00:00:00'),
    ('Grupo Planeta' , 'Barcelona' , 'Avenida Diagonal 662-664' , 'España' , '1949-01-01 00:00:00'),
    ('Bloomsbury Publishing' , 'Londres' , '50 Bedford Square' , 'Reino Unido' , '1986-01-01 00:00:00'),
    ('Editorial Sudamericana' , 'Buenos Aires' , 'Avenida Corrientes 1' , 'Argentina' , '1939-01-01 00:00:00'),
    ('Faber & Faber' , 'Londres' , '24 Russell Square' , 'Reino Unido' , '1929-01-01 00:00:00');

INSERT INTO libros
    (ISBN,titulo,fecha_de_publicacion,cantidad,no_edicion,no_paginas,prologo,autor_id,editoria_id ) 
VALUES 
    ('001A', 'Cien años de soledad', '1967-06-05 00:00:00', 10, '1', '417', 'Una saga familiar que muestra el realismo mágico en el pueblo ficticio de Macondo.', 1, 2),
    ('002A', 'Don Quijote de la Mancha', '1605-01-16 00:00:00', 2, '1', '863', 'La historia de un hidalgo que busca revivir la caballería, enfrentándose a la locura y la realidad.', 2, 2),
    ('001B', 'Moby Dick', '1851-10-18 00:00:00', 3, '1', '635', 'La obsesión del capitán Ahab por cazar a la gran ballena blanca.', 3, 4),
    ('002B', '1984', '1949-06-08 00:00:00', 4, '1', '328', 'Una distopía que explora el totalitarismo y la vigilancia estatal.', 4, 3),
    ('003B', 'Orgullo y prejuicio', '1813-01-28 00:00:00', 4, '1', '432', 'Un análisis de las relaciones y el matrimonio en la Inglaterra del siglo XIX.', 5, 4),
    ('003A', 'El gran Gatsby', '1925-04-10 00:00:00', 10, '1', '180', 'La historia de Jay Gatsby y su amor por Daisy Buchanan, en el contexto del sueño americano.', 6, 9),
    ('004A', 'Crimen y castigo', '1866-01-01 00:00:00', 4, '1', '430', 'Un joven estudiante comete un asesinato y lidia con su culpa.', 7, 3),
    ('005A', 'Los hermanos Karamazov', '1880-01-01 00:00:00', 3, '1', '796', 'Explora dilemas morales y filosóficos a través de la historia de una familia rusa.', 8, 9),
    ('006A', 'El proceso', '1925-08-10 00:00:00', 19, '1', '255', 'Un hombre es arrestado por un crimen que no entiende, reflejando la absurdidad del sistema judicial.', 9, 10),
    ('007A', 'Ulises', '1922-02-02 00:00:00', 10, '1', '730', 'Un reimaginación moderna de la Odisea, ambientada en Dublín durante un solo día.', 10, 1);
