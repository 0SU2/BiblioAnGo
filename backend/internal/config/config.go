package config

import (
	"database/sql"
	"encoding/json"
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
}

func InitConfig() (*AppConfig, error) {
	temp := &AppConfig{user_database: "", password_database: "", name_database: "", port: "", chi_conf: nil}
	if err := godotenv.Load(); err != nil {
		return nil, err
	}

	temp.user_database = getEnv("USER_DATABASE", "")
	temp.password_database = getEnv("PASSWORD_DATABASE", "")
	temp.name_database = getEnv("NAME_DATABASE", "BiblioAnGo")
	temp.port = getEnv("PORT", "8080")
	temp.chi_conf = chi.NewRouter()

	return temp, nil
}

func StartServe(appConf *AppConfig) error {
	r := appConf.chi_conf

	// Preparar insert a tabla
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"https://*", "http://*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	}))

	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		host := r.RemoteAddr
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		if err := json.NewEncoder(w).Encode(map[string]any{"success": true}); err != nil {
			log.Fatalf("[ERROR] Check response in server: %s\n", err.Error())
		}
		log.Printf("User %s request \\\n", host)
	})

	log.Printf("[SUCCESS] Listeting in port %s\n", appConf.port)
	if err := http.ListenAndServe(":"+appConf.port, r); err != nil {
		log.Fatalf("[ERROR] Something happend with the server: %s\n", err.Error())
	}

	return nil
}

func StartDB(appConf *AppConfig) error {
	db, err := sql.Open("mysql", appConf.user_database+":"+appConf.password_database+"@/"+appConf.name_database)
	if err != nil {
		return err
	}
	defer db.Close()
	return nil
}

func getEnv(key, def string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return def
}
