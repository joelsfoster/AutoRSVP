# To connect to remote server:

`ssh -i ~/.ssh/AutoRSVP.pem ubuntu@ec2-52-55-7-111.compute-1.amazonaws.com`


# To deploy updates:

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
6. `node nysc.js`
