// Generated by Selenium IDE
// Modified to conform to Jest instead of Mocha
const webdriver = require('selenium-webdriver')
const { By } = require('selenium-webdriver')
const { until } = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome')
const chromedriver = require('chromedriver')
const assert = require('assert')

chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build())

describe('FinanceTest', () => {
  let driver
  let vars
  beforeEach(async () => {
    driver = await new webdriver.Builder()
      .forBrowser('chrome')
      .setChromeOptions(
        new chrome.Options().addArguments([
          '--headless',
          '--no-sandbox',
          '--disable-dev-shm-usage',
        ]),
      )
      .build()
    vars = {}
  })
  afterEach(async () => {
    await driver.quit()
  })
  it('FinanceTest', async () => {
    await driver.get('https://bikerr.herokuapp.com/auth/login')
    await driver.manage().window().setRect(1098, 678)
    await driver.findElement(By.name('email')).click()
    await driver.findElement(By.name('email')).sendKeys('admin@gmail.com')
    await driver.findElement(By.name('password')).click()
    await driver.findElement(By.name('password')).sendKeys('12345678')
    await driver.findElement(By.css('.my-4')).click()
    // await driver.findElement(By.css(".nav-item:nth-child(4) > .nav-link")).click()
    await driver.close()
  })
})
