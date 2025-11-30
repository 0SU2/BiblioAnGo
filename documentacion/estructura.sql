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
    rol ENUM('administrador', 'usuario') DEFAULT 'usuario',
    avatar TEXT(100) NOT NULL DEFAULT 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ficons.veryicon.com%2Fpng%2Fo%2Fmiscellaneous%2Fcommon-area-icons%2Fdefault-avatar-1.png&f=1&nofb=1&ipt=71e11e38dce31818f33eebb78301e2fbf8fd80f122a849d256f4c0e6715125fa',
    biografia TEXT(100),
    seguidores INT NOT NULL DEFAULT 0,
    siguiendo INT NOT NULL DEFAULT 0,
    facebook_link TEXT(100),
    instagram_link TEXT(100),
    twitter_link TEXT(100)
);

CREATE TABLE autores (
    ID_AUTOR INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apaterno VARCHAR(100) NOT NULL,
    amaterno VARCHAR(100),
    ciudad VARCHAR(100),
    pais VARCHAR(100),
    fecha_de_nacimiento DATE NOT NULL,
    avatar TEXT(100) NOT NULL DEFAULT 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ficons.veryicon.com%2Fpng%2Fo%2Fmiscellaneous%2Fcommon-area-icons%2Fdefault-avatar-1.png&f=1&nofb=1&ipt=71e11e38dce31818f33eebb78301e2fbf8fd80f122a849d256f4c0e6715125fa',
    seguidores int NOT NULL DEFAULT 0
);

CREATE TABLE editoriales (
    ID_EDITORIA INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    direccion VARCHAR(100),
    ciudad VARCHAR(100),
    pais VARCHAR(100),
    fecha_de_fundacion DATE NOT NULL
);

CREATE TABLE club (
    ID_CLUB INT NOT NULL PRIMARY KEY UNIQUE,
    titulo VARCHAR(100) NOT NULL,
    descripcion VARCHAR(100) NOT NULL,
    imagen TEXT(100) DEFAULT 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn0.iconfinder.com%2Fdata%2Ficons%2Fpicture-editing-1%2F2048%2FBroken_Image-512.png&f=1&nofb=1&ipt=d00acee6bb37e3910d23b3eff2a7e1e941a8e7edb7a6cc44f2a2b79dff0467d9',
    miembros INT,
    categoria SET('niños', 'jóvenes', 'avanzados') DEFAULT '',
    calificacion int,
    tag VARCHAR(100)
);

CREATE TABLE historias (
    ID_HISTORIA INT NOT NULL PRIMARY KEY UNIQUE,
    titulo VARCHAR(100) NOT NULL,
    capitulos INT,
    cover TEXT(100) DEFAULT 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn0.iconfinder.com%2Fdata%2Ficons%2Fpicture-editing-1%2F2048%2FBroken_Image-512.png&f=1&nofb=1&ipt=d00acee6bb37e3910d23b3eff2a7e1e941a8e7edb7a6cc44f2a2b79dff0467d9',
    ultima_actualizacion DATE NOT NULL,
    vistas INT DEFAULT 0,
    likes INT DEFAULT 0,
    comentarios INT DEFAULT 0,
    estatus SET('draft', 'published') DEFAULT ''
);

CREATE TABLE comunidades (
    ID_COMUNIDAD INT NOT NULL PRIMARY KEY UNIQUE,
    fecha_de_union DATE NOT NULL,
    com_nua INT UNSIGNED NOT NULL,
    com_club INT NOT NULL,
    CONSTRAINT `fk_comunidad_nua`
        FOREIGN KEY (com_nua) REFERENCES usuarios(NUA),
    CONSTRAINT `fk_comunidad_club`
        FOREIGN KEY (com_club) REFERENCES club(ID_CLUB)
);

