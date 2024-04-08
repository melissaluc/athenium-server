const puppeteer = require('puppeteer');
require('dotenv').config();

//  Import user UI inputs & backenddb : body weight, gender, age, exercise, lift weight, reps 

// Define an async function to use async/await syntax
(async () => {
    // Launch a new browser instance
    const browser = await puppeteer.launch();

    // Open a new page
    const page = await browser.newPage();

    // Navigate to a URL
    await page.goto(process.env.StrengthCalc_URL);
    
    // Set the viewport size
    await page.setViewport({ width: 900, height: 1200 });

    await page.waitForSelector("div.calculator *", { timeout: 5000 })

    // await page.waitForSelector("div.calculator__form div.control-modal");
    const exercisesButton = await page.$("div.calculator__form div.control--modal");
    await exercisesButton.click();


    while (true) {
        // Find the "load more" button
        const loadMoreButton = await page.$('.card .card-content button.is-fullwidth-mobile');
    
        // If the button is not found, exit the loop
        if (!loadMoreButton) {
            console.log("Load more button not found. Exiting the loop.");
            break;
        }
    
        // Evaluate the button's text within the page context
        const buttonText = await page.evaluate(button => button.innerText.trim(), loadMoreButton);
    
        // Check if the button text indicates that it's still loading
        if (buttonText.includes("Loading")) {
            console.log("Loading... Waiting for the button to become clickable.");
            
            // Wait for some time before checking again (adjust as needed)
            await page.evaluate(() => {
                return new Promise(resolve => {
                  setTimeout(resolve, 2000);
                });
              });
            continue; // Continue to the next iteration of the loop
        }
    
        // Check if the button text indicates that more exercises can be loaded
        const buttonStatus = await loadMoreButton.evaluate(button => button.disabled) || false
        if (buttonText === "More Exercises..." && !buttonStatus) {
            console.log("Getting more exercises...");
            
            // Click the "load more" button
            await loadMoreButton.click();
    
            // Wait for some time for the exercises to load (adjust as needed)
            await page.waitForSelector(".modal-card-body *");
    
            // Add any additional logic here as needed
        } else {
            // If the button text indicates that all exercises are loaded or it's disabled, exit the loop
            console.log("All exercises loaded or button disabled. Exiting the loop.");
            break;
        }

    }

    const exerciseElements = await page.$$("div.calculator div.modal-card section.modal-card-body div.card a.card-content span.media span.media-content");

    const exercisePairs = await Promise.all(exerciseElements.map(async exerciseElement => {

        const bodyPartElement = await exerciseElement.$("span:nth-child(2)")
        const exerciseNameElement = await exerciseElement.$("span:first-child")

        const bodyPart = await bodyPartElement.evaluate(element=> element.innerText)
        const exerciseName = await exerciseNameElement.evaluate(element=> element.innerText);
        return { bodyPart, exerciseName };
    }));
    
    const tabularData = exercisePairs.reduce((acc, { bodyPart, exerciseName }) => {
        if (!acc[bodyPart]) {
            acc[bodyPart] = [exerciseName];
        } else {
            acc[bodyPart].push(exerciseName);
        }
        return acc;
        
    }, {});

    console.log(tabularData)
    
    const deleteButton = await page.$('button.delete');
    await deleteButton.click();

    // Wait for the age input field to be visible and then type in the age
    await page.waitForSelector('div.calculator__form input[name="ageyears"]');
    await page.type('div.calculator__form input[name="ageyears"]', '20');

    // Wait for the age input field to be visible and then type in the age
    await page.waitForSelector('div.calculator__form select#gender');
    await page.type('div.calculator__form select#gender', 'female');

    // Wait for the body mass input field to be visible and then type in the body mass
    await page.waitForSelector('div.calculator__form input[name="bodymass"]');
    await page.type('div.calculator__form input[name="bodymass"]', '100');

    // Wait for the lift mass input field to be visible and then type in the lift mass
    await page.waitForSelector('div.calculator__form input[name="liftmass"]');
    await page.type('div.calculator__form input[name="liftmass"]', '500');

    // Wait for the repetitions input field to be visible and then type in the number of repetitions
    await page.waitForSelector('div.calculator__form input[name="repetitions"]');
    await page.type('div.calculator__form input[name="repetitions"]', '1');



    const exerciseValue = tabularData.Chest[5].toLowerCase().replace(/ /g, "-");

    await page.evaluate((value) => {
        document.querySelector('div.calculator__form input[name="exercise"]').value = value;
    }, exerciseValue);

    
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


