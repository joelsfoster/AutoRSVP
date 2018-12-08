const puppeteer = require('puppeteer');
const moment = require('moment');
const cron = require('node-cron');

const nyscCredentials = require('./nyscCredentials.js');


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
    await page.waitForNavigation(); // give it time to login

    // Navigate to class page and filter your gym
    const targetDay = moment().add(7, 'days').format("MM/DD"); // Classes open up exactly a week ahead
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

      const event = { // commenting some out because some events don't have them and it messes with Puppeteer. Too lazy to account for right now.
        name:         await e.$eval('a.bigger', name => name.innerText),
        time:         await e.$eval('span.big', time => time.innerText.substring(0,8).trim()), // Parses out the start time
        link:         await e.$eval('a.button', button => button.innerText == "RESERVE" ? button.href : null),
        // duration:     await e.$$eval('li.table-list-item', duration => duration[2].innerText), // there are 3 lis, the third has what we want
        // instructor:   await e.$eval('a.link', instructor => instructor.innerText),
        // room:         await e.$eval('span.room', room => room.innerText.substring(2)), // removes unnecessary "@ " prefix in the string
        // address:      await e.$eval('span.address', address => address.innerText)
      }

      // console.log('\n');
      // console.log(event.name, '@', targetDay, event.time);
      // console.log(event.link);

      // Book the class
      if (event.name == desiredClass.name && event.time == desiredClass.time() && event.link) {
        page.goto(event.link); // This reserves the class
      } else {
        console.log('Class not found, or is full or unavailable');
      }
    }

  } catch (err) {
    console.log('*** ERROR ON OUR END ***:', err);
  }
}


// User-specified desired classes. All strings must be EXACT matches!!!
const _desiredClasses = [
  {
    name: "Total Body Conditioning",
    time: function() { return this.startHour + ":" + this.startMinute + ` ${this.amOrPm}` },
    startHour: "10",
    startMinute: "00",
    amOrPm: "AM",
    day: "Saturday",
    location: "astoria" // CASE SENSITIVE!!! words are separated by dashes
  },
  {
    name: "Cycling",
    time: function() { return this.startHour + ":" + this.startMinute + ` ${this.amOrPm}` },
    startHour: "9",
    startMinute: "00",
    amOrPm: "AM",
    day: "Sunday",
    location: "astoria" // CASE SENSITIVE!!! words are separated by dashes
  },
  {
    name: "Cycling",
    time: function() { return this.startHour + ":" + this.startMinute + ` ${this.amOrPm}` },
    startHour: "6",
    startMinute: "30",
    amOrPm: "AM",
    day: "Tuesday",
    location: "51st-lexington" // CASE SENSITIVE!!! words are separated by dashes
  }
]


// Start the crons when this file is run
const startCrons = (desiredClasses) => {
  desiredClasses.map(desiredClass => {
    const MINUTES_AFTER_OPENING = 1;

    // Book each class 1 minute after it becomes available
    cron.schedule(`${(Number(desiredClass.startMinute) + MINUTES_AFTER_OPENING).toString()} ${desiredClass.startHour} * * ${desiredClass.day}`, () => {
      console.log(`Booking ${desiredClass.name} for next ${desiredClass.day} at ${desiredClass.time()}`);
      nysc(desiredClass);
    });
  });
}

startCrons(_desiredClasses);
