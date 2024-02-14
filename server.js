const http = require("http");
const app = require("./app");
const fetchWeather = require('./data/getWeather')

const port = process.env.PORT || 4000;

const server = http.createServer(app);

server.listen(port);
fetchWeather
