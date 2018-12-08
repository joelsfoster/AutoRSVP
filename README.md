# To connect to remote server:

`ssh -i ~/.ssh/AutoRSVP.pem ubuntu@ec2-52-55-7-111.compute-1.amazonaws.com`


# To deploy updates:

Stop processes
`rm -rf AutoRSVP` from the /server folder
`git clone https://github.com/joelsfoster/AutoRSVP.git`
Go into the folder and `npm i`
`nano nyscCredentials.js` and create a file that looks like: `module.exports { username: '', password: '' }`
`node nysc.js`
