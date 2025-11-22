package config

import (
	"0SU2/biblioteca/internal/routes"
	"database/sql"
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi"
	"github.com/go-chi/cors"
	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
)

type AppConfig struct {
	user_database     string
	password_database string
	name_database     string
	port              string
	chi_conf          *chi.Mux
	DB                *sql.DB
}

var C AppConfig

func InitConfig() error {
	// temp := &AppConfig{user_database: "", password_database: "", name_database: "", port: "", chi_conf: nil}
	if err := godotenv.Load(); err != nil {
		return err
	}

	C.user_database = getEnv("USER_DATABASE", "")
	C.password_database = getEnv("PASSWORD_DATABASE", "")
	C.name_database = getEnv("NAME_DATABASE", "BiblioAnGo")
	C.port = getEnv("PORT", "8080")
	C.chi_conf = chi.NewRouter()

	db, err := sql.Open("mysql", C.user_database+":"+C.password_database+"@/"+C.name_database)
	if err != nil {
		return err
	}
	C.DB = db

	return nil
}

func StartServe() error {
	handler := C.chi_conf

	handler.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"https://*", "http://*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	}))

	routes.DefineRoutes(handler, C.DB)

	log.Printf("[SUCCESS] Listeting in port %s\n", C.port)
	if err := http.ListenAndServe(":"+C.port, handler); err != nil {
		log.Fatalf("[ERROR] Something happend with the server: %s\n", err.Error())
	}

	return nil
}

func getEnv(key, def string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return def
}
