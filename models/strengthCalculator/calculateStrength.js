const puppeteer = require("puppeteer");
require("dotenv").config();
const fs = require("fs");

// Define an async function to use async/await syntax
const retrieveStrengthLevel = async (
  ageYears,
  gender,
  bodyMass,
  liftMass,
  reps,
  exerciseName
) => {

  
  // Launch a new browser instance
  const browser = await puppeteer.launch({
    headless: true, 
    executablePath: process.env.NODE_ENV === 'production' 
      ? process.env.PUPPETEER_EXECUTEABLE_PATH 
      :puppeteer.executablePath,
    args: ["--no-sandbox", 
      "--disable-setuid-sandbox", 
      '--enable-gpu', 
      '--single-process',
      '--no-zygote'],
    ignoreDefaultArgs: ['--disable-extensions'],
  });

  // const browser = await puppeteer.launch({ headless: false });
  // Open a new page
  const page = await browser.newPage();
  console.log('StrengthCalc_URL:', process.env.StrengthCalc_URL);
  await page.setDefaultNavigationTimeout(60000); 

  try {
    // Navigate to a URL
    await page.goto(process.env.StrengthCalc_URL);
    console.log("Navigation successful!");

    // Set the viewport size
    await page.setViewport({ width: 900, height: 1200 });

    await page.waitForSelector("div.calculator *", { timeout: 5000 });

    // Wait for the age input field to be visible and then type in the age
    const ageInput = await page.waitForSelector('div.calculator__form input[name="ageyears"]');
    await page.type('div.calculator__form input[name="ageyears"]', ageYears.toString());
    if (!ageInput) {
      throw new Error(`Selector ${ageInput} not found`);
    }

    // Wait for the gender input field to be visible and then select  gender
    const genderInput = await page.waitForSelector(
      "div.calculator__form select#gender"
    );
    await page.select("div.calculator__form select#gender", gender);
    if (!genderInput) {
      throw new Error(`Selector ${genderInput} not found`);
    }
    // Wait for the weight unit input field to be visible and then select unit
    const bodyWeightUnitInput = await page.waitForSelector(
      'div.calculator__form select[name="bodymassunit"]'
    );
    await page.select('div.calculator__form select[name="bodymassunit"]', "lb");
    if (!bodyWeightUnitInput) {
      throw new Error(`Selector ${bodyWeightUnitInput} not found`);
    }
    
    // Wait for the weight unit input field to be visible and then select unit
    const liftUnitInput = await page.waitForSelector(
      'div.calculator__form select[name="liftmassunit"]'
    );
    await page.select('div.calculator__form select[name="liftmassunit"]', "lb");
    if (!liftUnitInput) {
      throw new Error(`Selector ${liftUnitInput} not found`);
    }
    // Wait for the body mass input field to be visible and then type in the body mass
    const bodyMassInput = await page.waitForSelector(
      'div.calculator__form input[name="bodymass"]'
    );
    await page.type('div.calculator__form input[name="bodymass"]', bodyMass.toString());
    if (!bodyMassInput) {
      throw new Error(`Selector ${bodyMassInput} not found`);
    }

// Check if liftMass is available, if not, proceed with variationInput and extraMassInput
let liftMassInput;
try {
    liftMassInput = await page.waitForSelector('div.calculator__form input[name="liftmass"]', { timeout: 5000 });
} catch (error) {
    console.log('liftMass input not found, proceeding with variationInput and extraMassInput.');
}

if (liftMassInput) {
    await page.type('div.calculator__form input[name="liftmass"]', liftMass.toString());
} else {
    // Proceed with variationInput
    const variationInput = await page.waitForSelector('div.calculator__form select[name="variation"]');
    await page.select('div.calculator__form select[name="variation"]', 'weighted');

    // Proceed with extraMassInput
    const extraMassInput = await page.waitForSelector('div.calculator__form input[name="extramass"]');
    await page.type('div.calculator__form input[name="extramass"]', liftMass.toString());
    // Optional: Verify if variationInput and extraMassInput are present if needed
    if (!variationInput) {
        throw new Error(`Selector for variationInput not found`);
    }
    
    if (!extraMassInput) {
        throw new Error(`Selector for extraMassInput not found`);
    }
}


    // Wait for the repetitions input field to be visible and then type in the number of repetitions
    // Assuming 'reps' is a variable holding the value '15'
  const repsInput = await page.$('div.calculator__form input[name="repetitions"]');
  await repsInput.click({ clickCount: 3 }); // Select all text in the input field
  await repsInput.type('', { delay: 50 }); // Clear the input field by typing an empty string with a delay

  // Now input the new value
  await repsInput.type(parseInt(Math.floor(reps)).toString(), { delay: 50 });

    if (!repsInput) {
      throw new Error(`Selector ${repsInput} not found`);
    }

    // Select exercise to evaluate strength level for
    const exerciseValue = exerciseName.toLowerCase().replace(/ /g, "-");
    await page.evaluate((value) => {
      document.querySelector(
        'div.calculator__form input[name="exercise"]'
      ).value = value;
    }, exerciseValue);

    
    // Submit form to generate calculated result
    const submitButton = await page.waitForSelector('button[type="submit"]', { visible: true });

    // Adjust the z-index of the submit button
    await page.evaluate(() => {
      const button = document.querySelector('button[type="submit"]');
      if (button) {
        button.style.zIndex = '1000'; // Set your desired z-index value here
      } else {
        console.error('Submit button not found on the page.');
      }
    });

    await submitButton.click({ clickCount: 1 })
    // await submitButton.click({ clickCount: 3 })
    // await submitButton.click({ clickCount: 4 })
    
    
    // Wait for the liftresult section to appear after the page reloads
    const liftResult = await page.waitForSelector(".section-box.liftresult");
    if (!liftResult) {
      await submitButton.click({ clickCount: 2 })
      throw new Error(`Selector ${liftResult} not found`);
    }
    try {
      const result = await page.evaluate(() => {
        const oneRepMax = document
          .querySelector(".section-box.liftresult div#liftResults .content")
          .innerText.match(/\b\d+(\.\d+)?\b/g)[0];
        const compare = document
          .querySelector(
            ".section-box.liftresult div#liftResults div.columns > :first-child p strong"
          )
          .innerText.match(/\b\d+(\.\d+)?\b/g)[0];
        const lift = document
          .querySelector(
            ".section-box.liftresult div#liftResults div.columns > :last-child p strong"
          )
          .innerText.match(/\b\d+(\.\d+)?\b/g)[0];

        // Extract table headers
        const strengthBoundsTableCols = Array.from(
          document.querySelectorAll(
            ".section-box.liftresult .liftresult__standards table thead tr th"
          )
        );
        const strengthBoundsTableRows = Array.from(
          document.querySelectorAll(
            ".section-box.liftresult .liftresult__standards table tbody tr td"
          )
        );
        const headers = strengthBoundsTableCols.map((th) =>
          th.textContent.replace(/['".]/g, "").trim().toLowerCase()
        );

        let strengthLevel = null;
        let next_strength_level = null;
        const rows = strengthBoundsTableRows.map((td, index) => {
            // Check the class name of the current <td> element
            if (td.className === " has-background-tablehighlight") {
                switch(index){
                    case 1:
                        strengthLevel='beginner'
                        next_strength_level='novice'
                        break;
                    case 2:
                        strengthLevel='novice'
                        next_strength_level='intermediate'
                        break;
                    case 3:
                        strengthLevel='intermediate'
                        next_strength_level='advanced'
                        break;
                    case 4:
                        strengthLevel='advanced'
                        next_strength_level='elite'
                        break;
                    case 5:
                        strengthLevel='elite'
                        break;
                    default:
                        strengthLevel=null; 
                        next_strength_level = null;
                        break;
                }
                return parseInt(td.textContent.replace(/['".]/g, "").trim());
            } else {

                return parseInt(td.textContent.replace(/['".]/g, "").trim());
            }
        });
        
        const zipped = headers.map((header, index) => [header, rows[index]]);
        const strengthBounds = Object.fromEntries(zipped);
        const body_weight = strengthBounds.bw
        delete strengthBounds.bw 

        const keysMap = {'beg':'beginner','nov':'novice','int':'intermediate','adv':'advanced'}


        const renamedObj = {};
        Object.keys(strengthBounds).forEach(key => {
            if (keysMap[key]) {
                renamedObj[keysMap[key]] = strengthBounds[key];
            } else {
                renamedObj[key] = strengthBounds[key];
            }
        });

        return {
            strengthLevel,
            next_strength_level,
            body_weight,
            one_rep_max: parseFloat(oneRepMax),
            relative_strength_demographic: parseFloat(compare),
            relative_strength: parseFloat(lift),
            strengthBounds: renamedObj
        };
      });
      console.log(result);
      return result;
    } catch (err) {
      console.log(err);
      await browser.close();
    }
  } catch (error) {
    console.error("Error during strength calculation:", error);
    throw error;
  } finally {
    // Close the browser
    await browser.close();
  }
};

module.exports = {
  retrieveStrengthLevel,
};
