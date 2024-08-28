const puppeteer = require("puppeteer");
require("dotenv").config();
const fs = require("fs");

const verifyFieldValue = async (page, selector, expectedValue) => {
  const value = await page.$eval(selector, el => el.value);
  if (value !== expectedValue) {
    throw new Error(`Field ${selector} was not filled correctly. Expected "${expectedValue}", but got "${value}".`);
  }
  console.log(`Field ${selector} is correctly filled with "${expectedValue}".`);
};


const scrollToAnyElement = async (page, selectors, maxRetries = 5, timeout = 60000) => {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
      for (const selector of selectors) {
          try {
              // Scroll into view
              await page.evaluate(selector => {
                  const element = document.querySelector(selector);
                  if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
              }, selector);

              await page.waitForSelector(selector, { visible: true, timeout });

              console.log(`Successfully scrolled to and found the element: ${selector}`);
              return; 

          } catch (error) {
              console.log(`Attempt ${attempt + 1} failed for selector ${selector}: ${error.message}`);

              if (selector === selectors[selectors.length - 1] && attempt === maxRetries - 1) {
                  throw new Error(`Failed to find or scroll to any of the elements ${selectors.join(', ')} after ${maxRetries} attempts.`);
              }
          }
      }
      }}
// Wait for all form elements to fully load

// Safely interact with them, clear input values: age, bodyweight, lift, and reps
// Implement verify & retry 

