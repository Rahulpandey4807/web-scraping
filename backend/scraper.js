const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const TARGET_URL = process.env.TARGET_URL || 'https://result.rgpv.ac.in/Result/BErslt.aspx';

/**
 * Fetches the result for a single roll number and semester using Selenium.
 * @param {string} rollNumber - The roll number to fetch the result for (e.g., 0105IT211093).
 * @param {number} semester - The semester to fetch the result for.
 * @returns {Promise<string>} - The result (e.g., "8.5" or "9.15").
 */
async function fetchResult(rollNumber, semester) {
    let driver;
    try {
        // Configure Selenium to use Chrome in headless mode
        const options = new chrome.Options();
        options.addArguments('--headless'); // Run in headless mode
        options.addArguments('--disable-gpu'); // Disable GPU for headless mode
        options.addArguments('--no-sandbox'); // Disable sandbox for headless mode
        options.addArguments('--disable-dev-shm-usage'); // Disable shared memory usage for headless mode

        // Initialize the WebDriver
        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();

        // Navigate to the target website
        await driver.get(TARGET_URL);

        // Wait for the roll number input field to load
        await driver.wait(until.elementLocated(By.id('ctl00_ContentPlaceHolder1_txtrollno')), 15000);

        // Enter roll number
        await driver.findElement(By.id('ctl00_ContentPlaceHolder1_txtrollno')).sendKeys(rollNumber);

        // Wait for the semester dropdown to load
        await driver.wait(until.elementLocated(By.id('ctl00_ContentPlaceHolder1_drpSemester')), 15000);

        // Select semester
        const semesterDropdown = await driver.findElement(By.id('ctl00_ContentPlaceHolder1_drpSemester'));
        await semesterDropdown.sendKeys(semester.toString());

        // Wait for the "View Result" button to load
        await driver.wait(until.elementLocated(By.id('ctl00_ContentPlaceHolder1_btnviewresult')), 15000);

        // Click the "View Result" button
        await driver.findElement(By.id('ctl00_ContentPlaceHolder1_btnviewresult')).click();

        // Wait for the result to load (increase timeout to 30 seconds)
        await driver.wait(until.elementLocated(By.id('ctl00_ContentPlaceHolder1_lblCGPA')), 30000);

        // Extract the result
        const resultElement = await driver.findElement(By.id('ctl00_ContentPlaceHolder1_lblCGPA'));
        const result = await resultElement.getText();

        return result || 'Result not found';
    } catch (error) {
        console.error(`Error fetching result for roll number ${rollNumber} (Semester ${semester}):`, error.message);
        return 'Error fetching result';
    } finally {
        if (driver) {
            await driver.quit(); // Close the browser
        }
    }
}

module.exports = { fetchResult };