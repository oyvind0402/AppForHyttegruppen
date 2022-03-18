package server

import (
	"bachelorprosjekt/backend/data"
	"database/sql"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

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

	// Create User
	var user data.User

	// Map columns to User fields
	if err := row.Scan(
		&user.Id,
		&user.Email,
		&user.Password,
		&user.FirstName,
		&user.LastName,
		&user.AdminAccess); err != nil && err != sql.ErrNoRows {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	} else if err == sql.ErrNoRows {
		ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{"err": err.Error()})
		return
	}

	// Return success and one user
	ctx.JSON(200, user)
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