// Define an async function to use async/await syntax
const retrieveStrengthLevel = async (
  ageYears,
  gender,
  bodyMass,
  liftMass,
  reps,
  exerciseName,
  lift_uom,
  body_mass_uom
) => {


  // Launch a new browser instance
  let browser

  if (process.env.BROWSER_WS_ENDPOINT) {
    const launchArgs = JSON.stringify({ stealth: true });
    browser = await puppeteer.connect({
      browserWSEndpoint: `${process.env.BROWSER_WS_ENDPOINT}&launch=${launchArgs}`,
      defaultViewport: { width: 900, height: 1200 },
      timeout: 60000 
    });
  }
  else {
    browser = await puppeteer.launch({
      headless: true, 
      executablePath: process.env.NODE_ENV === 'production' 
        ? process.env.PUPPETEER_EXECUTABLE_PATH 
        :puppeteer.executablePath,
      args: ["--no-sandbox", 
        "--disable-setuid-sandbox", 
        '--enable-gpu', 
        '--single-process',
        '--no-zygote'],
      ignoreDefaultArgs: ['--disable-extensions'],
      defaultViewport: { width: 900, height: 1200 },
    });
  }
  
  // const browser = await puppeteer.launch({ headless: false });
  
  // Open a new page
  console.log("Opening a new page...");
  const page = await browser.newPage();
  
  const version = await browser.version();
  console.log('Puppeteer version:', version);

  // await page.setDefaultNavigationTimeout(60000); 
  try{
    // Navigate to a URL
    console.log('Navigating to:', process.env.StrengthCalc_URL);
    await page.goto(process.env.StrengthCalc_URL, { waitUntil: 'domcontentloaded', timeout: 100000 });
    console.log("Navigation successful!");
  } catch(error) {
    console.log('Error during navigation or viewport setting:', error);
    
  }
  try {
    const selectors = {
      formContainer:"div.calculator *",
      ageInput:'div.calculator__form input[name="ageyears"]',
      bodyMassInput:'div.calculator__form input[name="bodymass"]',
      liftMassInput:'div.calculator__form input[name="liftmass"]',
      repsInput:'div.calculator__form input[name="repetitions"]',
      exerciseSelector:'div.calculator__form input[name="exercise"]',
      genderSelector:"div.calculator__form select#gender",
      liftMassUOMSelector:'div.calculator__form select[name="liftmassunit"]',
      bodyMassUOMSelector:'div.calculator__form select[name="bodymassunit"]',
      submitButton:'button[type="submit"]',
      resultsContainer:".section-box.liftresult",
    }
    const formContainer = await page.waitForSelector("div.calculator *", { visible: true, timeout: 100000 });
    const ageInput = await page.waitForSelector('div.calculator__form input[name="ageyears"]', { visible: true, timeout: 10000 });
    const genderInput = await page.waitForSelector("div.calculator__form select#gender",{ visible: true, timeout: 10000 });
    const bodyWeightUnitInput = await page.waitForSelector('div.calculator__form select[name="bodymassunit"]' ,{ visible: true, timeout: 10000 });
    const liftUnitInput = await page.waitForSelector('div.calculator__form select[name="liftmassunit"]',{ visible: true, timeout: 10000 });
    const bodyMassInput = await page.waitForSelector('div.calculator__form input[name="bodymass"]',{ visible: true, timeout: 10000 });
    let liftMassInput;
    try {
      console.log('Filling in lift mass...')
      liftMassInput = await page.waitForSelector('div.calculator__form input[name="liftmass"]', { visible: true, timeout: 10000 });
    } catch (error) {
      console.log('liftMass input not found, proceeding with variationInput and extraMassInput.');
    }
    const repsInput = await page.$('div.calculator__form input[name="repetitions"]',{ visible: true, timeout: 10000 });

 
    await page.type('div.calculator__form input[name="ageyears"]', ageYears.toString());
    if (!ageInput) {
      throw new Error(`Selector ${ageInput} not found`);
    } else {
      console.log('Age input filled.');
    }
    
    // Wait for the gender input field to be visible and then select  gender
    console.log('Selecting gender...')
    await page.select("div.calculator__form select#gender", gender);
    if (!genderInput) {
      throw new Error(`Selector ${genderInput} not found`);
    } else {
      console.log('Gender selected.');
    }
    // Wait for the weight unit input field to be visible and then select unit
    console.log('Selecting body mass unit...')
    await page.select('div.calculator__form select[name="bodymassunit"]', body_mass_uom.toString());
    if (!bodyWeightUnitInput) {
      throw new Error(`Selector ${bodyWeightUnitInput} not found`);
    } else {
      console.log('Body mass unit selected.');
    }
    
    // Wait for the weight unit input field to be visible and then select unit
    console.log('Selecting lift mass unit...')
    await page.select('div.calculator__form select[name="liftmassunit"]', lift_uom.toString());
    if (!liftUnitInput) {
      throw new Error(`Selector ${liftUnitInput} not found`);
    } else {
      console.log('Lift mass unit selected.');
    }
    // Wait for the body mass input field to be visible and then type in the body mass
    console.log('Filling in body mass...')
    await page.type('div.calculator__form input[name="bodymass"]', bodyMass.toString());
    if (!bodyMassInput) {
      throw new Error(`Selector ${bodyMassInput} not found`);
    } else {
      console.log('Body mass filled.');
    }

// Check if liftMass is available, if not, proceed with variationInput and extraMassInput

if (liftMassInput) {
    await page.type('div.calculator__form input[name="liftmass"]', liftMass.toString());
    console.log('Filling in lift mass...')
} else {
    // Proceed with variationInput
    const variationInput = await page.waitForSelector('div.calculator__form select[name="variation"]',{ visible: true, timeout: 10000 });
    await page.select('div.calculator__form select[name="variation"]', 'weighted');

    // Proceed with extraMassInput
    const extraMassInput = await page.waitForSelector('div.calculator__form input[name="extramass"]',{ visible: true, timeout: 10000 });
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

    await page.screenshot({ path: 'filled_form.png', fullPage: true });
    // Submit form to generate calculated result
    const submitButton = await page.waitForSelector('button[type="submit"]', { visible: true, timeout: 10000 });

    // Adjust the z-index of the submit button
    await page.evaluate(() => {
      const button = document.querySelector('button[type="submit"]');
      if (button) {
        button.style.zIndex = '1000'; // Set your desired z-index value here
        button.scrollIntoView({ behavior: 'smooth', block: 'center' });
        console.error('Button found.');
      } else {
        console.error('Submit button not found on the page.');
      }
    });


    await page.screenshot({ path: 'before-click.png', fullPage: true });
    await submitButton.click({ clickCount: 1 })


    
    await page.screenshot({ path: 'after-click.png', fullPage: true });
    
    // Wait for the liftresult section to appear after the page reloads
    const liftResult = await page.waitForSelector(".section-box.liftresult", { visible: true, timeout: 100000 });
    await page.screenshot({ path: 'liftResult.png', fullPage: true });


    if (!liftResult) {
      await submitButton.click({ clickCount: 3 })
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
