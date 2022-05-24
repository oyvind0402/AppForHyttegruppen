package middleware

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
)

type SignedDetails struct {
	Email       string
	AdminAccess bool
	jwt.StandardClaims
}

var JWT_SECRET_KEY string = os.Getenv("JWT_SECRET_KEY")

func CreateTokens(email string, adminAccess bool) (signedToken string, err error) {
	tokenClaims := &SignedDetails{
		Email:       email,
		AdminAccess: adminAccess,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Local().Add(time.Hour * time.Duration(336)).Unix(),
		},
	}

	token, err := jwt.NewWithClaims(jwt.SigningMethodHS256, tokenClaims).SignedString([]byte(JWT_SECRET_KEY))
	if err != nil {
		fmt.Println("ERROR WITH TOKEN GENERATION")
		return
	}

	return token, err
}

func validateToken(signedToken string) (claims *SignedDetails, msg string) {
	token, err := jwt.ParseWithClaims(
		signedToken,
		&SignedDetails{},
		func(token *jwt.Token) (interface{}, error) {
			return []byte(JWT_SECRET_KEY), nil
		},
	)

	if err != nil {
		msg = err.Error()
		return
	}

	claims, ok := token.Claims.(*SignedDetails)

	if !ok {
		msg = "The token is invalid"
		return
	}

	if claims.ExpiresAt < time.Now().Local().Unix() {
		msg = "Token is expired"
		return
	}

	_, err2 := http.Get("http://localhost:8080/api/user/" + claims.Email)
	if err2 != nil {
		msg = "User doesnt exist, authentication invalid"
		return
	}

	return claims, msg
}

func validateAdminToken(signedToken string) (claims *SignedDetails, msg string) {
	token, err := jwt.ParseWithClaims(
		signedToken,
		&SignedDetails{},
		func(token *jwt.Token) (interface{}, error) {
			return []byte(JWT_SECRET_KEY), nil
		},
	)

	if err != nil {
		msg = err.Error()
		return
	}

	claims, ok := token.Claims.(*SignedDetails)

	if !ok {
		msg = "The token is invalid"
		return
	}

	if claims.ExpiresAt < time.Now().Local().Unix() {
		msg = "Token is expired"
		return
	}

	if !claims.AdminAccess {
		msg = "Admin access required!"
		return
	}

	return claims, msg
}

func AuthenticateAdmin() gin.HandlerFunc {
	return func(c *gin.Context) {
		cookie, err2 := c.Request.Cookie("token")
		if err2 != nil {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"err": err2})
			return
		}

		adminToken := cookie.Value
		if adminToken == "" {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"err": "No Authorization header provided"})
			return
		}

		claims, err := validateAdminToken(adminToken)
		if err != "" {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"err": err})
			return
		}

		c.Set("email", claims.Email)

		c.Next()
	}
}

func Authenticate() gin.HandlerFunc {
	return func(c *gin.Context) {
		cookie, err2 := c.Request.Cookie("token")
		if err2 != nil {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"err": err2})
			return
		}
		clientToken := cookie.Value
		if clientToken == "" {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"err": "No Authorization header provided"})
			return
		}

		claims, err := validateToken(clientToken)
		if err != "" {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"err": err})
			return
		}

		c.Set("email", claims.Email)

		c.Next()
	}
}
