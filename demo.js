// Learned from https://www.youtube.com/watch?v=IvaJ5n5xFqU

const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Brave Chrome/70.0.3538.110 Safari/537.36');

    await page.goto('https://experts.shopify.com/');
    await page.waitForSelector('.section');
    const sections = await page.$$('.section');

    for (let i = 0; i < sections.length; i++) {
      await page.goto('https://experts.shopify.com/'); // go to page
      await page.waitForSelector('.section'); // wait for it to load these sections
      const sections = await page.$$('.section'); // grab the sections

      const section = sections[i]; // grab the section of this iteration of the loop
      const button = await section.$('a.marketing-button'); // grab the button
      const buttonName = await page.evaluate(button => button.innerText, button); // grab the name of the button
      console.log('\n' + buttonName); // print a space and the name of the button
      button.click(); // click the button

      await page.waitForSelector('#ExpertsResults'); // wait for the page to load
      const lis = await page.$$('#ExpertsResults > li'); // grab all the lis on the page

      for (const li of lis) { // loop over each LI on the inner page
        const name = await li.$eval('h2', h2 => h2.innerText); // grab the name of each LI
        console.log('Name:', name); // print it out
      }
    }

  } catch (e) {
    console.log('ERROR ON OUR END:', e);
  }
})();
