var x, y;
var temp = 0;
var angle = 0;
var windmag = 0;
var bg = 255;

function setup() {
  createCanvas(300, 100);
  
  var url = 'http://api.openweathermap.org/data/2.5/weather?q=New%20York,NY&units=imperial&APPID=7bbbb47522848e8b9c26ba35c226c734';
  loadJSON(url, gotWeather);
  textSize(20);
  noStroke();

  x = width/2;
  y = height/2;
}

function gotWeather(weather) {
  temp = weather.main.temp;
  angle = radians(Number(weather.wind.deg));
  windmag = Number(weather.wind.speed);
  bg = map(temp, 0, 100, 0, 255);
}

function draw() {

  background(bg);

  fill(255);
  text(temp, 10, 30);

  x += windmag * cos(angle);
  y += windmag * sin(angle);

  if (x > width + 10) x = 0;
  else if (x < -10) x = width;
  if (y > height + 10) y = 0;
  else if (y < -10)  y = height;

  fill(0);
  ellipse(x, y, 20, 20);
}