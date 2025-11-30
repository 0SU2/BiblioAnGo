package config

import (
	"0SU2/biblioteca/internal/utils"
	"database/sql"
	"fmt"
	"net/http"
	"os"

	"github.com/go-chi/chi"
	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
)

type AppStruct struct {
	User_database     string
	password_database string
	name_database     string
	Host_database     string
	Port_database     string
	Port              string
	JWTSecret_string  string
	Chi_conf          *chi.Mux
	DB                *sql.DB
	Handler           http.Handler
}

func NewConfig() (*AppStruct, error) {
	temp := &AppStruct{User_database: "", password_database: "", name_database: "", Host_database: "", Port_database: "", Port: "", JWTSecret_string: "", Chi_conf: nil, DB: nil}
	if err := godotenv.Load(); err != nil {
		// permitir correr sin .env, usando defaults
	}

	temp.User_database = getEnv("USER_DATABASE", "root")
	temp.password_database = getEnv("PASSWORD_DATABASE", "")
	temp.name_database = getEnv("NAME_DATABASE", "BiblioAnGo")
	temp.Host_database = getEnv("DB_HOST", "127.0.0.1")
	temp.Port_database = getEnv("DB_PORT", "3306")
	utils.JwtString = getEnv("JWT_SECRET", getEnv("JWT_SECRETE", ""))
	temp.Port = getEnv("PORT", "8080")
	temp.Chi_conf = chi.NewRouter()

	// 1) Conectar sin base específica para crearla si no existe
	rootDSN := fmt.Sprintf("%s:%s@tcp(%s:%s)/", temp.User_database, temp.password_database, temp.Host_database, temp.Port_database)
	rootDB, err := sql.Open("mysql", rootDSN)
	if err != nil {
		return nil, err
	}
	if _, err := rootDB.Exec("CREATE DATABASE IF NOT EXISTS `" + temp.name_database + "`"); err != nil {
		return nil, err
	}
	_ = rootDB.Close()

	// 2) Conectar ya a la base esperada
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true&charset=utf8mb4,utf8", temp.User_database, temp.password_database, temp.Host_database, temp.Port_database, temp.name_database)
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		return nil, err
	}
	if err := db.Ping(); err != nil {
		return nil, err
	}

	// asegurar esquema mínimo para autenticación
	if err := ensureUsuariosTable(db); err != nil {
		return nil, err
	}

	temp.DB = db

	return temp, nil
}

func ensureUsuariosTable(db *sql.DB) error {
	ddl := `CREATE TABLE IF NOT EXISTS usuarios (
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
    avatar VARCHAR(255) NOT NULL DEFAULT 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ficons.veryicon.com%2Fpng%2Fo%2Fmiscellaneous%2Fcommon-area-icons%2Fdefault-avatar-1.png&f=1&nofb=1&ipt=71e11e38dce31818f33eebb78301e2fbf8fd80f122a849d256f4c0e6715125fa',
    biografia TEXT(100),
    seguidores INT NOT NULL DEFAULT 0,
    siguiendo INT NOT NULL DEFAULT 0,
    facebook_link TEXT(100),
    instagram_link TEXT(100),
    twitter_link TEXT(100)
  )`
	_, err := db.Exec(ddl)
	return err
}

func getEnv(key, def string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return def
}
