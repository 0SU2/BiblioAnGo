package utils

import (
	"encoding/json"
	"log"
	"net/http"
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
	exp := time.Now().Add(time.Duration(10000) * time.Hour)
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

func ParseToken(tokenStr string) (*Claims, error) {
	log.Printf("[utils] %s", JwtString)
	token, err := jwt.ParseWithClaims(tokenStr, &Claims{}, func(token *jwt.Token) (any, error) {
		return []byte(JwtString), nil
	})
	if err != nil {
		return nil, err
	}
	if claims, ok := token.Claims.(*Claims); ok && token.Valid {
		return claims, nil
	}
	return nil, jwt.ErrTokenInvalidClaims
}

func RespondJSON(w http.ResponseWriter, r *http.Request, code int, payload any) {
	host := r.RemoteAddr
	routeReq := &r.URL
	log.Printf("User %s request %s\n", host, *routeReq)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	if err := json.NewEncoder(w).Encode(payload); err != nil {
		log.Fatalf("[ERROR] Check response in server: %s\n", err.Error())
	}
}
