// Generated by Selenium IDE
// Modified to conform to Jest instead of Mocha
var webdriver = require('selenium-webdriver')
var By = require('selenium-webdriver').By,
  until = require('selenium-webdriver').until,
  chrome = require('selenium-webdriver/chrome'),
  chromedriver = require('chromedriver');
const assert = require('assert');

chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());

describe('LoginTest', () => {
    let driver
    let vars
  beforeEach(async () => {
    driver = await new webdriver.Builder().forBrowser('chrome').setChromeOptions(new chrome.Options().addArguments(['--no-sandbox'])).build()
    vars = {}
  })
  afterEach(async () => {
    await driver.quit();
  })
  it('LoginTest', async () => {
    await driver.get("https://bikker.herokuapp.com/auth/login")
    await driver.manage().window().setRect(1098, 678)
    await driver.findElement(By.name("email")).click()
    await driver.findElement(By.name("email")).sendKeys("admin@gmail.com")
    await driver.findElement(By.name("password")).click()
    await driver.findElement(By.name("password")).sendKeys("12345678")
    await driver.findElement(By.css(".my-4")).click()
    await driver.close()
  })
})
