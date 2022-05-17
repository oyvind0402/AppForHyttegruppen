package server

import (
	"bachelorprosjekt/backend/data"
	"bachelorprosjekt/backend/utils"
	"database/sql"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// Retrieve one faq by ID (receives faqId: int; returns FAQ)
func (r repo) GetOneFAQ(ctx *gin.Context) {
	// Retrieve parameter ID
	rec := ctx.Param("id")

	faqId, err := strconv.Atoi(rec)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Select user from database
	row := r.sqlDb.QueryRow(`SELECT * FROM Faq WHERE faq_id = $1 LIMIT 1`, faqId)

	// Map columns to FAQ fields
	var faq data.FAQ
	if err := row.Scan(
		&faq.Id,
		&faq.Question,
		&faq.Answer); err != nil && err != sql.ErrNoRows {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	} else if err == sql.ErrNoRows {
		ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{"err": err.Error()})
		return
	}

	// Return success and one faq
	ctx.JSON(http.StatusOK, faq)
}

// Retrieve all faqs in database (receives NOTHING; returns []FAQ)
func (r repo) GetAllFAQs(ctx *gin.Context) {
	// Select all FAQ from database
	rows, err := r.sqlDb.Query(`SELECT * FROM Faq ORDER BY faq_id`)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}
	defer rows.Close()

	// Create Faq array
	var faqs []data.FAQ

	// For each retrieved row, create FAQ and append to array
	for rows.Next() {
		var faq data.FAQ

		// Insert row values into FAQ
		if err = rows.Scan(
			&faq.Id,
			&faq.Question,
			&faq.Answer); err != nil {
			ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
			return
		}

		// Append FAQ to FAQs array
		faqs = append(faqs, faq)
	}

	// Return success and FAQ array
	ctx.JSON(200, faqs)
}

// Post one faq (receives FAQ: FAQ; returns InsertedId: int)
func (r repo) PostFAQ(ctx *gin.Context) {
	// Retrieve FAQ
	faq := new(data.FAQ)
	err := ctx.BindJSON(faq)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	validFAQ := utils.CheckFAQValidation(faq.Question, faq.Answer)
	if !validFAQ {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": "Invalid FAQ input!"})
		return
	}

	// Execute INSERT query and retrieve ID of inserted user
	var resId int
	if err = r.sqlDb.QueryRow(
		`INSERT INTO Faq(
			question,
			answer)
			VALUES($1, $2) RETURNING faq_id`,
		&faq.Question,
		&faq.Answer,
	).Scan(&resId); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Return success and ID of added faq
	ctx.JSON(200, resId)
}

// Update one faq (receives faq: FAQ; returns rowsAffected: int)
func (r repo) UpdateFAQ(ctx *gin.Context) {
	// Get FAQ from context
	faq := new(data.FAQ)
	err := ctx.BindJSON(faq)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Run update
	res, err := r.sqlDb.Exec(
		`UPDATE Faq 
		SET 
			question = $1, 
			answer = $2
		WHERE faq_id = $3`,
		faq.Question, faq.Answer, faq.Id,
	)
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

	// Return number of rows affected
	ctx.JSON(200, rowsAffected)
}

// Delete one faq with specified ID (receives faqId: string; returns rowsAffected: int)
func (r repo) DeleteFAQ(ctx *gin.Context) {
	// Retrieve ID parameter
	faqId := new(int)
	if err := ctx.BindJSON(faqId); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Delete from database
	res, err := r.sqlDb.Exec(`DELETE FROM Faq WHERE faq_id = $1`, &faqId)
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
		ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{"err": fmt.Sprintf("Cannot delete non-existent FAQ #%d", *faqId)})
		return
	}

	// Return nr of rows affected
	ctx.JSON(200, rowsAffected)
}
