package utils

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type Claims struct {
	NUA     string `json:"NUA"`
	Usuario string `json:"usuario"`
	jwt.RegisteredClaims
}

var JwtString string

func GenerateToken(nua, usuario string) (string, error) {
	exp := time.Now().Add(time.Duration(1000) * time.Hour)
	claims := Claims{
		NUA:     nua,
		Usuario: usuario,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(exp),
		},
	}
	return jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString([]byte(JwtString))
}

func HashPassword(pw string) (string, error) {
	b, err := bcrypt.GenerateFromPassword([]byte(pw), bcrypt.DefaultCost)
	return string(b), err
}
