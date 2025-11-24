package main

import (
	"0SU2/biblioteca/internal/config"
	"0SU2/biblioteca/internal/controller"
	"0SU2/biblioteca/internal/repositories"
	"0SU2/biblioteca/internal/routes"
	"0SU2/biblioteca/internal/service"
	"log"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
)

func main() {
	appConfig, err := config.InitConfig()
	if err != nil {
		log.Fatalf("[ERROR] failed to init server configs. %s\n", err)
	}

	dbr := repositories.NewRepository(appConfig)
	dbs := service.NewDatabaseService(dbr)
	dbc := controller.NewDatabaseController(dbs)

	handler := routes.DefineRoutes(appConfig.Chi_conf, dbc)

	server := &http.Server{
		Addr:    ":" + appConfig.Port,
		Handler: handler,
	}

	log.Printf("[SUCCESS] Listeting in port %s\n", appConfig.Port)
	if err := server.ListenAndServe(); err != nil {
		log.Fatalf("[ERROR] Something happend with the server: %s\n", err.Error())
	}

	defer server.Close()
	defer appConfig.DB.Close()
}
