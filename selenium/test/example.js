const { Key, Builder } = require("selenium-webdriver");
const webdriver = require("selenium-webdriver");
const { By, until } = require("selenium-webdriver");
const { Options } = require("selenium-webdriver/chrome");
const assert = require("assert");
require("chromedriver");

//Link to setup https://www.lambdatest.com/blog/automation-testing-with-selenium-javascript/

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
      until.elementIsVisible(driver.findElemen(By.className("home-h2"))),
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

example();
