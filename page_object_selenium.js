const { Builder } = require('selenium-webdriver');
const LoginPage = require('./loginpage');
const DashboardPage = require('./dashboardpage');
const assert = require('assert');
const fs = require('fs');
const { Options } = require('selenium-webdriver/ie');
const screenshotdir = './screenshots/';
require('dotenv').config();

const browser = process.env.BROWSER;
const firefox = process.env.FIREFOX;
const base_url = process.env.BASE_URL;
const username = process.env.USER_NAME;
const password = process.env.PASSWORD;


if(!fs.existsSync(screenshotdir)){
    fs.mkdirSync(screenshotdir,{recursive:true});
}

describe('Saucedemo Test', function () {
    this.timeout(30000);
    let driver;


    switch (browser.toLowerCase()) {
        case 'chrome':
            const chrome = require('selenium-webdriver/chrome');
            options = new chrome.Options();
            options.addArguments('--headless');
            break;
        case 'firefox':
            const firefox = require('selenium-webdriver/firefox');
            options = new firefox.Options();
            options.addArguments('--headless');
            break;
        case 'edge':
            const edge = require('selenium-webdriver/edge');
            options = new edge.Options();
            options.addArguments('--headless');
            break;
    }

    before(async function () {
        driver = await new Builder().forBrowser(firefox).setFirefoxOptions(options).build();
    
    });

    beforeEach(async function () {
        const loginpage = new LoginPage(driver);
        const dashboardpage = new DashboardPage(driver);
        await loginpage.navigate(base_url);
        await loginpage.login(username,password);
        await dashboardpage.addchart();
    });

    it('Validate item ke cart', async function () {
        const dashboardpage = new DashboardPage(driver);
        const error_message = await dashboardpage.getErrorMessages();
        assert.strictEqual(error_message, 'Pesanan Sudah dimasukan di keranjang','Ecpected title is error message');
    });

    afterEach(async function () {
        const screenshot = await driver.takeScreenshot();
        const filepath = `${screenshotdir}/${this.currentTest.title.replace(/\s+/g, '_')}_${Date.now()}.png`;
        fs.writeFileSync(filepath, screenshot, 'base64');
    });

    after(async function () {
        //await driver.quit();
    });
});