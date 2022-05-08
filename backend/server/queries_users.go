package server

import (
	"bachelorprosjekt/backend/data"
	"bachelorprosjekt/backend/middleware"
	"bachelorprosjekt/backend/utils"

	"database/sql"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/renstrom/shortuuid"
	"golang.org/x/crypto/bcrypt"
)

// Process one sql.Row into one User
func getUser(ctx *gin.Context, row *sql.Row) (data.User, int, error) {
	var user data.User
	var err error

	// Map columns to User fields
	if err = row.Scan(
		&user.Id,
		&user.Email,
		&user.HashedPassword,
		&user.Token,
		&user.RefreshToken,
		&user.FirstName,
		&user.LastName,
		&user.AdminAccess); err != nil && err != sql.ErrNoRows {
		return user, http.StatusBadRequest, err
	} else if err == sql.ErrNoRows {
		return user, http.StatusNotFound, err
	}
	return user, http.StatusOK, err
}

// Get one User by Id
func (r repo) getUserById(ctx *gin.Context, userId string) (data.User, error) {
	// Define user
	var user data.User

	// Retrieve user by ID
	row := r.sqlDb.QueryRow(`SELECT user_id, email, firstname, lastname, admin_access FROM Users WHERE user_id = $1`, userId)

	// Populate User fields with column values
	var err error
	if err = row.Scan(
		&user.Id,
		&user.Email,
		&user.FirstName,
		&user.LastName,
		&user.AdminAccess); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
	}

	return user, err
}

// Retrieve one user by Email (receives email: string; returns User)
func (r repo) GetUserByEmail(ctx *gin.Context) {
	// Retrieve parameter ID
	email := ctx.Param("email")

	// Select user from database
	row := r.sqlDb.QueryRow(`SELECT * FROM Users WHERE email= $1 LIMIT 1`, email)

	user, response, err := getUser(ctx, row)
	if err != nil {
		ctx.AbortWithStatusJSON(response, gin.H{"err": err.Error()})
		return
	}

	// Return success and one user
	ctx.JSON(response, user)
}

// Retrieve all users in database (receives NOTHING; returns []User)
func (r repo) GetAllUsers(ctx *gin.Context) {
	// Get all users from database
	rows, err := r.sqlDb.Query(`SELECT * FROM Users ORDER BY user_id`)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}
	defer rows.Close()

	// Create User array
	var users []data.User

	// For each retrieved row, create User and append to array
	for rows.Next() {
		var user data.User

		// Insert row values into User
		if err = rows.Scan(
			&user.Id,
			&user.Email,
			&user.HashedPassword,
			&user.Token,
			&user.RefreshToken,
			&user.FirstName,
			&user.LastName,
			&user.AdminAccess); err != nil {
			ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
			return
		}

		// Append User to Users array
		users = append(users, user)
	}

	// Return success and User array
	ctx.JSON(200, users)
}

// Post one user (receives User; returns rowsAffected: int)
func (r repo) PostUser(ctx *gin.Context) {
	// Retrieve User
	user := new(data.User)
	err := ctx.BindJSON(user)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	validUser := utils.CheckUserValidity(user.Email, user.FirstName, user.LastName)
	if !validUser {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": "The user input is invalid"})
		return
	}
	validPw := utils.CheckPasswordValidity(user.Password)
	if !validPw {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": "The password is invalid"})
		return
	}

	// Hash users password
	toHash := []byte(user.Password)
	hashedPassword, err := bcrypt.GenerateFromPassword(toHash, bcrypt.DefaultCost)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	if user.Id != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": "User ID is autogenerated. You should not send it in your request."})
		return
	}

	user.HashedPassword = string(hashedPassword)

	// Creating userId
	user.Id = new(string)
	*user.Id = shortuuid.New()

	// Generating token and refresh token
	token, refreshToken, tokenErr := middleware.CreateTokens(user.Email, user.AdminAccess)

	if tokenErr != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": tokenErr.Error()})

	}

	user.Token = token
	user.RefreshToken = refreshToken

	// Execute INSERT query and retrieve ID of inserted user
	var resId string
	if err = r.sqlDb.QueryRow(
		`INSERT INTO Users(
			user_id,
			email,
			hashed_passwd,
			token,
			refresh_token,
			firstname,
			lastname,
			admin_access) 
			VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING user_id`,
		&user.Id,
		&user.Email,
		&user.HashedPassword,
		&user.Token,
		&user.RefreshToken,
		&user.FirstName,
		&user.LastName,
		&user.AdminAccess,
	).Scan(&resId); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Return success and added user
	ctx.JSON(200, resId)
}

