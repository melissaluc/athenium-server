require("dotenv").config();
const { error } = require("console");
const puppeteer = require(`puppeteer-extra`);
const pluginStealth = require(`puppeteer-extra-plugin-stealth`)(); // https://github.com/berstend/puppeteer-extra/tree/master/packages/puppeteer-extra-plugin-stealth
pluginStealth.enabledEvasions.delete(`chrome.runtime`);
pluginStealth.enabledEvasions.delete(`iframe.contentWindow`);
console.log(pluginStealth.availableEvasions);
puppeteer.use(pluginStealth)

const launchBrowser = async (url) => {
  let browser;
  if (process.env.BROWSER_WS_ENDPOINT) {
    browser = await puppeteer.connect({
      browserWSEndpoint: process.env.BROWSER_WS_ENDPOINT,
      defaultViewport: { width: 900, height: 1200 },
      timeout: 60000 
    });
  } else {
    browser = await puppeteer.launch({
      headless: false,
      devtools: false,
      timeout: 60000,
      slowMo: 0,

      ignoreHTTPSErrors: true,
      defaultViewport: null,

      pipe: false,
      dumpio: false,

      handleSIGINT: true,
      handleSIGTERM: true,
      handleSIGHUP: true,

      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--ignore-certificate-errors',
        '--disable-infobars',
        '--disable-notifications',
        '--disable-dev-shm-usage',
        '--disable-extensions',
        '--window-size=1920,1080',
        '--disable-gpu',
      ],
      defaultViewport: { width: 900, height: 1200 },
    });
  }
  console.log("Launched browser...");

  const page = await browser.newPage();
  console.log("Opened a new page...");
  await page.setRequestInterception(true);

  // page.on('request', (request) => {
  //   const url = request.url();
    
  //   if (url.startsWith(process.env.StrengthCalc_URL)) {
  //     console.log('Allowing request to:', url); 
  //     request.continue(); 
  //   } else {
  //     console.log('Blocking request to:', url); 
  //     request.abort(); 
  //   }
  // });


  page.on('request', (request) => {
    const url = request.url();
    // Block image requests
    if (request.resourceType() === 'image') {
      request.abort();
    } 
    // Block requests for known ad URLs (you can add more specific patterns)
    else if (
      url.includes('ads') || 
    url.includes('advertisement') || 
    url.includes('prebid')
    // url.includes('google') || 
    // url.includes('amazon') 
  ) {
      request.abort();
    } 
    else {
      request.continue();
    }
  });
  const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.75 Safari/537.36';
  await page.setUserAgent(userAgent);

   // Custom browser behaviors
   await page.evaluateOnNewDocument(() => {
    const customRTC = (target) => {
      console.log(`customRTC ${target}`);
      return undefined;
    };
    window.__defineGetter__('MediaStreamTrack', () => customRTC('window.MediaStreamTrack'));
    window.__defineGetter__('RTCPeerConnection', () => customRTC('window.RTCPeerConnection'));
    window.__defineGetter__('RTCSessionDescription', () => customRTC('window.RTCSessionDescription'));
    window.__defineGetter__('webkitMediaStreamTrack', () => customRTC('window.webkitMediaStreamTrack'));
    window.__defineGetter__('webkitRTCPeerConnection', () => customRTC('window.webkitRTCPeerConnection'));
    window.__defineGetter__('webkitRTCSessionDescription', () => customRTC('window.webkitRTCSessionDescription'));
    navigator.mediaDevices.__defineGetter__('getUserMedia', () => customRTC('navigator.mediaDevices.getUserMedia'));
    navigator.__defineGetter__('webkitGetUserMedia', () => customRTC('navigator.webkitGetUserMedia'));
    navigator.__defineGetter__('getUserMedia', () => customRTC('navigator.getUserMedia'));

    const fnSW = () => {};
    navigator.serviceWorker.register = () => new Promise(fnSW, fnSW);
  });

  await page.on('dialog', async (dialog) => {
    await page.waitFor(Math.floor(Math.random() * 1000) + 1000);
    await dialog.accept();
  });
  


  try {
    console.log('Navigating to:', url);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 100000 });
    console.log("Navigation successful!");
    return { page, browser };
  } catch (error) {
    console.error('Error during navigation:', error);
    await browser.close();
    throw error;
  }
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const retry = async (fn, retries = 3, delay = 3000) => {
  let lastError;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await fn();
      return; 
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${attempt} failed:`, error.message);
      if (attempt < retries) {
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay)); 
      }
    }
  }
  throw lastError; 
};
const fillTextInput = async (page, selector, value, isHidden=false) => {
  try {
      console.log(`Attempting to fill in ${selector} with value ${value}`);


      const fillInput = async () => {
          const element = await page.waitForSelector(selector, { visible: !isHidden, timeout: 30000 });
        //   await page.waitForFunction(
        //     () => document.querySelector(selector).value !== null
        // );
          await page.evaluate((sel, val) => {
              const input = document.querySelector(sel);
              if(input.type==='hidden'){
                input.type='text'
              }
              if (input) {
                  input.value = ''; 
                  input.dispatchEvent(new Event('input', { bubbles: true })); 
                  input.value = val; 
                  input.dispatchEvent(new Event('input', { bubbles: true })); 
                  input.dispatchEvent(new Event('change', { bubbles: true }))
              }
          }, selector, value);

          console.log(`Input field ${selector} updated with value: ${value}`);

          // Wait for the value to be updated
          const valueUpdated = await page.waitForFunction(
            (sel, val) => {
                const input = document.querySelector(sel);
                return input && input.value === val;
            },
            { timeout: 60000 },
            selector,
            value
        );

        if (!valueUpdated) {
          throw new Error(`Failed to update input field ${selector} with value ${value} within the timeout period`);
      }

          // Verify the updated value
          const updatedValue = await page.evaluate(sel => document.querySelector(sel)?.value, selector);
          console.log(`Verified input field ${selector} has value: ${updatedValue}`);
      };

      await retry(fillInput, 3, 1000); // Retry up to 3 times with a 1-second delay
  } catch (err) {
      console.error(`Error filling text input ${selector}:`, err);
  }
};


const fillSelectInput = async (page, selector, value) => {
  try {
      console.log(`Selecting ${value} in ${selector}`);

      // Define the function to fill the select input
      const fillSelect = async () => {
          // Wait for the element to be present and visible
          await page.waitForSelector(selector, { visible: true, timeout: 30000 });

          // Set the value
          await page.evaluate((sel, val) => {
              const select = document.querySelector(sel);
              if (select) {
                  select.value = val;
                  select.dispatchEvent(new Event('change', { bubbles: true })); // Dispatch change event
              }
          }, selector, value);

          // Log the update
          console.log(`Select field ${selector} updated with value: ${value}`);

          // Wait for the value to be updated
          await page.waitForFunction(
              (sel, val) => document.querySelector(sel)?.value === val,
              { timeout: 60000 },
              selector,
              value
          );

          // Verify the updated value
          const updatedValue = await page.evaluate(sel => document.querySelector(sel)?.value, selector);
          console.log(`Verified select field ${selector} has value: ${updatedValue}`);
      };

      // Retry the fillSelect function if it fails with a TimeoutError
      await retry(fillSelect, 3, 1000); // Retry up to 3 times with a 1-second delay
  }  catch (err) {
    console.error(`Error filling select input ${selector}:`, err);
}
};

const fillFormField = async (page, field) => {
  const { targetName, selector, inputType, inputValue } = field;
  const stringInputValue = inputValue.toString()
  let isHidden = false
  if(targetName.includes('exercise')){
    isHidden = true
  }
  switch (inputType) {
    case 'text':
      await fillTextInput(page, selector, stringInputValue, isHidden);
      break;
    case 'select':
      await fillSelectInput(page, selector, stringInputValue);
      break;
    default:
      console.warn(`Unsupported input type ${inputType} for ${targetName}`);
  }
};


const retrieveStrengthLevel = async (
  ageYears=30, gender='female', bodyMass=130, liftMass=100, reps=12, exerciseName='Hip Thrust',
  lift_uom='lb', body_mass_uom='lb', extraWeight=null, extraWeight_uom=null,
  assistanceWeight=null, assistanceWeight_uom=null, variation=false
) => {
  const url = process.env.StrengthCalc_URL;
  const { page, browser } = await launchBrowser(url);

  const selectors = {
    formContainer: ".calculator__form",
    submitButton: 'button[type="submit"]',
    resultsContainer: "div.section-box.liftresult",
  };

  const exerciseNameValue = exerciseName.toLowerCase().replace(/ /g, "-");

  const formFields = [
    { targetName: 'gender-input', selector: "select#gender", inputType: 'select', inputValue: gender },
    { targetName: 'age-input', selector: 'input#ageyears', inputType: 'text', inputValue: ageYears },
    { targetName: 'body-mass-uom', selector: 'select[name="bodymassunit"]', inputType: 'select', inputValue: body_mass_uom },
    { targetName: 'body-mass-input', selector: 'input#bodymass', inputType: 'text', inputValue: bodyMass },
    { targetName: 'exercises-input', selector: 'input[name="exercise"]', inputType: 'text', inputValue: exerciseNameValue },
    { targetName: 'lift-mass-uom', selector: 'select[name="liftmassunit"]', inputType: 'select', inputValue: lift_uom },
    { targetName: 'lift-mass-input', selector: 'input#liftmass', inputType: 'text', inputValue: liftMass },
    { targetName: 'repetition-input', selector: 'input#repetitions', inputType: 'text', inputValue: reps },
    { targetName: 'variation-input', selector: 'select[name="variation"]', inputType: 'text', inputValue: variation },
    { targetName: 'assistance-weight-uom', selector: 'select[name="liftmassunit"]', inputType: 'select', inputValue: assistanceWeight_uom },
    { targetName: 'assistance-weight-input', selector: 'input#assistancemass', inputType: 'text', inputValue: assistanceWeight },
    { targetName: 'extra-weight-uom', selector: 'select[name="liftmassunit"]', inputType: 'select', inputValue: extraWeight_uom },
    { targetName: 'extra-weight-input', selector: 'input#extramass', inputType: 'text', inputValue: extraWeight },
  ];

  try {
    console.log('Waiting for form elements to load...');
    await page.waitForSelector(selectors.formContainer, { visible: true, timeout: 60000 });
    console.log('Form elements loaded...');

    for (const field of formFields.filter(field => field.inputValue)) {
      await fillFormField(page, field);
      await sleep(3000); // Short delay
    }

    const submitButton = await page.waitForSelector(selectors.submitButton, { visible: true, timeout: 30000 });
    await submitButton.click();

    console.log('Waiting for results...');
    const liftResult = await page.waitForSelector(selectors.resultsContainer, { visible: true, timeout: 60000 });
    if (!liftResult) {
      throw new Error(`Selector ${selectors.resultsContainer} not found`);
    }

    const result = await page.evaluate((exerciseName) => {

      const checkExerciseName = document
        .querySelector(".section-box.liftresult div#liftResults .title")
        .innerText.includes(exerciseName)

      if(!checkExerciseName){
        throw new Error('Error setting correct exercise')
      } else {
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
        if (td.className === "has-background-tablehighlight") {
          switch (index) {
            case 1: strengthLevel = 'beginner'; next_strength_level = 'novice'; break;
            case 2: strengthLevel = 'novice'; next_strength_level = 'intermediate'; break;
            case 3: strengthLevel = 'intermediate'; next_strength_level = 'advanced'; break;
            case 4: strengthLevel = 'advanced'; next_strength_level = 'elite'; break;
            default: strengthLevel = 'unknown'; next_strength_level = 'unknown'; break;
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

        // TODO: Check if input exercise name, gender, and reps match input
        return {
            exercise_name:exerciseName,
            strengthLevel,
            next_strength_level,
            body_weight,
            one_rep_max: parseFloat(oneRepMax),
            relative_strength_demographic: parseFloat(compare),
            relative_strength: parseFloat(lift),
            strengthBounds: renamedObj
        }
      }
    });

    console.log('Retrieved strength result:', result);
    await browser.close();
    return result;
  } catch (err) {
    console.error('Error retrieving strength level:', err);
    await browser.close();
    throw err;
  }
};


module.exports = {
  retrieveStrengthLevel,
};
