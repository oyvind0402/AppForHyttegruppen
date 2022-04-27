const { Key, Builder } = require("selenium-webdriver");
const webdriver = require("selenium-webdriver");
const { By, until } = require("selenium-webdriver");
const { Options } = require("selenium-webdriver/chrome");
const assert = require("assert");
require("chromedriver");

/*
As a user I want to add and remove requests for one or more cabins for one or more timespans.
As a user I want to be able to make a prioritized list.
As a user I want to be able to find important information regarding the rental of the cabin.
As a user I want to be able to send feedback after the stay.
*/

async function informationRegaringRental() {
  //This disables the logging of chrome so we get less noice in the logg
  let chromeOptions = new Options();
  chromeOptions.excludeSwitches("enable-logging");
  let driver = new webdriver.Builder().withCapabilities(chromeOptions).build();

  try {
    //Navigate to the website
    await driver.get("http://localhost:3000/");
    //wait until element is visible
    await driver.wait(
      until.elementIsVisible(driver.findElement(By.className("home-h2"))),
      10000
    );
    await driver.findElement(By.linkText("FAQ")).click(); //Click on FAQ

    await driver.wait(
      until.elementIsVisible(driver.findElement(By.className("FAQs"))),
      10000
    );

    //Open the first question
    driver
      .findElement(By.xpath('//*[@id="root"]/main/div/div[2]/div[1]'))
      .click();
    //Get text of question
    let question = await driver
      .findElement(By.xpath('//*[@id="root"]/main/div/div[2]/div[1]/div[1]'))
      .getText();

    console.log(question);

    let anwser = await driver.findElement(
      By.xpath('//*[@id="root"]/main/div/div[2]/div[1]')
    );
    console.log(anwser);
  } catch (e) {
    //in case of an error
    console.log("Error: ", e.message);
  }
  await driver.quit();
}

async function informationRegaringCabin() {}

async function informationRegardingHemsedal() {}

async function example() {
  //This disables the logging of chrome so we get less noice in the logg
  let chromeOptions = new Options();
  chromeOptions.excludeSwitches("enable-logging");

  let driver = new webdriver.Builder().withCapabilities(chromeOptions).build();

  try {
    //Navigate to the website
    await driver.get("http://localhost:3000/");
    //wait until element is visible
    await driver.wait(
      until.elementIsVisible(driver.findElement(By.className("home-h2"))),
      10000
    );

    //Click on FAQ
    await driver.findElement(By.linkText("FAQ")).click();
  } catch (e) {
    //in case of an error
    console.log("Error: ", e.message);
  }
  //await driver.quit();
}

informationRegaringRental();
