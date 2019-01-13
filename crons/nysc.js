const puppeteer = require('puppeteer');
const moment = require('moment');
const cron = require('node-cron');


// Helpers
const getEventTime = (desiredClass) => {
  return desiredClass.startHour + ":" + desiredClass.startMinute + ` ${desiredClass.amOrPm}`
}

// Main function
const nysc = async (username, password, desiredClass) => {
  try {

    // Initiate Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      defaultViewport: {
        width: 1400,
        height: 800
      }
     });
    const page = await browser.newPage();
    page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Brave Chrome/70.0.3538.110 Safari/537.36');

    // Log in
    await page.goto('https://www.newyorksportsclubs.com/login', { waitUntil: "domcontentloaded" }); // Bypasses "free trial" modals
    await page.type('#username', username);
    await page.type('#password', password);
    await page.click('#_submit');
    await page.waitForNavigation({ waitUntil: "domcontentloaded" }); // give it time to login

    // Navigate to class page and filter your gym
    const targetDay = moment().add(7, 'days').format("MM/DD"); // Classes open up exactly a week ahead
    await page.goto(`https://www.newyorksportsclubs.com/classes?day=${targetDay}&club=${desiredClass.location}`, { waitUntil: "domcontentloaded" });

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
    let countOfEvents = 0;
    let eventBooked = false;
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

      console.log('\n');
      console.log(event.name, '@', targetDay, event.time);
      console.log('Button:', await e.$eval('a.button', button => button.innerText));
      console.log(event.link);

      // Book the class
      if (event.name == desiredClass.name && event.time == getEventTime(desiredClass) && event.link) {
        const rsvpPage = await browser.newPage();
        rsvpPage.goto(event.link); // This reserves the class in a new tab
        console.log(`Class booked! ${desiredClass.name} @ ${targetDay} ${getEventTime(desiredClass)}`);
        await rsvpPage.waitForNavigation();
        eventBooked = true;
      }

      countOfEvents++;
      if (countOfEvents == events.length) {
        console.log('\n');
        eventBooked == true ? console.log(`SUCCESS: Event (${desiredClass.name} @ ${getEventTime(desiredClass)}) booked!`) : console.log(`FAILURE: Event (${desiredClass.name} @ ${getEventTime(desiredClass)}) wasn't booked`);
        await browser.close(); // Close the browser once we've looped through everything
      }
    }

  } catch (err) {
    console.log('*** ERROR ON OUR END ***:', err);
    await browser.close();
  }
}


// Start the crons when this file is run
const startCrons = (data) => {
  console.log("Starting up crons...");
  const MINUTES_AFTER_OPENING = 29; // Must be less than 30

  data.forEach( (user) => {
    const username = user.username;
    const password = user.password;
    const desiredClasses = user.desiredClasses;

    desiredClasses.forEach( (desiredClass) => {

      // Book each class n minutes after it becomes available
      cron.schedule(`${(Number(desiredClass.startMinute) + MINUTES_AFTER_OPENING).toString()} ${desiredClass.startHour} * * ${desiredClass.day}`, () => {
        console.log('\n');
        console.log(`Booking ${desiredClass.name} for next ${desiredClass.day} at ${getEventTime(desiredClass)}`);
        console.log(`The time now is ${moment().format("h:mm a, MM/DD")}`);
        nysc(username, password, desiredClass);
        console.log('\n');
        console.log('==========');
      });
    });
  });
}

module.exports = startCrons;
