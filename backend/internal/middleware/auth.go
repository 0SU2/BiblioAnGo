package middleware

import (
	"net/http"
)

func Auth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// auth := r.Header.Get("Authorization")
		// if auth == "" || !strings.HasPrefix(auth, "Bearer ") {
		// 	http.Error(w, "Unauthorized", http.StatusUnauthorized)
		// 	return
		// }
		// token := strings.TrimPrefix(auth, "Bearer ")
		// _, err := utils.ParseToken(token)
		// if err != nil {
		// 	http.Error(w, "Invalid token", http.StatusUnauthorized)
		// 	return
		// }
		next.ServeHTTP(w, r)
	})
}
