const puppeteer = require('puppeteer');
const moment = require('moment');
// const cron = require('node-cron');

const nyscCredentials = require('./nyscCredentials.js');


// Start the cron when this file is run
// cron.schedule('* * * * *', () => { // TODO make this cron run immediately when a class' RSVPs are open
//   console.log('running every minute');
//   nysc();
// });

const nysc = async (desiredClass) => {
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

    // Navigate to class page and filter your gym
    const targetDay = moment().add(7, 'days').format("MM/DD");
    await page.goto(`https://www.newyorksportsclubs.com/classes?day=${targetDay}&club=${desiredClass.location}`);

    // Load all that there is to load (takes care of any pagination)
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
      const tryWrapper = async (func) => { try { return func } catch (err) { return null } };

      const event = {
        name:         await tryWrapper(e.$eval('a.bigger', eventName => eventName.innerText)),
        duration:     await tryWrapper(e.$$eval('li.table-list-item', eventDuration => eventDuration[2].innerText)), // there are 3 lis, the third has what we want
        instructor:   await tryWrapper(e.$eval('a.link', eventInstructor => eventInstructor.innerText)),
        time:         await tryWrapper(e.$eval('span.big', eventTime => eventTime.innerText.substring(0,8).trim())), // Parses out the start time
        room:         await tryWrapper(e.$eval('span.room', eventRoom => eventRoom.innerText.substring(2))), // removes unnecessary "@ " prefix in the string
        address:      await tryWrapper(e.$eval('span.address', eventAddress => eventAddress.innerText)),
        link:         await tryWrapper(e.$eval('a.reserve', eventLink => eventLink.href))
      }

      console.log('\n');
      console.log(event.name, `(${event.duration})`, 'with', event.instructor);
      console.log(targetDay, '|', event.time);
      console.log(event.room, '@', event.address);
      console.log(event.link);

      // Book the class if it's available
      if (event.name == desiredClass.name && event.time == desiredClass.time) {
        page.goto(event.link);
        // TODO next, click "reserve"
      }
    }

  } catch (err) {
    console.log('*** ERROR ON OUR END ***:', err);
  }
}

// Run the function with the specified params
const _desiredClass = { // TODO Let the user specify this
  name: "Cycling",
  time: "9:00 AM",
  location: "astoria" // CASE SENSITIVE!!! words are separated by dashes
}
nysc(_desiredClass);
