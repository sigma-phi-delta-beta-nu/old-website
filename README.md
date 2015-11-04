# Sigma Phi Delta Website #

This is the code for the Sigma Phi Delta Fraternity website.

### To install: ###
Note: this assumes you have a working Node.js and MongoDB setup.
Run the following command to install dependencies:
```
npm install
```

### To run: ###
1) Start the MongoDB server
```
mongod --dbpath ./db/data
```

2) Start the HTTP redirect server
```
npm run-script http
```

3) Start the HTTPS server
```
npm run-script https
```
