package tests

import (
	"bachelorprosjekt/backend/utils"
	"errors"
	"fmt"
	"testing"
	"time"
)

func TestPanicker(t *testing.T) {
	defer func() {
		if r := recover(); r == nil {
			t.Logf("The code did not panic")
			t.Fail()
		}
	}()

	utils.Panicker(errors.New("err: Panic"), "The function threw an error: ")
}

func TestGetCreds(t *testing.T) {
	username, passwd := utils.GetCreds("../../credentials/e-creds")
	if username != "hytteappen@gmail.com" || passwd != "jvgglwyqrxpveymv" {
		t.Logf("Expected the right credentials, got the wrong credentials")
		t.Fail()
	}
}

func TestGetCredsPanics(t *testing.T) {
	defer func() {
		if r := recover(); r == nil {
			t.Logf("The code did not panic")
			t.Fail()
		}
	}()

	username, passwd := utils.GetCreds("/e-creds")
	fmt.Println(username + " " + passwd)
}

func TestNormaliseTime(t *testing.T) {

	_, err := utils.NormaliseTime("2006-01-02T00:00:00Z")
	if err != nil {
		t.Logf("Expected a date to be returned, not an error")
		t.Fail()
	}
}

func TestNormaliseTimeWrongFormat(t *testing.T) {
	now := time.Now().Local()
	now.Format("04-02-1991")
	_, err := utils.NormaliseTime(now.String())
	if err == nil {
		t.Logf("Expected an error, did't get one")
		t.Fail()
	}
}

func TestCheckFilename(t *testing.T) {
	_, err := utils.CheckFilename("filename.jpg")
	if err != nil {
		t.Logf("Expected a filename to be returned, not an error")
		t.Fail()
	}
}

func TestWrongFilename(t *testing.T) {
	_, err := utils.CheckFilename("filename.png")
	if err == nil {
		t.Logf("Expected an error, did't get one")
		t.Fail()
	}
}

func TestUserValidity(t *testing.T) {
	valid := utils.CheckUserValidity("test@tester.com", "Test", "Tester")
	if !valid {
		t.Logf("Valid data is shown as not valid")
		t.Fail()
	}
}

func TestUserNotValid(t *testing.T) {
	valid := utils.CheckUserValidity("testtester.com", "Test", "Tester")
	if valid {
		t.Logf("Invalid data is shown as valid")
		t.Fail()
	}
}

func TestPasswordValidity(t *testing.T) {
	valid := utils.CheckPasswordValidity("ThisisaPassword123*")
	if !valid {
		t.Logf("Valid data is shown as not valid")
		t.Fail()
	}
}

func TestPasswordNotValid(t *testing.T) {
	valid := utils.CheckPasswordValidity("Password123")
	if valid {
		t.Logf("Invalid data is shown as valid")
		t.Fail()
	}
}

func TestCabinValiditiy(t *testing.T) {
	valid := utils.CheckCabinValidation("Utsikten", "Tunvegen 11", 60.13, 10.23441, "Kjør hitover da", "Dette er en lang beskrivelse, tro det eller ei.", "Dette er en kort beskrivelse", 1200, 1200, 2, 5, 10)
	if !valid {
		t.Logf("Valid data is shown as not valid")
		t.Fail()
	}
}

func TestCabinNotValid(t *testing.T) {
	valid := utils.CheckCabinValidation("", "Tunvegen 11", 60.13, 10.23441, "Kjør hitover da", "Dette er en lang beskrivelse, tro det eller ei.", "Dette er en kort beskrivelse", 1200, 1200, 2, 5, 10)
	if valid {
		t.Logf("Invalid data is shown as valid")
		t.Fail()
	}
}

func TestFAQValidity(t *testing.T) {
	valid := utils.CheckFAQValidation("Hva er meningen med livet?", "42")
	if !valid {
		t.Logf("Valid data is shown as not valid")
		t.Fail()
	}
}

func TestFAQNotValid(t *testing.T) {
	valid := utils.CheckFAQValidation("Hva er meningen med livet?", "")
	if valid {
		t.Logf("Invalid data is shown as valid")
		t.Fail()
	}
}

func TestAdminEmailValidity(t *testing.T) {
	valid := utils.CheckAdminEmailValidation("test@tester.com")
	if !valid {
		t.Logf("Valid data is shown as not valid")
		t.Fail()
	}
}

func TestAdminEmailNotValid(t *testing.T) {
	valid := utils.CheckAdminEmailValidation("test@testercom")
	if valid {
		t.Logf("Invalid data is shown as valid")
		t.Fail()
	}
}