CREATE TABLE publicacion (
    ID_PUBLICACION INT NOT NULL PRIMARY KEY UNIQUE,
    fecha_de_publicacion DATE NOT NULL,
    estatus_publicacion SET('publicados', 'borradores') DEFAULT '',
    pub_nua INT UNSIGNED NOT NULL,
    pub_club INT NOT NULL,
    CONSTRAINT `fk_publicacion_nua`
        FOREIGN KEY (pub_nua) REFERENCES usuarios(NUA),
    CONSTRAINT `fk_publicacion_club`
        FOREIGN KEY (pub_club) REFERENCES historias(ID_HISTORIA)
);

CREATE TABLE libros (
    ISBN VARCHAR(100) NOT NULL PRIMARY KEY UNIQUE,
    titulo VARCHAR(100) NOT NULL,
    fecha_de_publicacion DATE DEFAULT CURRENT_TIMESTAMP,
    cantidad INT,
    no_edicion VARCHAR(20),
    no_paginas VARCHAR(100),
    prologo TEXT(1000),
    imagen TEXT(100) DEFAULT 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn0.iconfinder.com%2Fdata%2Ficons%2Fpicture-editing-1%2F2048%2FBroken_Image-512.png&f=1&nofb=1&ipt=d00acee6bb37e3910d23b3eff2a7e1e941a8e7edb7a6cc44f2a2b79dff0467d9',
    categoria ENUM('Poesia', 'Ciencia ficcion', 'Fantasia', 'Historia', 'Ensayo', 'Épica', 'Drama', 'Suspenso', '') DEFAULT '',
    calificacion int,
    tag SET('popular', 'nuevo', 'recomendado') DEFAULT '',
    tipo_de_documento SET('libro', 'revista', 'articulo') NOT NULL DEFAULT '',
    lenguaje SET('libro', 'revista', 'articulo') NOT NULL DEFAULT '',
    autor_id INT UNSIGNED NOT NULL,
    editoria_id INT UNSIGNED NOT NULL,
    CONSTRAINT `fk_libro_editoria`
        FOREIGN KEY (editoria_id) REFERENCES editoriales(ID_EDITORIA),
    CONSTRAINT `fk_libro_autor` 
        FOREIGN KEY (autor_id) REFERENCES autores (ID_AUTOR)
);

CREATE TABLE favoritos (
    ID_FAV INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    fecha_de_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    col_nua INT UNSIGNED NOT NULL,
    col_isbn VARCHAR(100) NOT NULL UNIQUE,
    CONSTRAINT `fk_col_nua`
        FOREIGN KEY (col_nua) REFERENCES usuarios(NUA),
    CONSTRAINT `fk_col_isbn`
        FOREIGN KEY (col_isbn) REFERENCES libros(ISBN)
);

CREATE TABLE prestamos (
    ID_PRESTAMOS INT UNSIGNED NOT NULL PRIMARY KEY,
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
    -- Admin
    'Oscar', 'Rosas', 'Zavala', 'or@ugto.mx', 'Villas', 'Irapuato', 'Guanajuato', 'Mexico', '123456789', 'ren01', 
    '123456789',  -- TODO: La contraseña es un ejemplo, pero esta va a ser encriptada en el siguiente ticket
    'admin'
), (
    -- Usuario particular
    'Oscar', 'Rosas', 'Zavala', 'ri@ugto.mx', 'Villas', 'Irapuato', 'Guanajuato', 'Mexico', '123456789', 'ren02', 
    '123456789',  -- TODO: La contraseña es un ejemplo, pero esta va a ser encriptada en el siguiente ticket
    'user'
);

INSERT INTO autores 
    (nombre,apaterno,amaterno,ciudad,pais,fecha_de_nacimiento, seguidores) 
