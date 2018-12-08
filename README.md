# To connect to remote server:

`ssh -i ~/.ssh/AutoRSVP.pem ubuntu@ec2-52-55-7-111.compute-1.amazonaws.com`


# To deploy updates:

1. Stop processes
2. `rm -rf AutoRSVP` from the /server folder
3. `git clone https://github.com/joelsfoster/AutoRSVP.git`
4. Go into the folder and `npm i`
5. `nano nyscCredentials.js` and create a file that looks like: `module.exports { username: '', password: '' }`
6. `node nysc.js`
