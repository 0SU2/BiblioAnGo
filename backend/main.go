package main

import (
	"0SU2/biblioteca/internal/config"
	"log"

	_ "github.com/go-sql-driver/mysql"
)

func main() {
	err := config.InitConfig()
	if err != nil {
		log.Fatalf("[ERROR] failed to init server configs. %s\n", err)
	}

	config.StartServe()
}
