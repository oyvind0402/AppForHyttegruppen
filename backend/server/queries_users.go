package server

import (
	"bachelorprosjekt/backend/data"
	"database/sql"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func getUser(ctx *gin.Context, row *sql.Row) (data.User, int, error) {
	var user data.User
	var err error

	// Map columns to User fields
	if err = row.Scan(
		&user.Id,
		&user.Email,
		&user.Password,
		&user.FirstName,
		&user.LastName,
		&user.AdminAccess); err != nil && err != sql.ErrNoRows {
		return user, http.StatusBadRequest, err
	} else if err == sql.ErrNoRows {
		return user, http.StatusNotFound, err
	}
	return user, http.StatusOK, err
}

// Retrieve one user by ID (receives int)
func (r repo) GetUser(ctx *gin.Context) {
	// curl -X GET -v -d "1" localhost:8080/user/get

	// Retrieve parameter ID
	userId := new(int)
	if err := ctx.BindJSON(userId); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Select user from database
	row := r.sqlDb.QueryRow(`SELECT * FROM Users WHERE user_id = $1 LIMIT 1`, *userId)

	user, response, err := getUser(ctx, row)
	if err != nil {
		ctx.AbortWithStatusJSON(response, gin.H{"err": err.Error()})
		return
	}

	// Return success and one user
	ctx.JSON(response, user)
}

// Retrieve all users in database (receives NOTHING)
func (r repo) GetAllUsers(ctx *gin.Context) {
	// Get all users from database
	rows, err := r.sqlDb.Query(`SELECT * FROM Users`)
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
			&user.Password,
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

// Post one user (receives User)
func (r repo) PostUser(ctx *gin.Context) {
	// Retrieve User
	user := new(data.User)
	err := ctx.BindJSON(user)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Execute INSERT query and retrieve ID of inserted user
	var resId int
	if err = r.sqlDb.QueryRow(
		`INSERT INTO Users(
			user_id,
			email,
			passwd,
			firstname,
			lastname,
			admin_access) 
			VALUES($1, $2, $3, $4, $5, $6) RETURNING user_id`,
		&user.Id,
		&user.Email,
		&user.Password,
		&user.FirstName,
		&user.LastName,
		&user.AdminAccess,
	).Scan(&resId); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Return success and ID of added user
	ctx.JSON(200, resId)
}

// Delete one user with specified ID (receives int)
func (r repo) DeleteUser(ctx *gin.Context) {
	// curl -X DELETE -v -d "1" localhost:8080/user/delete

	// Retrieve ID parameter
	userId := new(int)
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
		ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{"err": fmt.Sprintf("Cannot delete non-existent user #%d", *userId)})
		return
	}

	// Return number of rows deleted
	ctx.JSON(200, rowsAffected)
}

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
	row := r.sqlDb.QueryRow(`SELECT COUNT(*) FROM Users WHERE email = $1 AND passwd = $2`, credentials.Email, credentials.Password)

	// Retrieve number of matches
	res := new(int)
	row.Scan(&res)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Successfully sign in if 1 match, fail if 0 or more than one
	if *res == 1 {
		ctx.JSON(http.StatusOK, gin.H{
			"msg": "Signed up successfully.",
			"jwt": "123456789",
		})
	} else if *res == 0 {
		ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{"err": "Your e-mail or password is incorrect"})
	} else {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"err": "Duplicate user found."})
	}

}
