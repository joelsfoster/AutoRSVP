const puppeteer = require('puppeteer');
const moment = require('moment');
// const cron = require('node-cron');

const nyscCredentials = require('./nyscCredentials.js');
// const classes = require('./classes.js');


// Start the cron when this file is run
// cron.schedule('* * * * *', () => {
//   console.log('running every minute');
//   nysc();
// });

const nysc = async () => {
  try {

    // Initiate Puppeteer
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: {
        width: 1400,
        height: 800
      }
     });
    const page = await browser.newPage();
    page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Brave Chrome/70.0.3538.110 Safari/537.36');

    // Log in
    await page.goto('https://www.newyorksportsclubs.com/login');
    await page.waitForSelector('.login-form');
    await page.type('#username', nyscCredentials.username);
    await page.type('#password', nyscCredentials.password);
    await page.click('#_submit');

    // Navigate to class page
    const targetDay = moment().add(7, 'days').format("MM/DD");
    await page.goto('https://www.newyorksportsclubs.com/classes' + `?day=${targetDay}`);

    // Load all that there is to load (takes care of pagination so we grab ALL events there are to see!)
    const loadMore = async () => {
      try {
        await page.click('#load-more');
        await loadMore();
      } catch (err) {
        return;
      }
    }
    await loadMore();

    // Get all the event rows then loop through each of them
    const events = await page.$$('#events-list > div.row');
    for (const e of events) {
      const event = {
        name:         await e.$eval('a.bigger', eventName => eventName.innerText),
        duration:     await e.$$eval('li.table-list-item', eventDuration => eventDuration[2].innerText), // there are 3 lis, the third has what we want
        instructor:   await e.$eval('a.link', eventInstructor => eventInstructor.innerText),
        time:         await e.$eval('span.big', eventTime => eventTime.innerText), // TODO separate start time and end time
        room:         await e.$eval('span.room', eventRoom => eventRoom.innerText.substring(2)), // removes unnecessary "@ " prefix in the string
        address:      await e.$eval('span.address', eventAddress => eventAddress.innerText),
        link:         await e.$eval('a.reserve', eventLink => eventLink.href) // TODO FIX THIS WHEN BUTTON IS DISABLED
      }

      console.log('\n');
      console.log(event.name, `(${event.duration})`, 'with', event.instructor);
      console.log(targetDay, '|', event.time);
      console.log(event.room, '@', event.address);
      console.log(event.link);
    }

    // console.log(events.length);
    // await page.goto('https://www.newyorksportsclubs.com/classes/35197705/reserve');



  } catch (err) {
    console.log('*** ERROR ON OUR END ***:', err);
  }
}

nysc();