VALUES 
    ('Gabriel' , 'García' , 'Márquez' , 'Aracataca' , 'Colombia' , '1927-03-06 00:00:00', 102),
    ('Miguel' , 'de' , 'Cervantes' , 'Alcalá de Henares' , 'España' , '1547-09-29 00:00:00', 300),
    ('Jane' , 'Austen' , NULL , 'Steventon' , 'Reino Unido' , '1775-12-16 00:00:00', 100),
    ('Lev' , 'Tolstoy' , NULL , 'Yásnaia Poliana' , 'Rusia' , '1828-09-09 00:00:00', 232),
    ('Virginia' , 'Woolf' , NULL , 'Londres' , 'Reino Unido' , '1882-01-25 00:00:00', 33),
    ('Samuel' , 'Clemens' , NULL , 'Florida, Missouri' , 'Estados Unidos' , '1835-11-30 00:00:00', 200),
    ('Haruki' , 'Murakami' , NULL , 'Kyoto' , 'Japón' , '1949-01-12 00:00:00', 450),
    ('Isabel' , 'Allende' , NULL , 'Lima' , 'Chile' , '1942-08-02 00:00:00', 340),
    ('Fyodor' , 'Dostoevsky' , NULL , 'Moscow Governorate' , 'Rusia' , '1821-11-11 00:00:00', 10),
    ('Joanne' , 'Rowling' , 'Murray' , 'Yate' , 'Reino Unido' , '1965-07-31 00:00:00', 120),
    ('Haruki','Murakami','','Kioto','Japón','1949-01-12 00:00:00', 200),
    ('J.K.','Rowling','','Yate','Inglaterra','1965-07-31 00:00:00', 129),
    ('Gabriel','Garcia Marquez','','Aracataca','Colombia','1927-03-06 00:00:00', 123),
    ('Toni','Morrison','','Lorain','Estados Unidos','1931-02-18 00:00:00', 400),
    ('Isabel','Allende','','Lima','Perú','1942-08-02 00:00:00', 430),
    ('Salman','Rushdie','','Bombay','India','1947-06-19 00:00:00', 324),
    ('Margaret','Atwood','','Ottawa','Canadá','1939-11-18 00:00:00', 394),
    ('Paulo','Coelho','','Río de Janeiro','Brasil','1947-08-24 00:00:00', 1100),
    ('Stephen','King','','Portland','Estados Unidos','1947-09-21 00:00:00', 302),
    ('Haruki','Murakami','','Kioto','Japón','1949-01-12 00:00:00', 500),
    ('Alejandra','García','López','Barcelona','España','1985-03-15 00:00:00', 43),
    ('Carlos','Martínez','Pérez','Madrid','España','1972-08-22 00:00:00',2),
    ('Laura','Rodríguez','González','Lima','Perú','1990-11-05 00:00:00', 203),
    ('Juan','Fernández','Sánchez','Buenos Aires','Argentina','1968-05-10 00:00:00', 234),
    ('María','López','Martínez','Ciudad de México','México','1980-07-25 00:00:00', 404),
    ('Pedro','García','Hernández','Santiago','Chile','1975-02-18 00:00:00', 230),
    ('Ana','Pérez','Ramírez','Lisboa','Portugal','1988-09-30 00:00:00', 490),
    ('Luis','González','Fernández','Montevideo','Uruguay','1970-04-20 00:00:00', 435),
    ('Sofía','Martínez','López','Caracas','Venezuela','1992-12-08 00:00:00',500),
    ('Diego','Rodríguez','García','San José','Costa Rica','1982-06-12 00:00:00',1);

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
    ('Faber & Faber' , 'Londres' , '24 Russell Square' , 'Reino Unido' , '1929-01-01 00:00:00'),
    ('Penguin Random House','Nueva York','1745 Broadway, Nueva York, NY 10019','Estados Unidos','1925-07-01 00:00:00'),
    ('Hachette Book Group','Nueva York','237 Park Avenue, Nueva York, NY 10017','Estados Unidos','1826-01-01 00:00:00'),
    ('HarperCollins','Nueva York','195 Broadway, Nueva York, NY 10007','Estados Unidos','1817-01-01 00:00:00'),
    ('Simon & Schuster','Nueva York','1230 Avenue of the Americas, Nueva York, NY 10020','Estados Unidos','1924-01-01 00:00:00'),
    ('Macmillan Publishers','Londres','4 Crinan Street, Londres, N1 9XW','Reino Unido','1843-01-01 00:00:00'),
    ('Holtzbrinck Publishing Group','Stuttgart','Holtzbrinck Publishing Group, Stuttgart','Alemania','1965-01-01 00:00:00'),
    ('Scholastic Corporation','Nueva York','557 Broadway, Nueva York, NY 10012','Estados Unidos','1920-01-01 00:00:00'),
    ('Bloomsbury Publishing','Londres','50 Bedford Square, Londres, WC1B 3DP','Reino Unido','1986-01-01 00:00:00'),
    ('Oxford University Press','Oxford','Great Clarendon Street, Oxford, OX2 6DP','Reino Unido','1478-01-01 00:00:00'),
    ('Cambridge University Press','Cambridge','The Edinburgh Building, Shaftesbury Road, Cambridge, CB2 8RU','Reino Unido','1534-01-01 00:00:00'),
    ('Editorial Fantástica','Madrid','Calle de la Imaginación 123, Madrid','España','1990-05-15 00:00:00'),
    ('Ediciones Mágicas','Lisboa','Rua da Magia 456, Lisboa','Portugal','1985-08-20 00:00:00'),
    ('Casa Editorial Luna','Ciudad de México','Avenida de la Luna 789, Ciudad de México','México','1995-11-30 00:00:00'),
    ('Ediciones Solaris','Buenos Aires','Calle del Sol 101, Buenos Aires','Argentina','2000-03-10 00:00:00'),
    ('Editorial Estelar','Santiago','Avenida de las Estrellas 202, Santiago','Chile','1992-07-12 00:00:00'),
    ('Ediciones Aurora','Lima','Calle de la Aurora 303, Lima','Perú','1988-04-25 00:00:00'),
    ('Casa Editorial Nube','Bogotá','Calle de las Nubes 404, Bogotá','Colombia','1998-09-05 00:00:00'),
    ('Ediciones Arcoíris','Montevideo','Avenida del Arcoíris 505, Montevideo','Uruguay','2002-12-01 00:00:00'),
    ('Editorial Oasis','Caracas','Calle del Oasis 606, Caracas','Venezuela','1993-06-22 00:00:00'),
    ('Ediciones Galaxia','San José','Avenida de la Galaxia 707, San José','Costa Rica','1987-02-14 00:00:00');


