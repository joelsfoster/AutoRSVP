# To connect to remote server:

`ssh -i ~/.ssh/AutoRSVP.pem ubuntu@ec2-52-55-7-111.compute-1.amazonaws.com`


# Ubuntu dependencies:

`sudo apt-get install -y gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget`


# To deploy updates and start the cron:

1. Stop processes
2. `rm -rf AutoRSVP` from the /server folder
3. `git clone https://github.com/joelsfoster/AutoRSVP.git`
4. Go into the folder and `npm i`
5. `nano data.js` and create a file that looks like:
```
module.exports = [
  {
    username: 'USERNAME',
    password: 'PASSWORD',
    desiredClasses: [
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
  }
]
```
6. Use `tmux` to start a session where you run `node nysc.js`
7. Use `ctrl+b` and then `d` to exit tmux, and safely exit SSH
8. To re-enter the process, use `tmux attach`
