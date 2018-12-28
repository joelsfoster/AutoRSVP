# To connect to remote server:

`ssh -i ~/.ssh/AutoRSVP.pem ubuntu@ec2-52-55-7-111.compute-1.amazonaws.com`


# Ubuntu dependencies:

`sudo apt-get install -y gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget`


# To deploy updates and start the cron:

1. Stop processes
2. `rm -rf AutoRSVP` from the /server folder
3. `git clone https://github.com/joelsfoster/AutoRSVP.git`
4. Go into the folder and `npm i`
5. Use `tmux` to start a session where you run `npm start`
6. Use `ctrl+b` and then `d` to exit tmux
7. To re-enter the process, use `tmux attach`


# Roadmap / todos

- Use public/private encryption with an environment variable on the server to protect passwords in the DB
- Front end: Log in (Google/Facebook OAuth) and get sent to single-page dashboard with RSVP history
- Front end: Fields for NYSC email and password, and classes you’d like to RSVP for
- Front end: Stripe payments
- Write scraper to identify which gyms/classes get full super quickly