INSERT INTO libros
    (ISBN,titulo,fecha_de_publicacion,cantidad,imagen,categoria,calificacion,no_edicion,no_paginas,prologo,autor_id,editoria_id) 
VALUES 
    ('001A', 'Cien años de soledad', '1967-06-05 00:00:00', 10,'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fellector.com.pa%2Fcdn%2Fshop%2Ffiles%2Fcien-anos-de-soledad.webp%3Fv%3D1731690530%26width%3D1100&f=1&nofb=1&ipt=813d6e4a5fe789ef8a9532cccdcf2c5689cb7d0a67aabf96bd6c092cdcd027f2','Poesia', 3, '1', '417', 'Una saga familiar que muestra el realismo mágico en el pueblo ficticio de Macondo.', 1, 2),
    ('002A', 'Don Quijote de la Mancha', '1605-01-16 00:00:00', 2, 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.marcialpons.es%2Fmedia%2Fimg%2Fportadas%2F2023%2F4%2F18%2F9788408270881jfif&f=1&nofb=1&ipt=296903e218931f4c5faceda9d3c3d5763bffbddf0878d0944160155c04bc5fdf', 'Fantasia', 2, '1', '863', 'La historia de un hidalgo que busca revivir la caballería, enfrentándose a la locura y la realidad.', 2, 2),
    ('001B', 'Moby Dick', '1851-10-18 00:00:00', 3, 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.senscritique.com%2Fmedia%2F000019481669%2Fsource_big%2FMoby_Dick.jpg&f=1&nofb=1&ipt=bbcaedf85f5f942e139c91abda22e4c6e599d8171934a0edddc9e13f738381b5', 'Epica', 5, '1', '635', 'La obsesión del capitán Ahab por cazar a la gran ballena blanca.', 3, 4),
    ('002B', '1984', '1949-06-08 00:00:00', 4, 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fapp.blancoynegrostore.com%2Fimg%2Fproducts%2F3068%2F1984-tapa-dura-george-orwell-blanco-y-negro-1697729657.jpg%3Fw%3D1000%26h%3D1500%26fit%3Dcrop%26fm%3Dwebp&f=1&nofb=1&ipt=67c7969148bcb20bd44030203d6a8c861b5e31cb3f0d9d7e6ccec3b1d035735d', 'Drama', 5, '1', '328', 'Una distopía que explora el totalitarismo y la vigilancia estatal.', 4, 3),
    ('003B', 'Orgullo y prejuicio', '1813-01-28 00:00:00', 4, 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpendulo.com%2Fimagenes_grandes%2F9788494%2F978849441163.GIF&f=1&nofb=1&ipt=0a9e3a62ae5ff9c6993eaf88397d7a1729f77135c7c96b7cd09e0dc9c2192c2f', 'Suspenso', 4, '1', '432', 'Un análisis de las relaciones y el matrimonio en la Inglaterra del siglo XIX.', 5, 4),
    ('003A', 'El gran Gatsby', '1925-04-10 00:00:00', 10, 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.polifemo.com%2Fstatic%2Fimg%2Fportadas%2F_visd_0000JPG02IMD.jpg&f=1&nofb=1&ipt=246eaa2838839f95d8885b40eace6a5e040285610204ad58016c7b55600fc686', 'Historia', 3, '1', '180', 'La historia de Jay Gatsby y su amor por Daisy Buchanan, en el contexto del sueño americano.', 6, 9),
    ('004A', 'Crimen y castigo', '1866-01-01 00:00:00', 4, 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.storytel.com%2Fimages%2Fe%2F640x640%2F0002060314.jpg&f=1&nofb=1&ipt=48955b80122de32d8821adba6c087b0fec57c0b651dd5c37c9e4a1ca7c4a474e', 'Fantasia', 2, '1', '430', 'Un joven estudiante comete un asesinato y lidia con su culpa.', 7, 3),
    ('005A', 'Los hermanos Karamazov', '1880-01-01 00:00:00', 3, 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimagessl0.casadellibro.com%2Fa%2Fl%2Ft0%2F10%2F9788484289210.jpg&f=1&nofb=1&ipt=ceef6bc314eec5206c13d215d4e40e3fdc6c84da41df4b0aafc2d610041a3c96', 'Épica', 5, '1', '796', 'Explora dilemas morales y filosóficos a través de la historia de una familia rusa.', 8, 9),
    ('006A', 'El proceso', '1925-08-10 00:00:00', 19, 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.polifemo.com%2Fstatic%2Fimg%2Fportadas%2F_visd_0000JPG02JU0.jpg&f=1&nofb=1&ipt=374db32f63af6d8bece7664f0d4c5dfb355aecbd47f421a2a380bb02e7af4eab', 'Suspenso', 5, '1', '255', 'Un hombre es arrestado por un crimen que no entiende, reflejando la absurdidad del sistema judicial.', 9, 10),
    ('007A', 'Ulises', '1922-02-02 00:00:00', 10, 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages-na.ssl-images-amazon.com%2Fimages%2FI%2F51xA-VXhATL.jpg&f=1&nofb=1&ipt=57b9200fb06eff0756288a2b1ec4239ec0b1c5643753f423de0e83bfaeeda5f3', 'Drama', 1, '1', '730', 'Un reimaginación moderna de la Odisea, ambientada en Dublín durante un solo día.', 10, 1);
