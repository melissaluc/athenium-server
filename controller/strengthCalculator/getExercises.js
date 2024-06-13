const puppeteer = require('puppeteer');
require('dotenv').config();
const fs = require("fs");

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
        const loadMoreButton = await page.$('button.is-fullwidth-mobile');
        
        // If the button is not found, exit the loop
        if (!loadMoreButton) {
            console.log("Load more button not found. Exiting the loop.");
            break;
        }
        
        // Evaluate the button's text within the page context      
        const buttonText = await page.evaluate(button => button.innerText.trim(), loadMoreButton);
        await page.screenshot({ path: 'example.png' });

        // Check if the button text indicates that it's still loading
        if (buttonText.includes("Loading")) {
            console.log("Loading... Waiting for the button to become clickable.");
            
            // Wait for some time before checking again (adjust as needed)
            await page.evaluate(() => {
                return new Promise(resolve => {
                  setTimeout(resolve, 8000);
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

        } else {
            // If the button text indicates that all exercises are loaded or it's disabled, exit the loop
            console.log("All exercises loaded or button disabled. Exiting the loop.");
            break;
        }

    }


    const exerciseElements = await page.$$("section.modal-card-body.is-paddingless > div:first-child span.media-content");

    const exercisePairs = await Promise.all(exerciseElements.map(async exerciseElement => {
        const exerciseElementHTML = await page.evaluate(element => element.outerHTML, exerciseElement)
        console.log("\n",exerciseElementHTML)

        const regex = /<span class="mr-1">([^<]+)<\/span>\s*<span class="tag is-small">([^<]+)<\/span>/;
        const match = exerciseElementHTML.match(regex);

        if (match) {
            const exerciseName = match[1].trim();
            const bodyPart = match[2].trim();
            console.log("Exercise Name:", exerciseName);
            console.log("Body Part:", bodyPart);
            return { exerciseName, bodyPart };
          } else {
            console.log("No match found.");
            
          }

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

    
    // TODO: verify tabularData for completeness
    console.log(tabularData)
    // const data = JSON.stringify(tabularData)
    // // writing the JSON string content to a file
    // fs.writeFile("workouts_data.json", data, (error) => {
    //     // throwing the error
    //     // in case of a writing problem
    //     if (error) {
    //     // logging the error
    //     console.error(error);
    
    //     throw error;
    //     }
    
    //     console.log("data.json written correctly");
    // });
    

    await browser.close();
})();


