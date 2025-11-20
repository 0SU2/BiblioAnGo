package main

import (
	"0SU2/biblioteca/internal/config"
	"log"

	_ "github.com/go-sql-driver/mysql"
)

func main() {
	appConf, err := config.InitConfig()

	if err != nil {
		log.Fatalf("[ERROR] failed to init env file: %s\n", err.Error())
	}

	if err := config.StartDB(appConf); err != nil {
		log.Fatalf("[ERROR] failed to init mysql: %s\n", err.Error())
	}

	if err := config.StartServe(appConf); err != nil {
		log.Fatalf("[ERROR] failed to init server: %s\n", err.Error())
	}
}
