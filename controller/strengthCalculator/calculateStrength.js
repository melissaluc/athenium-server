const puppeteer = require('puppeteer');
require('dotenv').config();
const fs = require("fs");


// Define an async function to use async/await syntax
(async (ageYears, gender, bodyMass, liftMass, reps, exerciseName) => {
    // Launch a new browser instance
    const browser = await puppeteer.launch();

    // Open a new page
    const page = await browser.newPage();

    // Navigate to a URL
    await page.goto(process.env.StrengthCalc_URL);

    // Set the viewport size
    await page.setViewport({ width: 900, height: 1200 });
    
    await page.waitForSelector("div.calculator *", { timeout: 5000 })

    // Wait for the age input field to be visible and then type in the age
    await page.waitForSelector('div.calculator__form input[name="ageyears"]');
    await page.type('div.calculator__form input[name="ageyears"]', ageYears);

    // Wait for the age input field to be visible and then type in the age
    await page.waitForSelector('div.calculator__form select#gender');
    await page.type('div.calculator__form select#gender', gender);

    // Wait for the body mass input field to be visible and then type in the body mass
    await page.waitForSelector('div.calculator__form input[name="bodymass"]');
    await page.type('div.calculator__form input[name="bodymass"]', bodyMass);

    // Wait for the lift mass input field to be visible and then type in the lift mass
    await page.waitForSelector('div.calculator__form input[name="liftmass"]');
    await page.type('div.calculator__form input[name="liftmass"]', liftMass);

    // Wait for the repetitions input field to be visible and then type in the number of repetitions
    await page.waitForSelector('div.calculator__form input[name="repetitions"]');
    await page.type('div.calculator__form input[name="repetitions"]', reps);

    // Select exercise to evaluate strength level for
    const exerciseValue = exerciseName.toLowerCase().replace(/ /g, "-");
    await page.evaluate((value) => {
        document.querySelector('div.calculator__form input[name="exercise"]').value = value;
    }, exerciseValue);

    // Submit form to generate calculated result
    await page.waitForSelector('button[type="submit"]')
    const submitButton = await page.$('button[type="submit"]')
    await submitButton.click()

    
    // Wait for the liftresult section to appear after the page reloads
    try {
        await page.waitForSelector('.section-box.liftresult', { timeout: 10000 });
        const result = await page.evaluate(()=>{
            const oneRepMax = document.querySelector('.section-box.liftresult div#liftResults .content').innerText.match(/\b\d+(\.\d+)?\b/g)[0];
            const compare = document.querySelector('.section-box.liftresult div#liftResults div.columns > :first-child p strong').innerText.match(/\b\d+(\.\d+)?\b/g)[0];
            const lift = document.querySelector('.section-box.liftresult div#liftResults div.columns > :last-child p strong').innerText.match(/\b\d+(\.\d+)?\b/g)[0];
            // Extract table headers
            const strengthBoundsTableCols = Array.from(document.querySelectorAll('.section-box.liftresult .liftresult__standards table thead tr th'));
            const strengthBoundsTableRows = Array.from(document.querySelectorAll('.section-box.liftresult .liftresult__standards table tbody tr td'));
            const headers = strengthBoundsTableCols.map(th => th.textContent.replace(/['".]/g, "").trim());
            const rows = strengthBoundsTableRows.map(tr => parseInt(tr.textContent.replace(/['".]/g, "").trim()));
            const zipped = headers.map((header, index) => [header, rows[index]])
            const strengthBounds = Object.fromEntries(zipped);

            return {oneRepMax: parseFloat(oneRepMax), strongerThanPercent: parseFloat(compare), xBW: parseFloat(lift), strengthBounds: strengthBounds}
        })
        console.log(result)
    } catch (err) {
        console.log(err)
        await browser.close();
    }
    
    // Close the browser
    await browser.close();
})();


