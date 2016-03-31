// npm install express
// documentation: http://expressjs.com

// Include express module and initialize app
var express = require('express');
var app = express();

// Create an array that is kept on server
var items = ['something'];


/////////////////////////////////
// Set up routes (paths)
// Note: res.sendfile() sends a file.
// res.json() can send any JS object as JSON, which may be easier to parse on front end.


// When user visits root, display "hello world!"
// http://localhost:3000/
app.get('/', function (req, res) {
  res.sendfile('public/index.html');
});

// When user visits this path, random number is printed.
// http://localhost:3000/getRandomNum
app.get('/getRandomNum', function(req, res) {
  var num = Math.random();
  res.json(num);
});

// When user visits this path, random item from array is printed.
// http://localhost:3000/getRandomItem
app.get('/getRandomItem', function(req, res) {
  var index = Math.floor(Math.random()*items.length);
  var it = items[index];
  res.json(it);
});

// When user visits this path, an argument is extracted from URL and saved in items array.
// http://localhost:3000/addItem?item=blah
app.get('/addItem', function(req, res) {
  // req.query.xx will extract and return the content after xx= in the url
  var item = req.query.item;
  items.push(item);
  res.json('thanks!');
  console.log('added item '+item);
});

// Start server listening on port 3000
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});