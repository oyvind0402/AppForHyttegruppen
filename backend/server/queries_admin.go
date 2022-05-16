package server

import (
	"bachelorprosjekt/backend/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

type EmailAddress struct {
	Id    int    `json:"emailId,omitempty"`
	Email string `json:"email"`
}

// Retrieve all email addresses for admin emails
func (r repo) GetAllAdminEmailAddresses(ctx *gin.Context) {
	// Create email array
	var emails []EmailAddress

	stmt := `SELECT * FROM AdminEmails`
	rows, err := r.sqlDb.Query(stmt)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}
	defer rows.Close()

	// For each retrieved row, create email and append to array
	for rows.Next() {
		var email EmailAddress

		// Insert row values into email
		if err = rows.Scan(
			&email.Id,
			&email.Email,
		); err != nil {
			ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
			return
		}

		emails = append(emails, email)
	}
	ctx.JSON(200, emails)
}

// Post new email address to receive emails
func (r repo) PostAdminEmailAddress(ctx *gin.Context) {
	// Retrieve email from context
	email := new(string)
	err := ctx.BindJSON(email)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	validEmail := utils.CheckAdminEmailValidation(*email)
	if !validEmail {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": "Invalid email!"})
		return
	}

	// Post email
	var resId int
	if err = r.sqlDb.QueryRow(`INSERT INTO AdminEmails (email)
     VALUES ($1) RETURNING email_id`, email,
	).Scan(&resId); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	ctx.JSON(200, resId)
}

// Update email address, receives id
func (r repo) UpdateAdminEmailAddress(ctx *gin.Context) {
	email := new(EmailAddress)
	err := ctx.BindJSON(email)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Run update query
	res, err := r.sqlDb.Exec(`UPDATE AdminEmails SET email = $1 WHERE email_id = $2`, email.Email, email.Id)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Retrieve number of rows affected
	rowsAffected, err := res.RowsAffected()
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	ctx.JSON(200, rowsAffected)
}

// Delete one email address by id (receives email_id: int; returns rowsAffected: int)
func (r repo) DeleteAdminEmailAddress(ctx *gin.Context) {
	// Retrieve id from context
	emailId := new(int)
	if err := ctx.BindJSON(emailId); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Run delete query
	res, err := r.sqlDb.Exec(`DELETE FROM AdminEmails WHERE email_id = $1`, emailId)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Retrieve number of rows affected
	rowsAffected, err := res.RowsAffected()
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	ctx.JSON(200, rowsAffected)
}
