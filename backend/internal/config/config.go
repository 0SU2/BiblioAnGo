package config

import (
	"0SU2/biblioteca/internal/utils"
	"database/sql"
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
	Port              string
	JWTSecret_string  string
	Chi_conf          *chi.Mux
	DB                *sql.DB
	Handler           http.Handler
}

func NewConfig() (*AppStruct, error) {
	temp := &AppStruct{User_database: "", password_database: "", name_database: "", Port: "", JWTSecret_string: "", Chi_conf: nil, DB: nil}
	if err := godotenv.Load(); err != nil {
		return nil, err
	}

	temp.User_database = getEnv("USER_DATABASE", "")
	temp.password_database = getEnv("PASSWORD_DATABASE", "")
	temp.name_database = getEnv("NAME_DATABASE", "BiblioAnGo")
	utils.JwtString = getEnv("JWT_SECRET", "")
	temp.Port = getEnv("PORT", "8080")
	temp.Chi_conf = chi.NewRouter()

	db, err := sql.Open("mysql", temp.User_database+":"+temp.password_database+"@/"+temp.name_database)
	if err != nil {
		return nil, err
	}
	temp.DB = db

	return temp, nil
}

func getEnv(key, def string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return def
}