// Delete one user with specified ID (receives userId: string; returns rowsAffected: int)
func (r repo) DeleteUser(ctx *gin.Context) {
	// curl -X DELETE -v -d "1" localhost:8080/user/delete

	// Retrieve ID parameter
	userId := new(string)
	if err := ctx.BindJSON(userId); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Delete from database
	res, err := r.sqlDb.Exec(`DELETE FROM Users WHERE user_id = $1`, &userId)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Retrieve number of affected rows
	rowsAffected, err := res.RowsAffected()
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	if rowsAffected == 0 {
		ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{"err": fmt.Sprintf("Cannot delete non-existent user #%s", *userId)})
		return
	}

	// Return number of rows deleted
	ctx.JSON(200, rowsAffected)
}

// Sign in (receives {email: string, password: string}; returns {msg: string, jwt: string})
func (r repo) SignIn(ctx *gin.Context) {
	type signin struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	// Retriieve credentials from front-end
	credentials := new(signin)
	err := ctx.BindJSON(credentials)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Search for match on database
	row := r.sqlDb.QueryRow(`SELECT * FROM Users WHERE email = $1`, credentials.Email)

	// Retrieve entire match
	var user data.User
	scanErr := row.Scan(&user.Id,
		&user.Email,
		&user.HashedPassword,
		&user.Token,
		&user.RefreshToken,
		&user.FirstName,
		&user.LastName,
		&user.AdminAccess)
	if scanErr != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": scanErr.Error()})
		return
	}

	// Check if the password is right
	salted := []byte(credentials.Password)
	pwErr := bcrypt.CompareHashAndPassword([]byte(user.HashedPassword), salted)
	if pwErr != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": pwErr.Error()})
		return
	}

	// Updating tokens on login
	token, refreshToken, tokenErr := middleware.CreateTokens(user.Email, user.AdminAccess)
	if tokenErr != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": tokenErr.Error()})
		return
	}

	_, updateErr := r.sqlDb.Exec(`UPDATE Users SET token = $1, refresh_token = $2 WHERE email = $3`, &token, &refreshToken, &user.Email)
	if updateErr != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": updateErr.Error()})
		return
	}

	// Returns token, refreshToken, userId and adminAccess
	ctx.JSON(http.StatusOK, gin.H{
		"token":        user.Token,
		"refreshToken": user.RefreshToken,
		"userId":       user.Id,
		"adminAccess":  user.AdminAccess,
	})
}

// Update one users admin rights
func (r repo) UpdateUserAdminAccess(ctx *gin.Context) {
	type AdminUser struct {
		UserId      string `json:"userId"`
		AdminAccess bool   `json:"adminAccess"`
	}

	tx, err := r.sqlDb.BeginTx(ctx, nil)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}
	defer tx.Rollback()

	adminUser := new(AdminUser)
	if err = ctx.BindJSON(adminUser); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Update the users AdminAccess bool
	res, err := tx.Exec(`UPDATE Users SET admin_access = $1 WHERE user_id = $2`, adminUser.AdminAccess, adminUser.UserId)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Get rows affected
	rowsAffected, err := res.RowsAffected()
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Commit transaction
	if err = tx.Commit(); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Return number of users updated
	ctx.JSON(200, rowsAffected)
}
